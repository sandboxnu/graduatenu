import { Flex, Button, Text, Heading, Link } from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import { ForgotPasswordDto } from "@graduate/common";
import { AxiosError } from "axios";
import { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";
import { SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import {
  GraduateInput,
  GraduateLink,
  GraduatePreAuthHeader,
} from "../components";
import { handleApiClientError, toast } from "../utils";

const ForgotPassword: NextPage = () => {
  return (
    <Flex direction="column" height="100vh">
      <GraduatePreAuthHeader />
      <Flex flexGrow={1} justifyContent="center" alignItems="center">
        <ForgotPasswordContent />
      </Flex>
    </Flex>
  );
};

interface ForgotPasswordFormProps {
  setSubmitted: (submitted: SetStateAction<boolean>) => void;
  router: NextRouter;
  setEmail: (email: SetStateAction<string>) => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  setSubmitted,
  router,
  setEmail,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordDto>({
    mode: "onTouched",
    shouldFocusError: true,
  });

  const onSubmitHandler = async (payload: ForgotPasswordDto) => {
    try {
      await API.auth.forgotPassword(payload);
      setEmail(payload.email);
      setSubmitted(true);
    } catch (err) {
      const error = err as AxiosError;
      handleApiClientError(error, router);
    }
  };

  return (
    <Flex
      shadow="2xl"
      px="4xl"
      py="2xl"
      borderRadius="2xl"
      width="xl"
      justifyContent="center"
      as="form"
      onSubmit={handleSubmit(onSubmitHandler)}
      alignItems="center"
      direction="column"
      rowGap="2xl"
    >
      <Flex direction="column" alignItems="center" rowGap="sm">
        <Heading as="h1" size="xl">
          Forgot Password?
        </Heading>
        <Text size="xs" textAlign='center'>
          No worries, we&apos;ll make email you instructions to reset your
          password.
        </Text>
      </Flex>

      <Flex direction="column" width="100%" rowGap="md">
        <GraduateInput
          id="email"
          placeholder="Email"
          error={errors.email}
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />
        <Button
          variant="solid"
          borderRadius="lg"
          isLoading={isSubmitting}
          isDisabled={Object.keys(errors).length > 0}
          type="submit"
        >
          Reset Password
        </Button>
      </Flex>

      <GraduateLink href="/login" text="Back to login" />
    </Flex>
  );
};

const ForgotPasswordContent: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();

  const resendEmail = async () => {
    try {
      if (email === "") {
        toast.error("Missing email!", { log: true });
        return;
      }
      await API.auth.forgotPassword({ email });
      toast.success("Email resent. Please check your email.");
    } catch (err) {
      const error = err as AxiosError;
      handleApiClientError(error, router);
    }
  };

  return (
    <>
      {!submitted ? (
        <ForgotPasswordForm
          setEmail={setEmail}
          setSubmitted={setSubmitted}
          router={router}
        />
      ) : (
        <Flex
          shadow="2xl"
          px="4xl"
          py="2xl"
          borderRadius="2xl"
          width="lg"
          justifyContent="center"
          alignItems="center"
          direction="column"
          rowGap="2xl"
        >
          <Flex direction="column" alignItems="center" rowGap="sm">
            <Heading as="h1" size="xl">
              Check Your Email
            </Heading>
            <Text size="xs">
              We sent a reset password link to
              <b>{email}</b>
            </Text>
          </Flex>

          <Link
            color="primary.blue.light.main"
            fontWeight="bold"
            onClick={resendEmail}
          >
            Didn&apos;t get the email? Click here to resend
          </Link>
          <GraduateLink href="/login" text="Back to Log In" />
        </Flex>
      )}
    </>
  );
};

export default ForgotPassword;
