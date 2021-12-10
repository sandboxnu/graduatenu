import React from "react";
import { useLocation } from "react-router-dom";
import { get } from "lodash";
import { ErrorPage } from "./ErrorPage";

const ErrorHandler = ({ children }: any) => {
  const location = useLocation();
  const status: number = get(location.state, "errorStatusCode");
  if (status >= 400) {
    return <ErrorPage statusCode={status} />;
  } else {
    return children;
  }
};

export default ErrorHandler;
