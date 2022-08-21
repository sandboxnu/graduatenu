import { API } from "@graduate/api-client";
import { NextRouter } from "next/router";

export const logout = async (router: NextRouter) => {
  await API.auth.logout();
  router.push("/");
};
