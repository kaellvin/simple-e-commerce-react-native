import { MaximumQuantityExceededModalContext } from "@/providers/maximum-quantity-exceeded-modal-provider";
import { useContext } from "react";

function useMaximumQuantityExceededModal() {
  const context = useContext(MaximumQuantityExceededModalContext);

  if (!context) {
    throw new Error(
      "useMaximumQuantityExceededModal must be used within provider",
    );
  }
  return context;
}

export default useMaximumQuantityExceededModal;
