import { GetStudentResponse } from "@graduate/common";
import { NextRouter } from "next/router";

export const redirectToOnboardingOrHome = (
  user: GetStudentResponse,
  router: NextRouter
) => {
  if (user) {
    if (user.isOnboarded) {
      // redirect to home
      router.push("/home");
    } else {
      // redirect to onboarding
      router.push("/onboarding");
    }
  }
};
