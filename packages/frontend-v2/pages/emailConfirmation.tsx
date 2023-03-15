import { Flex, Link, Text } from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import { NextPage } from "next";
import router from "next/router";
import { LoadingPage } from "../components";
import { GraduateHeader } from "../components/Header/GraduateHeader";
import { useStudentWithPlans } from "../hooks";
import { toast } from "../utils";

const EmailConfirmation: NextPage = () => {
  const { student, isLoading } = useStudentWithPlans();

  // Email is already confirmed
  if (student?.isEmailConfirmed) {
    router.push("/home");
  }

  if (!student && !isLoading) {
    router.push("/login");
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  const handleResendConfirmationEmail = async () => {
    try {
      await API.email.resendConfirmationLink();
      toast.success("Successfully resent email!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <GraduateHeader
        rightContent={<Link onClick={() => router.push("/login")}>Log In</Link>}
      />
      <Flex direction="column">
        <Text fontSize="xl" textAlign="center">
          We sent you an email. Click the link in your email to activate your
          account.
        </Text>
        <Link onClick={handleResendConfirmationEmail}>
          Didn&apos;t get the email? Click here to resend.
        </Link>
        <Text fontSize="xl" textAlign="center">
          Want to just use the app? Warning: If you do not confirm your email,
          you cannot recover your account if you forget your password.
        </Text>
        <Link onClick={() => router.push("/home")}>
          I understand, take me to the app!
        </Link>
      </Flex>
    </div>
  );
};

export default EmailConfirmation;
