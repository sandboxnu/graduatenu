import { API } from "@graduate/api-client";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { toast } from "../utils";
import { NextPage } from "next";
import { useStudentWithPlans } from "../hooks";
import { LoadingPage } from "../components";

/**
 * The page the user is sent to from their confirmation email. This page simply
 * validates the user's email and routes them to home if their token is valid.
 */
const ConfirmEmail: NextPage = () => {
  const router = useRouter();
  const token = router.query.token as string;

  const { student } = useStudentWithPlans();

  // Already confirmed
  if (student?.isEmailConfirmed) {
    router.push("/home");
  }

  useEffect(() => {
    if (token) {
      const sendJWTToken = async () => {
        try {
          await API.email.confirm({ token });
          router.push("/home");
          toast.success("Successfully confirmed email!");
        } catch (err) {
          toast.error(
            "Something went wrong, ensure you're using a valid confirmation email.",
            { log: true }
          );
        }
      };
      sendJWTToken();
    }
  }, [router, token]);

  return <LoadingPage />;
};

export default ConfirmEmail;
