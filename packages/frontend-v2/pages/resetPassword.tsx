import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import {
  forgotPasswordTokenExpiredError,
  isStrongPassword,
  ResetPasswordDto,
} from "@graduate/common";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ForgotPasswordForm,
  GraduateInput,
  GraduateLink,
  GraduatePreAuthHeader,
  LoadingPage,
} from "../components";
import axios from "axios";
import {
  handleApiClientError,
  noLeadOrTrailWhitespacePattern,
  toast,
  WEAK_PASSWORD_MSG,
} from "../utils";
import { handlWeakPasswordError } from "../utils/error";

const ResetPassword: NextPage = () => {
  return (
    <Flex direction="column" height="100vh">
      <GraduatePreAuthHeader />
      <Flex flexGrow={1} justifyContent="center" alignItems="center">
        <ResetPasswordContent />
      </Flex>
    </Flex>
  );
};

const ResetPasswordContent: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const token = router.query.token as string;
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordDto>({
    mode: "onTouched",
    shouldFocusError: true,
  });

  if (!token) {
    return <LoadingPage />;
  }

  const onSubmitHandler = async (payload: ResetPasswordDto) => {
    try {
      const payloadWithToken = { ...payload, token };
      await API.auth.resetPassword(payloadWithToken);
      setIsSubmitted(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message;
        if (errorMessage === forgotPasswordTokenExpiredError) {
          toast.error(
            "Aw it's been a while since we sent this email to change your password. Please request a new one."
          );
          return;
        }

        if (handlWeakPasswordError(errorMessage)) {
          return;
        }
      }
      handleApiClientError(err as Error, router);
    }
  };

  const password = watch("password", "");

  return (
    <>
      {!isSubmitted ? (
        <ForgotPasswordForm
          onSubmit={handleSubmit(onSubmitHandler)}
          headingText="Set New Password"
          subheaderText="Your new password must be different from previous passwords."
          mainContent={
            <>
              <GraduateInput
                id="password"
                placeholder="New password"
                error={errors.password}
                type="password"
                {...register("password", {
                  onBlur: () => trigger("passwordConfirm"),
                  validate: (pass) =>
                    isStrongPassword(pass) || WEAK_PASSWORD_MSG,
                  required: "New Password is required",
                  pattern: noLeadOrTrailWhitespacePattern,
                })}
              />
              <GraduateInput
                error={errors.passwordConfirm}
                type="password"
                id="confirmPassword"
                placeholder="Confirm Password"
                {...register("passwordConfirm", {
                  validate: (confirmPass) =>
                    confirmPass === password || "Passwords do not match!",
                  required: "Confirm password is required",
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
          footer={<GraduateLink href="/login" text="Back to Log In" />}
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
              Success!
            </Heading>
            <Text size="xs">Your password has been successfully reset.</Text>
          </Flex>
          <Button
            variant="solid"
            borderRadius="lg"
            isDisabled={Object.keys(errors).length > 0}
            onClick={() => router.push("/login")}
          >
            Continue to Log In
          </Button>
        </Flex>
      )}
    </>
  );
};

export default ResetPassword;
