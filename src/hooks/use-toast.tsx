import { ToastContext } from "@/providers/toast-provider";
import { useContext } from "react";

function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within provider");
  }

  return context;
}

export default useToast;
