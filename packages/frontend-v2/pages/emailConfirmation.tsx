import { Text, Flex, Heading, Image } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  GraduateLink,
  GraduatePreAuthHeader,
  LoadingPage,
  ResendEmailVerificationLink,
} from "../components";
import { useStudentWithPlans } from "../hooks";
import { handleApiClientError } from "../utils";

const EmailConfirmation: NextPage = () => {
  const { student, error, isLoading } = useStudentWithPlans();
  const router = useRouter();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    handleApiClientError(error, router);
    return <></>;
  }

  // Email is already confirmed
  if (student?.isEmailConfirmed) {
    router.push("/home");
  }

  return (
    <Flex direction="column" height="100vh">
      <GraduatePreAuthHeader />
      <Flex
        flexGrow="1"
        justifyContent="center"
        alignItems="center"
        direction="column"
        rowGap="3xl"
      >
        <Flex alignItems="center" direction="column" rowGap="lg">
          <Image src="/email_confirmation.svg" width="240px" alt="mail" />
          <Heading as="h1" size="lg">
            Verify Your Email
          </Heading>
          <Flex direction="column" alignItems="center" rowGap="3xs">
            <Text textAlign="center">
              We send an email to <Text as="b">{student?.email}</Text>. Click
              the link in the email to activate your account.
            </Text>
            <Text textAlign="center">
              Want to just use the app? Warning: If you do not verifiy your
              email, you cannot recover your account if you forget your
              password.
            </Text>
            <GraduateLink
              href="/home"
              text="I understand, take me to the app."
            />
          </Flex>
        </Flex>
        <ResendEmailVerificationLink label="Didn’t get the email? Click here to resend." />
      </Flex>
    </Flex>
  );
};

export default EmailConfirmation;
