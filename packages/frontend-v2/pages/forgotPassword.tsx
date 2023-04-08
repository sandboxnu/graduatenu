import { Flex, Button, Text, Heading, Link } from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import {
  ForgotPasswordDto,
  emailDoesNotExistError,
  emailHasNotBeenConfirmed,
} from "@graduate/common";
import { AxiosError } from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ForgotPasswordForm,
  GraduateInput,
  GraduateLink,
  GraduatePreAuthHeader,
} from "../components";
import { handleApiClientError, toast } from "../utils";
import axios from "axios";

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

const ForgotPasswordContent: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
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
      setIsSubmitted(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message;
        if (errorMessage === emailDoesNotExistError) {
          toast.error(
            "The email you entered does not exist. Please check your email and try again."
          );
          return;
        }

        if (errorMessage === emailHasNotBeenConfirmed) {
          toast.error(
            "The given email has not been confirmed yet so we can't reset your password 😔."
          );
          return;
        }
      }

      handleApiClientError(err as Error, router);
    }
  };

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
      {!isSubmitted ? (
        <ForgotPasswordForm
          onSubmit={handleSubmit(onSubmitHandler)}
          headingText="Forgot Password?"
          subheaderText="No worries, we'll make email you instructions to reset your
          password."
          mainContent={
            <>
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
            </>
          }
          footer={<GraduateLink href="/login" text="Back to login" />}
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
          <Flex
            direction="column"
            alignItems="center"
            rowGap="sm"
            textAlign="center"
          >
            <Heading as="h1" size="xl">
              Check Your Email
            </Heading>
            <Text size="xs">
              We sent a reset password link to <br />
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
