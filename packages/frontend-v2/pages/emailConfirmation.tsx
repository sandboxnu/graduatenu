import { Text, Flex, Heading, Image, Link } from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import { NextPage } from "next";
import router from "next/router";
import { GraduatePreAuthHeader } from "../components";
import { useStudentWithPlans } from "../hooks";
import { toast } from "../utils";

const EmailConfirmation: NextPage = () => {
  const { student } = useStudentWithPlans();

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
          <Text textAlign="center">
            Click the link in your email we just sent you to activate your
            account.
          </Text>
        </Flex>
        <Link
          onClick={handleResendConfirmationEmail}
          color="primary.blue.light.main"
          fontWeight="bold"
        >
          Didn’t get the email? Click here to resend.
        </Link>
        <Text fontSize="xl" textAlign="center">
          Want to just use the app? Warning: If you do not confirm your email,
          you cannot recover your account if you forget your password.
        </Text>
        <Link onClick={() => router.push("/home")}>
          I understand, take me to the app!
        </Link>
      </Flex>
    </Flex>
  );
};

export default EmailConfirmation;
