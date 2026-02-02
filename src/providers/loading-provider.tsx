import LoadingOverlay from "@/src/components/loading-overlay";
import React, { createContext, useState } from "react";

function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  return (
    <LoadingContext value={{ setIsVisible }}>
      {children}
      <LoadingOverlay visible={isVisible} />
    </LoadingContext>
  );
}

interface ILoadingContext {
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoadingContext = createContext<ILoadingContext | undefined>(
  undefined,
);

export default LoadingProvider;
