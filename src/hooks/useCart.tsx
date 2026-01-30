import { Session } from "@supabase/supabase-js";
import { debounce, DebouncedFunc } from "lodash";
import { useEffect, useRef, useState } from "react";
import { deleteCartItem, getCart, updateCartItems } from "../api/cart/cart.api";
import { Cart, CartItemUpdate } from "../types/cart/cart";
import useAuth from "./useAuth";
import useToast from "./useToast";

type DebouncedFuncForCartItemUpdate = DebouncedFunc<() => Promise<void>> | null;

function useCart() {
  const { session } = useAuth();
  const { showToast } = useToast();

  const prevCartItemQuantityMapRef = useRef<Map<string, number>>(new Map());
  const pendingCartItemUpdateMapRef = useRef<Map<string, CartItemUpdate>>(
    new Map(),
  );
  const debouncedCartItemUpdateRef =
    useRef<DebouncedFuncForCartItemUpdate>(null);

  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
      if (!isRefresh) {
        setIsLoading(true);
      }

      const accessToken = session.access_token;
      const cart = await getCart(accessToken);
      setCart(cart);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    } finally {
      if (!isRefresh) {
        setIsLoading(false);
      }
    }
  };

  const updateQuantity = async (
    newQuantity: number,
    quantity: number,
    productVariantId: string,
  ) => {
    if (!cart || !session || !debouncedCartItemUpdateRef.current) return;

    _updateCartItemQuantity(newQuantity, productVariantId);

    //track pending cart update
    pendingCartItemUpdateMapRef.current.set(productVariantId, {
      newQuantity: newQuantity,
      quantity: quantity,
      productVariantId: productVariantId,
      cartId: cart.id,
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
    setCart((prevCart) => {
      if (prevCart === null) return null;
      return {
        ...prevCart,
        cartItemAndSelections: [
          ...prevCart.cartItemAndSelections.map((item) => ({
            ...item,
            cartItem:
              item.cartItem.productVariantId === productVariantId
                ? {
                    ...item.cartItem,
                    quantity: newQuantity,
                  }
                : item.cartItem,
          })),
        ],
      };
    });
  };

  const _restoreCartItemQuantity = () => {
    let prevCartItemQuantityMap = prevCartItemQuantityMapRef.current;

    setCart((prevCart) => {
      if (prevCart === null) return null;
      return {
        ...prevCart,
        cartItemAndSelections: [
          ...prevCart.cartItemAndSelections.map((item) => {
            let productVariantId = item.cartItem.productVariantId;
            if (prevCartItemQuantityMap.has(productVariantId)) {
              return {
                ...item,
                cartItem: {
                  ...item.cartItem,
                  quantity: prevCartItemQuantityMap.get(productVariantId)!,
                },
              };
            }
            return { ...item };
          }),
        ],
      };
    });

    //reset
    prevCartItemQuantityMapRef.current.clear();
    pendingCartItemUpdateMapRef.current.clear();
  };

  const deleteCartItemFromCart = async (productVariantId: string) => {
    if (!cart || !session) return;

    try {
      const newCart = await deleteCartItem(
        session.access_token,
        cart.id,
        productVariantId,
      );
      setCart(newCart);
      showToast("Cart item removed successfully.");
    } catch (error) {
      if (error instanceof Error) {
        showToast("Something wrong. Please try again later.");
      }
    }
  };

  const onRefresh = async () => {
    if (!session) return;

    setRefreshing(true);
    await getCartDetail(session, { isRefresh: true });
    setRefreshing(false);
    showToast("Updated Information.");
  };

  return {
    isLoading,
    refreshing,
    cart,
    cartItemCount: cart?.cartItemAndSelections.length ?? 0,
    setCart,
    updateQuantity,
    deleteCartItemFromCart,
    onRefresh,
  };
}

export default useCart;
