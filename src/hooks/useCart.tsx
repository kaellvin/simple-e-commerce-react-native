import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { getCart } from "../api/cart/cart.api";
import { Cart } from "../types/cart/cart";
import useAuth from "./useAuth";

function useCart() {
  const { session } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCartDetail = async (session: Session) => {
    try {
      setIsLoading(true);
      const accessToken = session.access_token;
      const cart = await getCart(accessToken);
      setCart(cart);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session !== null) {
      getCartDetail(session);
    }
  }, [session]);

  return {
    isLoading,
    cart,
    cartItemCount: cart?.cartItemAndSelections.length ?? 0,
    setCart,
  };
}

export default useCart;
