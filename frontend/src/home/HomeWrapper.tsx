import React from "react";
import { ToastProvider } from "react-toast-notifications";
import { Home } from "./Home";

export const HomeWrapper: React.FC = () => {
  return (
    <ToastProvider placement="bottom-right">
      <Home />
    </ToastProvider>
  );
};
