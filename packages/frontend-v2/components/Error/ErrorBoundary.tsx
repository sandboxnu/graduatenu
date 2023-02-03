// import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import React, { PropsWithChildren } from "react";
// import { logger } from "../../utils";
// import { ClientSideError } from "./ClientSideError";

// const clientSideErrorHandler = (
//   error: Error,
//   { componentStack }: { componentStack: string }
// ) => {
//   logger.error(error.message, componentStack);
// };

export const ErrorBoundary: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    // <ReactErrorBoundary
    //   FallbackComponent={ClientSideError}
    //   onError={clientSideErrorHandler}
    // >
    <div>{children}</div>
    // </ReactErrorBoundary>
  );
};
