import { GetStudentResponse } from "@graduate/common";
import { NextRouter } from "next/router";

export const redirectToOnboardingOrHome = (
  user: GetStudentResponse,
  router: NextRouter
) => {
  // redirect to home
  if (user.isOnboarded) router.push("/home");
  // redirect to onboarding
  else router.push("/onboarding");
};
