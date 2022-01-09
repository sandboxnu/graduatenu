import React from "react";
import { useLocation } from "react-router-dom";
import { BackendErrorPage } from "./ErrorPages";

type LocationState = {
  errorStatusCode: number;
};

const ErrorHandler: React.FC = ({ children }: any): JSX.Element => {
  const errorStatusCode = useLocation<LocationState>().state?.errorStatusCode;
  if (errorStatusCode >= 400) {
    return <BackendErrorPage statusCode={errorStatusCode} />;
  } else {
    return children;
  }
};

export default ErrorHandler;
