import React from "react";
import { useToasts } from "react-toast-notifications";

export function withToast<T,>(Component: React.ComponentType<T>) {
  return (props: T) => {
    const { addToast, removeToast, toastStack } = useToasts();
    return (
      <Component
        {...props}
        addToast={addToast}
        removeToast={removeToast}
        toastStack={toastStack}
      />
    );
  };
}
