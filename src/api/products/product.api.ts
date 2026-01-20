import { ProductResponse } from "@/src/types/product/product";
import { fetchWithErrorHanding } from "@/utils/my-utils";
import { toProduct } from "./product.map";

export const getProducts = async () => {
  const data = await fetchWithErrorHanding<ProductResponse>(
    `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/public/v1/products`,
  );

  const products = data.data.map((item) => toProduct(item));

  return products;
};
