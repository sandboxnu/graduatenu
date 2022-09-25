import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoadingPage } from "../components";

/** We do not support onboarding for alpha release. The page redirects to home. */
const OnboardingPage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/home");
  }, [router]);

  return <LoadingPage />;
};

export default OnboardingPage;
