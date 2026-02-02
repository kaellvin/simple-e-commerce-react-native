import { LoadingContext } from "@/src/providers/loading-provider";
import { useContext } from "react";

function useLoadingModal() {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error("useLoadingModal must be used within provider");
  }
  return context;
}

export default useLoadingModal;
