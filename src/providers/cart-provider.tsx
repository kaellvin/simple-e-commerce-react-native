import {
  addCartItem,
  deleteCartItem,
  getCart,
  updateCartItem,
  updateCartItems,
} from "@/src/api/cart/cart.api";
import useAuth from "@/src/hooks/use-auth";
import useLoadingModal from "@/src/hooks/use-loading-modal";
import useMaximumQuantityExceededModal from "@/src/hooks/use-maximum-quantity-exceeded-modal";
import useToast from "@/src/hooks/use-toast";
import {
  Cart,
  CartItemAdd,
  CartItemQuantityUpdate,
  CartItemUpdate,
} from "@/src/types/cart/cart";
import { Session } from "@supabase/supabase-js";
import { debounce, DebouncedFunc } from "lodash";
import React, { createContext, useEffect, useReducer, useRef } from "react";

type DebouncedFuncForCartItemUpdate = DebouncedFunc<() => Promise<void>> | null;

export enum CartStatus {
  Initial,
  Loading,
  Updating,
  Refreshing,
  Success,
  Failure,
}

type CartState = {
  status: CartStatus;
  cart: Cart | null;
};

type CartAction =
  | { type: "stateReset" }
  | { type: "loadInProgress" }
  | { type: "refreshInProgress" }
  | { type: "updateInProgress" }
  | { type: "loadSuccess"; payload: Cart | null }
  | { type: "updateSuccess"; payload: Cart | null }
  | {
      type: "toggleCartItemSelection";
      payload: { isChecked: boolean; productVariantId: string };
    }
  | {
      type: "updateCartItemQuantity";
      payload: { newQuantity: number; productVariantId: string };
    }
  | {
      type: "restoreCartItemQuantity";
      payload: Map<string, number>;
    }
  | { type: "restoreRemovedCartItem"; payload: Cart };

const initialState: CartState = {
  status: CartStatus.Initial,
  cart: null,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "stateReset":
      return { cart: null, status: CartStatus.Initial };
    case "loadInProgress":
      return { ...state, status: CartStatus.Loading };
    case "refreshInProgress":
      return { ...state, status: CartStatus.Refreshing };
    case "updateInProgress":
      return { ...state, status: CartStatus.Updating };
    case "loadSuccess":
      return { ...state, status: CartStatus.Success, cart: action.payload };
    case "updateSuccess":
      return { ...state, status: CartStatus.Success, cart: action.payload };
    case "toggleCartItemSelection":
      return {
        ...state,
        cart:
          state.cart === null
            ? null
            : {
                ...state.cart,
                cartItemAndSelections: state.cart.cartItemAndSelections.map(
                  (item) => ({
                    ...item,
                    isChecked:
                      item.cartItem.productVariantId ===
                      action.payload.productVariantId
                        ? action.payload.isChecked
                        : item.isChecked,
                  }),
                ),
              },
      };
    case "updateCartItemQuantity":
      return {
        ...state,
        cart:
          state.cart === null
            ? null
            : {
                ...state.cart,
                cartItemAndSelections: [
                  ...state.cart.cartItemAndSelections.map((item) => ({
                    ...item,
                    cartItem:
                      item.cartItem.productVariantId ===
                      action.payload.productVariantId
                        ? {
                            ...item.cartItem,
                            quantity: action.payload.newQuantity,
                          }
                        : item.cartItem,
                  })),
                ],
              },
      };
    case "restoreCartItemQuantity":
      let prevCartItemQuantityMap = action.payload;
      return {
        ...state,
        cart:
          state.cart === null
            ? null
            : {
                ...state.cart,
                cartItemAndSelections: [
                  ...state.cart.cartItemAndSelections.map((item) => {
                    let productVariantId = item.cartItem.productVariantId;
                    if (prevCartItemQuantityMap.has(productVariantId)) {
                      return {
                        ...item,
                        cartItem: {
                          ...item.cartItem,
                          quantity:
                            prevCartItemQuantityMap.get(productVariantId)!,
                        },
                      };
                    }
                    return { ...item };
                  }),
                ],
              },
      };
    case "restoreRemovedCartItem":
      return {
        ...state,
        status: CartStatus.Success,
        cart: action.payload,
      };
  }
};

function CartProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const { showToast } = useToast();
  const { setMaxQuantityExceededAlertState } =
    useMaximumQuantityExceededModal();
  const { setIsVisible } = useLoadingModal();

  const prevCartItemQuantityMapRef = useRef<Map<string, number>>(new Map());
  const pendingCartItemUpdateMapRef = useRef<Map<string, CartItemUpdate>>(
    new Map(),
  );
  const animationResetMapRef = useRef<Map<string, () => void>>(new Map());
  const debouncedCartItemUpdateRef =
    useRef<DebouncedFuncForCartItemUpdate>(null);
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    if (session !== null) {
      getCartDetail(session, {});

      //debounce func
      const debouncedFunc = debounce(async () => {
        if (session === null) return;

        try {
          await updateCartItems(session.access_token, [
            ...pendingCartItemUpdateMapRef.current.values(),
          ]);
        } catch (error) {
          if (error instanceof Error) {
            //rollback
            _restoreCartItemQuantity();
          }
        } finally {
        }
      }, 500);

      debouncedCartItemUpdateRef.current = debouncedFunc;

      return () => {
        debouncedCartItemUpdateRef.current?.cancel();
      };
    } else {
      dispatch({ type: "stateReset" });
    }
  }, [session]);

  const getCartDetail = async (
    session: Session,
    { isRefresh = false }: { isRefresh?: boolean },
  ) => {
    try {
      if (isRefresh) {
        dispatch({ type: "refreshInProgress" });
      } else {
        dispatch({ type: "loadInProgress" });
      }

      const accessToken = session.access_token;
      const cart = await getCart(accessToken);
      dispatch({ type: "loadSuccess", payload: cart });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  const getCartItemCount = () => state.cart?.cartItemAndSelections.length ?? 0;

  const validateBeforeAddingCartItem = async (
    quantity: number,
    stock: number,
    productVariantId: string,
  ) => {
    if (!session) return;
    const cart = state.cart;
    let newQuantity = quantity;

    if (cart === null) {
      try {
        setIsVisible(true);
        dispatch({ type: "updateInProgress" });

        const cartItemAdd: CartItemAdd = {
          quantity: newQuantity,
          productVariantId: productVariantId,
        };
        await addCartItem(session.access_token, cartItemAdd);
        const newCart = await getCart(session.access_token);

        dispatch({ type: "updateSuccess", payload: newCart });
        showToast("Added product to cart.");
      } catch (error) {
        if (error instanceof Error) {
          showToast("Something wrong. Please try again later.");
        }
      } finally {
        setIsVisible(false);
      }
    } else {
      const cartItemAndSelection = cart.cartItemAndSelections.find(
        (item) => item.cartItem.productVariantId === productVariantId,
      );

      if (cartItemAndSelection) {
        newQuantity += cartItemAndSelection.cartItem.quantity;
      }

      if (newQuantity > stock) {
        setMaxQuantityExceededAlertState({
          isOpen: true,
          stock: stock,
        });
      } else {
        try {
          setIsVisible(true);
          dispatch({ type: "updateInProgress" });

          const cartItemQuantityUpdate: CartItemQuantityUpdate = {
            quantity: newQuantity,
            cartId: cart.id,
          };
          const newCart = await updateCartItem(
            session.access_token,
            productVariantId,
            cartItemQuantityUpdate,
          );
          dispatch({ type: "updateSuccess", payload: newCart });
          showToast("Added product to cart.");
        } catch (error) {
          if (error instanceof Error) {
            showToast("Something wrong. Please try again later.");
          }
        } finally {
          setIsVisible(false);
        }
      }
    }
  };

  const onCheckboxChange = (isChecked: boolean, productVariantId: string) => {
    dispatch({
      type: "toggleCartItemSelection",
      payload: { isChecked: isChecked, productVariantId: productVariantId },
    });
  };

  const updateQuantity = async (
    newQuantity: number,
    quantity: number,
    productVariantId: string,
  ) => {
    if (!state.cart || !session || !debouncedCartItemUpdateRef.current) return;

    _updateCartItemQuantity(newQuantity, productVariantId);

    //track pending cart update
    pendingCartItemUpdateMapRef.current.set(productVariantId, {
      newQuantity: newQuantity,
      quantity: quantity,
      productVariantId: productVariantId,
      cartId: state.cart.id,
    });

    //keep old quantity as fallback
    let prevCartItemQuantityMap = prevCartItemQuantityMapRef.current;
    if (!prevCartItemQuantityMap.has(productVariantId)) {
      prevCartItemQuantityMap.set(productVariantId, quantity);
    }

    debouncedCartItemUpdateRef.current();
  };

  const _updateCartItemQuantity = (
    newQuantity: number,
    productVariantId: string,
  ) => {
    dispatch({
      type: "updateCartItemQuantity",
      payload: { newQuantity: newQuantity, productVariantId: productVariantId },
    });
  };

  const _restoreCartItemQuantity = () => {
    let prevCartItemQuantityMap = prevCartItemQuantityMapRef.current;

    dispatch({
      type: "restoreCartItemQuantity",
      payload: prevCartItemQuantityMap,
    });

    //reset
    prevCartItemQuantityMapRef.current.clear();
    pendingCartItemUpdateMapRef.current.clear();
  };

  const deleteCartItemFromCart = async (productVariantId: string) => {
    if (!state.cart || !session) return;

    const cachedCart = structuredClone(state.cart);

    try {
      setIsVisible(true);
      dispatch({ type: "updateInProgress" });
      const newCart = await deleteCartItem(
        session.access_token,
        state.cart.id,
        productVariantId,
      );
      dispatch({ type: "updateSuccess", payload: newCart });
      showToast("Cart item removed successfully.");
    } catch (error) {
      if (error instanceof Error) {
        animationResetMapRef.current.get(productVariantId)?.();
        dispatch({ type: "restoreRemovedCartItem", payload: cachedCart });
        showToast("Something wrong. Please try again later.");
      }
    } finally {
      setIsVisible(false);
    }
  };

  const onRefresh = async () => {
    if (!session) return;

    await getCartDetail(session, { isRefresh: true });

    showToast("Updated Information.");
  };

  const onCheckout = () => {
    showToast(
      "This is a prototype application. No checkout operations will occur.",
    );
  };

  return (
    <CartContext
      value={{
        state,
        getCartItemCount,
        animationResetMapRef,
        validateBeforeAddingCartItem,
        onCheckboxChange,
        updateQuantity,
        deleteCartItemFromCart,
        onRefresh,
        onCheckout,
      }}
    >
      {children}
    </CartContext>
  );
}

interface ICartContext {
  state: CartState;
  getCartItemCount: () => number;
  animationResetMapRef: React.RefObject<Map<string, () => void>>;
  validateBeforeAddingCartItem: (
    quantity: number,
    stock: number,
    productVariantId: string,
  ) => Promise<void>;
  onCheckboxChange: (isChecked: boolean, productVariantId: string) => void;
  updateQuantity: (
    newQuantity: number,
    quantity: number,
    productVariantId: string,
  ) => Promise<void>;
  deleteCartItemFromCart: (productVariantId: string) => Promise<void>;
  onRefresh: () => Promise<void>;
  onCheckout: () => void;
}

export const CartContext = createContext<ICartContext | undefined>(undefined);

export default CartProvider;
