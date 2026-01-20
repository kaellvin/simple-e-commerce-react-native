import { useCallback, useEffect, useState } from "react";
import { getProducts } from "../api/products/product.api";
import { Product } from "../types/product/product";

function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const getHomeProducts = useCallback(async () => {
    try {
      setIsLoading(false);
      const products = await getProducts();
      setProducts(products);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getHomeProducts();
  }, [getHomeProducts]);

  return { isLoading, error, products, getHomeProducts };
}

export default useProducts;
