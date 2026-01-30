import {
  CartItemUpdate,
  CartResponse,
  DELETECartItemResponse,
  GETCartResponse,
} from "@/src/types/cart/cart";
import { fetchWithErrorHanding } from "@/utils/my-utils";
import { toCart, toCartItemUpdateRequest } from "./cart.map";

export const getCart = async (accessToken: string) => {
  const response = await fetchWithErrorHanding<GETCartResponse>(
    `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/public/v1/cart?details=true`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const cart = response.data;

  if (cart) {
    return toCart(cart);
  } else {
    return null;
  }
};

export const updateCartItems = async (
  accessToken: string,
  cartItemUpdateList: CartItemUpdate[],
) => {
  const response = await fetchWithErrorHanding<CartResponse>(
    `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/public/v1/cart/items`,
    {
      method: "PATCH",
      body: JSON.stringify({
        cartItemList: cartItemUpdateList.map(toCartItemUpdateRequest),
      }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  const cart = response.data;

  if (cart) {
    return toCart(cart);
  } else {
    return null;
  }
};

export const deleteCartItem = async (
  accessToken: string,
  cartId: string,
  productVariantId: string,
) => {
  const response = await fetchWithErrorHanding<DELETECartItemResponse>(
    `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/public/v1/cart/items/?cartId=${cartId}&productVariantId=${productVariantId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return response.data;
};
