import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { logger } from "../../utils";
import { ClientSideError } from "./ClientSideError";

const clientSideErrorHandler = (
  error: Error,
  { componentStack }: { componentStack: string }
) => {
  logger.error(error.message, componentStack);
};

export const ErrorBoundary: React.FC = ({ children }) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ClientSideError}
      onError={clientSideErrorHandler}
    >
      {children}
    </ReactErrorBoundary>
  );
};
