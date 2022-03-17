import React from "react";
import { useToasts } from "react-toast-notifications";

export function withToast(Component: any) {
  return function WrappedComponent(props: any) {
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
