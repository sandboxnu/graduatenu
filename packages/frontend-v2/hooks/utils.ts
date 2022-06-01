import { AxiosError } from "axios";

export const redirectUnAuth = (error: AxiosError) => {
  if (
    error.response &&
    (error.response.status === 401 || error.response.status === 403)
  ) {
    // redirect to login
  }
};
