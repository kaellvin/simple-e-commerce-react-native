import { useCallback, useEffect, useReducer } from "react";
import { Keyboard } from "react-native";
import { getProducts } from "../api/product/product.api";
import { Product } from "../types/product/product";
import useToast from "./use-toast";

export type LoadStatus =
  | "initial"
  | "loading"
  | "refreshing"
  | "success"
  | "failure";
export type SearchStatus = "initial" | "searching" | "success" | "failure";

type ProductsState = {
  status: LoadStatus;
  products: Product[];
  error: string;

  isSearchMode: boolean;
  searchInput: string;
  filteredProducts: Product[];
  searchStatus: SearchStatus;
};

type ProductsAction =
  | { type: "loadInProgress" }
  | { type: "refreshInProgress" }
  | { type: "loadSuccess"; payload: Product[] }
  | { type: "loadFailure"; payload: string }
  | { type: "enterSearchMode" }
  | { type: "enterSearchInput"; payload: string }
  | { type: "searchInProgress" }
  | { type: "searchSuccess"; payload: Product[] }
  | { type: "clearSearch" }
  | { type: "exitSearchMode" };

const initialState: ProductsState = {
  status: "initial",
  products: [],
  error: "",

  isSearchMode: false,
  searchInput: "",
  filteredProducts: [],
  searchStatus: "initial",
};
const productsReducer = (
  state: ProductsState,
  action: ProductsAction,
): ProductsState => {
  switch (action.type) {
    case "loadInProgress":
      return { ...state, status: "loading" };
    case "refreshInProgress":
      return { ...state, status: "refreshing" };
    case "loadSuccess":
      return { ...state, status: "success", products: action.payload };
    case "loadFailure":
      return { ...state, status: "failure", error: action.payload };
    case "enterSearchMode":
      return { ...state, isSearchMode: true };
    case "enterSearchInput":
      return { ...state, searchInput: action.payload };
    case "searchInProgress":
      return { ...state, searchStatus: "searching" };
    case "searchSuccess":
      return {
        ...state,
        searchStatus: "success",
        filteredProducts: action.payload,
      };
    case "clearSearch":
      return { ...state, searchInput: "", filteredProducts: [] };
    case "exitSearchMode":
      return {
        ...state,
        isSearchMode: false,
        searchInput: "",
        filteredProducts: [],
        searchStatus: "initial",
      };
  }
};

function useProducts() {
  const { showToast } = useToast();
  const [state, dispatch] = useReducer(productsReducer, initialState);

  const getHomeProducts = useCallback(
    async ({ isRefresh = false }: { isRefresh?: boolean }) => {
      try {
        if (isRefresh) {
          dispatch({ type: "refreshInProgress" });
        } else {
          dispatch({ type: "loadInProgress" });
        }
        const products = await getProducts();

        dispatch({ type: "loadSuccess", payload: products });
        if (isRefresh) {
          showToast("Updated information.");
        }
      } catch (error) {
        if (error instanceof Error) {
          dispatch({ type: "loadFailure", payload: error.message });
          showToast("Something wrong. Please try again later.");
        }
      }
    },
    [showToast],
  );

  useEffect(() => {
    getHomeProducts({});
  }, [getHomeProducts]);

  const onRefresh = async () => {
    await getHomeProducts({ isRefresh: true });
    showToast("Updated Information.");
  };

  const onEnterSearchMode = () => {
    dispatch({ type: "enterSearchMode" });
  };

  const onExitSearchMode = () => {
    Keyboard.dismiss();
    dispatch({ type: "exitSearchMode" });
  };

  const onChangeSearchText = (text: string) => {
    dispatch({ type: "enterSearchInput", payload: text });
  };
  const onClearSearchText = () => {
    dispatch({ type: "enterSearchInput", payload: "" });
  };

  const onSearchSubmit = async () => {
    const searchInput = state.searchInput;
    if (searchInput.length > 0) {
      try {
        dispatch({ type: "searchInProgress" });
        const filteredProducts = await getProducts(searchInput);
        dispatch({ type: "searchSuccess", payload: filteredProducts });
      } catch (error) {
        if (error instanceof Error) {
          dispatch({ type: "loadFailure", payload: error.message });
          showToast("Something wrong. Please try again later.");
        }
      }
    } else {
      dispatch({ type: "clearSearch" });
    }
  };

  return {
    state,
    onEnterSearchMode,
    onExitSearchMode,
    onRefresh,
    onChangeSearchText,
    onClearSearchText,
    onSearchSubmit,
  };
}

export default useProducts;
