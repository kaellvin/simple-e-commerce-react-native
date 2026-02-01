import AppModal from "@/src/components/app-modal";
import { MaxQuantityExceededAlertState } from "@/src/types/cart/cart";
import React, { createContext, useState } from "react";

function MaximumQuantityExceededProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [maxQuantityExceededAlertState, setMaxQuantityExceededAlertState] =
    useState<MaxQuantityExceededAlertState>({ isOpen: false, stock: 0 });

  const onDisableMaxQuantityExceededAlert = () => {
    setMaxQuantityExceededAlertState({
      isOpen: false,
      stock: 0,
    });
  };

  return (
    <MaximumQuantityExceededModalContext
      value={{ setMaxQuantityExceededAlertState }}
    >
      {children}
      <AppModal
        visible={maxQuantityExceededAlertState.isOpen}
        title="Maximum quantity exceeded"
        message={`Sorry. Your cart has exceeded maximum quantity of this product.\nMaximum: ${maxQuantityExceededAlertState.stock}`}
        onClose={onDisableMaxQuantityExceededAlert}
        onConfirm={onDisableMaxQuantityExceededAlert}
        buttonLabel="Close"
      />
    </MaximumQuantityExceededModalContext>
  );
}

interface IMaximumQuantityExceededModalContext {
  setMaxQuantityExceededAlertState: React.Dispatch<
    React.SetStateAction<MaxQuantityExceededAlertState>
  >;
}

export const MaximumQuantityExceededModalContext = createContext<
  IMaximumQuantityExceededModalContext | undefined
>(undefined);

export default MaximumQuantityExceededProvider;
