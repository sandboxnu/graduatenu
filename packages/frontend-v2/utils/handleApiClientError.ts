import axios, { AxiosError } from "axios";
import { NextRouter } from "next/router";
import { logger } from "./logger";
import { toast } from "./toast";

/**
 * Handles the error returned by our API client.
 *
 * - Not authenticated: Redirects to /login
 * - Not authorized: Toast with custom message
 * - Any other server side error: Toast
 * - Client side error: Trigger error boundary by rethrowing
 *
 * @param error  The error returned by our api client
 * @param router Next router to redirect to /login if needed
 */
export const handleApiClientError = (
  error: AxiosError | Error,
  router: NextRouter
) => {
  if (axios.isAxiosError(error)) {
    handleAxiosError(error, router);
  } else {
    logger.debug("handleApiClientError", "Client side error", error);

    // since it is a client side error, simply throw the error so that the error boundary catches it
    throw error;
  }
};

const handleAxiosError = (error: AxiosError, router: NextRouter) => {
  const statusCode = error.response?.status;
  if (statusCode === 401) {
    logger.debug(
      "handleApiClientError",
      "Unauthenticated, redirecting to login",
      error
    );
    router.push("/login");
  } else if (statusCode === 403) {
    logger.debug("handleApiClientError", "Unauthorized", error);
    toast.error("Sorry, you don't have valid permissions.");
  } else {
    logger.debug(
      "handleApiClientError",
      "Recieved a non 200 status code",
      error
    );

    // TODO: Add some sort of google form/email for a user to report this error
    toast.error("Sorry, something went wrong on our end :(");
  }
};
