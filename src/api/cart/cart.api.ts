import { GETCartResponse } from "@/src/types/cart/cart";
import { fetchWithErrorHanding } from "@/utils/my-utils";
import { toCart } from "./cart.map";

export const getCart = async (accessToken: string) => {
  const data = await fetchWithErrorHanding<GETCartResponse>(
    `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/public/v1/cart?details=true`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const cart = data.data;

  if (cart) {
    return toCart(cart);
  } else {
    return null;
  }
};
