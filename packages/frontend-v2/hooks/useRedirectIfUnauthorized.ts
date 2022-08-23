import { API } from "@graduate/api-client";
import axios, { AxiosError } from "axios";
import { NextRouter, useRouter } from "next/router";
import { useEffect, useState } from "react";

/**
 * Redirects to the loging page if the user in not authenticated.
 *
 * @returns The loading state since this hook makes an API request to check if
 *   the user is authenticated
 */
export const useRedirectIfUnauthorized = (error?: AxiosError | Error) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const redirectIfUnauthorized = async () => {
    setIsLoading(true);
    try {
      await API.student.getMe();
    } catch (error) {
      redirectOnUnauthorizedError(error, router);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    redirectIfUnauthorized();
  }, []);

  return isLoading;
};

/**
 * Check if the given error is an axios error with a unauthorized status code
 * and redirect to login if it is.
 */
const redirectOnUnauthorizedError = (error: unknown, router: NextRouter) => {
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status;
    if (statusCode === 401) {
      router.push("/login");
    }
  }
};
