import { GetStudentResponse } from "@graduate/common";
import { NextRouter } from "next/router";

export const routeOnboarding = (
  user: GetStudentResponse,
  router: NextRouter
) => {
  if (user) {
    if (user.isOnboarded) {
      // redirect to home
      console.log("redirect to home");
      router.push("/home");
    } else {
      // redirect to onboarding
      console.log("redirect to onboarding");
      router.push("/onboarding");
    }
  }
};
