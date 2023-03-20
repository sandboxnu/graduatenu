import { Text, Flex, Heading, Image, Link } from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  GraduateLink,
  GraduatePreAuthHeader,
  LoadingPage,
} from "../components";
import { useStudentWithPlans } from "../hooks";
import { handleApiClientError, toast } from "../utils";

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

  const handleResendConfirmationEmail = async () => {
    try {
      await API.email.resendConfirmationLink();
      toast.success("Successfully resent email!");
    } catch (err) {
      toast.error(
        "Something went wrong and we couldn't send you a new confirmation email. Try again in a some time.",
        { log: true }
      );
    }
  };

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
            Verfiy Your Email
          </Heading>
          <Flex direction="column" alignItems="center" rowGap="3xs">
            <Text textAlign="center">
              We send an email to <Text as="b">{student?.email}</Text>. Click
              the link in the email to activate your account.
            </Text>
            <Text textAlign="center">
              Want to just use the app? Warning: If you do not confirm your
              email, you cannot recover your account if you forget your
              password.
            </Text>
            <GraduateLink
              href="/home"
              text="I understand, take me to the app."
            />
          </Flex>
        </Flex>
        <Link
          onClick={handleResendConfirmationEmail}
          color="primary.blue.light.main"
          fontWeight="bold"
          fontSize="sm"
        >
          Didn’t get the email? Click here to resend.
        </Link>
      </Flex>
    </Flex>
  );
};

export default EmailConfirmation;
