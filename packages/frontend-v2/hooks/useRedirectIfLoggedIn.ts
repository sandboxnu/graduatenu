import { API } from "@graduate/api-client";
import router from "next/router";
import { useContext, useEffect, useState } from "react";
import { logger } from "../utils";
import { AxiosError } from "axios";
import { IsGuestContext } from "../pages/_app";

/**
 * If the user is already logged in, then redirect to onboarding/home.
 *
 * @returns The loading state since this hook makes an API request to check if
 *   the user is logged in
 */
export const useRedirectIfLoggedIn = () => {
  const [renderSpinner, setRenderSpinner] = useState(false);
  const { setIsGuest } = useContext(IsGuestContext);

  const loginWithCookie = async () => {
    setRenderSpinner(true);
    try {
      await API.student.getMe();
      setIsGuest(false);
      router.push("/home");
    } catch (err) {
      const error = err as AxiosError;
      logger.error(error);
      setRenderSpinner(false);
    }
  };

  useEffect(() => {
    loginWithCookie();
  }, []);

  return renderSpinner;
};
