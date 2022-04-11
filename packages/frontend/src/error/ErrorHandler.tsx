import React from "react";
import { useLocation } from "react-router-dom";
import { BackendErrorPage } from "./ErrorPages";

const ErrorHandler: React.FC = ({ children }) => {
  const errorStatusCode = (useLocation().state as unknown as any)?.errorStatusCode;
  if (errorStatusCode >= 400) {
    return <BackendErrorPage statusCode={errorStatusCode} />;
  } else {
    return <>{children}</>;
  }
};

export default ErrorHandler;
