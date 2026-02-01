import { CartContext } from "@/providers/cart-provider";
import { useContext } from "react";

function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within provider");
  }
  return context;
}

export default useCart;
