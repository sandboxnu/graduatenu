import {AxiosError} from "axios";
import {useRouter} from "next/router";

export const useRedirectUnAuth = () => {
  const router = useRouter();
  return (error: AxiosError) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // redirect to login
      router.push("/login");
    }
  }
};
