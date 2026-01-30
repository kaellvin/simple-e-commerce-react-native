import { Session } from "@supabase/supabase-js";
import { debounce, DebouncedFunc } from "lodash";
import { useEffect, useReducer, useRef } from "react";
import { deleteCartItem, getCart, updateCartItems } from "../api/cart/cart.api";
import { Cart, CartItemUpdate } from "../types/cart/cart";
import useAuth from "./useAuth";
import useToast from "./useToast";

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
  | { type: "loadInProgress" }
  | { type: "refreshInProgress" }
  | { type: "updateInProgress" }
  | { type: "loadSuccess"; payload: Cart | null }
  | { type: "updateSuccess"; payload: Cart | null }
  | {
      type: "checkboxToggled";
      payload: { isChecked: boolean; productVariantId: string };
    }
  | {
      type: "updateQuantity";
      payload: { newQuantity: number; productVariantId: string };
    }
  | {
      type: "restoreQuantity";
      payload: Map<string, number>;
    };

const initialState: CartState = {
  status: CartStatus.Initial,
  cart: null,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "loadInProgress":
      return { ...state, status: CartStatus.Loading };
    case "refreshInProgress":
      return { ...state, status: CartStatus.Refreshing };
    case "updateInProgress":
      return { ...state, status: CartStatus.Updating };
    case "loadSuccess":
      return { ...state, status: CartStatus.Success, cart: action.payload };
    case "updateSuccess":
      return { ...state, cart: action.payload };
    case "checkboxToggled":
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
    case "updateQuantity":
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
    case "restoreQuantity":
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
  }
};

function useCart() {
  const { session } = useAuth();
  const { showToast } = useToast();

  const prevCartItemQuantityMapRef = useRef<Map<string, number>>(new Map());
  const pendingCartItemUpdateMapRef = useRef<Map<string, CartItemUpdate>>(
    new Map(),
  );
  const debouncedCartItemUpdateRef =
    useRef<DebouncedFuncForCartItemUpdate>(null);

  const [state, dispatch] = useReducer(cartReducer, initialState);

  //optimistic update(experimental)
  // const [optimisticCart, updateOptimisticCart] = useOptimistic<
  //   Cart,
  //   QuantityUpdate
  // >(cart!, (currentCart, optimisticQuantityUpdate) => {
  //   const { quantity, productVariantId } = optimisticQuantityUpdate;

  //   return {
  //     ...currentCart,
  //     cartItemAndSelections: [
  //       ...currentCart.cartItemAndSelections.map((item) => ({
  //         ...item,
  //         cartItem:
  //           item.cartItem.productVariantId === productVariantId
  //             ? {
  //                 ...item.cartItem,
  //                 quantity: quantity,
  //               }
  //             : item.cartItem,
  //       })),
  //     ],
  //   };
  // });

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
      type: "updateQuantity",
      payload: { newQuantity: newQuantity, productVariantId: productVariantId },
    });
  };

  const _restoreCartItemQuantity = () => {
    let prevCartItemQuantityMap = prevCartItemQuantityMapRef.current;

    dispatch({ type: "restoreQuantity", payload: prevCartItemQuantityMap });

    //reset
    prevCartItemQuantityMapRef.current.clear();
    pendingCartItemUpdateMapRef.current.clear();
  };

  const deleteCartItemFromCart = async (productVariantId: string) => {
    if (!state.cart || !session) return;

    try {
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
        showToast("Something wrong. Please try again later.");
      }
    }
  };

  const onRefresh = async () => {
    if (!session) return;

    await getCartDetail(session, { isRefresh: true });

    showToast("Updated Information.");
  };

  const onCheckboxChange = (isChecked: boolean, productVariantId: string) => {
    dispatch({
      type: "checkboxToggled",
      payload: { isChecked: isChecked, productVariantId: productVariantId },
    });
  };

  return {
    state,
    cartItemCount: state.cart?.cartItemAndSelections.length ?? 0,
    onCheckboxChange,
    updateQuantity,
    deleteCartItemFromCart,
    onRefresh,
  };
}

export default useCart;
