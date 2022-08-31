import { API } from "@graduate/api-client";
import router from "next/router";
import { useEffect, useState } from "react";
import { redirectToOnboardingOrHome, logger } from "../utils";
import { AxiosError } from "axios";

export const useRedirectIfLoggedIn = () => {
  const [renderSpinner, setRenderSpinner] = useState(false);

  const loginWithCookie = async () => {
    setRenderSpinner(true);
    try {
      const student = await API.student.getMe();
      redirectToOnboardingOrHome(student, router);
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
