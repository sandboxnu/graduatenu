import { AxiosError } from "axios";
import { useRouter } from "next/router";

export const redirectUnAuth = (error: AxiosError) => {
  if (
    error.response &&
    (error.response.status === 401 || error.response.status === 403)
  ) {
    const router = useRouter();
    router.push("/login");
    // redirect to login
  }
};
