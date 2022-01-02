import React from "react";
import { useLocation } from "react-router-dom";
import { get } from "lodash";
import { BackendErrorPage } from "./ErrorPages";

const ErrorHandler = ({ children }: any) => {
  const location = useLocation();
  const status: number = get(location.state, "errorStatusCode");
  if (status >= 400) {
    return <BackendErrorPage statusCode={status} />;
  } else {
    return children;
  }
};

export default ErrorHandler;
