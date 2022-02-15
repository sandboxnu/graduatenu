import { ServerErrorResponse, ServerResponse } from "./types";

/**
 * A type guard - whether or not the given ServerResponse is a ServerError.
 */
export const isServerError = <T>(
  response: ServerResponse<T>
): response is ServerErrorResponse => {
  if ((response as ServerErrorResponse).error) {
    return true;
  }

  return false;
};
