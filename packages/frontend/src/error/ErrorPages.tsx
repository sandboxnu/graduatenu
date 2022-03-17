import React from "react";
import { GenericErrorPage } from "./GenericErrorPage";

export const FrontendErrorPage = () => {
  return (
    <GenericErrorPage message={"There was an error rendering your page."} />
  );
};

export const BackendErrorPage = ({ statusCode }: { statusCode: number }) => {
  return (
    <GenericErrorPage
      message={`There was an error (code ${statusCode}). We are unable to retrieve
        the information you need.`}
    />
  );
};
