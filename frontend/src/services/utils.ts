import { ServerErrorResponse, ServerResponse } from "../../../common/types";

export const apiRequest = async <ExpectedData>(
  path: string,
  method: RequestInit["method"],
  body?: any,
  token?: string, // only required if request needs to be authorized
  searchParams?: string | Record<string, string> | URLSearchParams
): Promise<ServerResponse<ExpectedData>> => {
  // add search params to path
  const searchParamsAsString = new URLSearchParams(searchParams).toString();
  const pathWithSearchParams = `${path}?${searchParamsAsString}`;

  // configure headers
  const headers: RequestInit["headers"] = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // make the request
  const response = await fetch(pathWithSearchParams, {
    method,
    body: body && JSON.stringify(body),
    headers,
  });

  const serverData: ServerResponse<ExpectedData> = await response.json();

  return serverData;
};

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
