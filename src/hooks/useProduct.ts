import { useCallback, useState } from "react";
import { getProduct } from "../api/products/product.api";
import { ProductDetail } from "../types/product/product";

function useProduct() {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const getProductDetail = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const product = await getProduct(id);
      setProduct(product);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, product, getProductDetail };
}

export default useProduct;
