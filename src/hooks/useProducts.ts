import { useCallback, useEffect, useState } from "react";
import { Keyboard } from "react-native";
import { getProducts } from "../api/products/product.api";
import { Product } from "../types/product/product";
import useToast from "./useToast";

function useProducts() {
  const [refreshing, setRefreshing] = useState(false);
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState("");
  const [isSearchSubmitted, setIsSearchSubmitted] = useState<boolean>(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const [products, setProducts] = useState<Product[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { showToast } = useToast();

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

  const onRefresh = async () => {
    setRefreshing(true);
    await getHomeProducts();
    setRefreshing(false);
    showToast("Updated Information.");
  };

  const onEnterSearchMode = () => {
    setIsSearch(true);
  };

  const onExitSearchMode = () => {
    Keyboard.dismiss();
    setIsSearch(false);
    _clearText();
    setFilteredProducts([]);
    setIsSearchSubmitted(false);
  };

  const onChangeSearchText = (text: string) => {
    setSearchInput(text);
  };
  const onClearSearchText = () => {
    _clearText();
  };

  const _clearText = () => {
    setSearchInput("");
  };

  const onSearchSubmit = async () => {
    setIsSearchSubmitted(true);
    if (searchInput.length > 0) {
      try {
        const filteredProducts = await getProducts(searchInput);
        setFilteredProducts(filteredProducts);
      } catch (error) {
        if (error instanceof Error) {
          showToast("Something wrong. Please try again later.");
        }
      }
    } else {
      _clearText();
    }
  };

  return {
    refreshing,
    searchInput,
    isSearch,
    isSearchSubmitted,
    onEnterSearchMode,
    onExitSearchMode,
    isLoading,
    error,
    products,
    filteredProducts,
    onRefresh,
    onChangeSearchText,
    onClearSearchText,
    onSearchSubmit,
  };
}

export default useProducts;
