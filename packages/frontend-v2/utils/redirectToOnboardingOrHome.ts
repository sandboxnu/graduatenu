import { GetStudentResponse } from "@graduate/common";
import { NextRouter } from "next/router";

export const redirectToOnboardingOrHome = (
  user: GetStudentResponse,
  router: NextRouter
) => {
  // redirect to home
  router.push("/home");
};
