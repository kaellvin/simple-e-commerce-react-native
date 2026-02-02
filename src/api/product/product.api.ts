import {
  ProductDetailResponse,
  ProductResponse,
} from "@/src/types/product/product";
import { fetchWithErrorHanding } from "@/src/utils/my-utils";
import { toProduct, toProductDetail } from "./product.map";

export const getProducts = async (query?: string) => {
  const params = new URLSearchParams();
  if (query) {
    params.append("query", query);
  }
  const queryParameterString = params.toString() ? `?${params.toString()}` : ""; //empty string considered false

  const data = await fetchWithErrorHanding<ProductResponse>(
    `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/public/v1/products${queryParameterString}`,
  );

  const products = data.data.map(toProduct);

  return products;
};

export const getProduct = async (id: string) => {
  const data = await fetchWithErrorHanding<ProductDetailResponse>(
    `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/public/v1/products/${id}`,
  );
  const productDetail = data.data;
  if (productDetail) {
    return toProductDetail(productDetail);
  } else {
    return null;
  }
};
