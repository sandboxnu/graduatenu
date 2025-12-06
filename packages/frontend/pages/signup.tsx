import { Flex, Text, Button } from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { API } from "@graduate/api-client";
import {
  emailAlreadyExistsError,
  isStrongPassword,
  SignUpStudentDto,
} from "@graduate/common";
import axios from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import {
  AuthenticationPageLayout,
  AuthForm,
  GraduateLink,
  GraduateInput,
} from "../components";
import {
  handleApiClientError,
  noLeadOrTrailWhitespacePattern,
  toast,
  WEAK_PASSWORD_MSG,
} from "../utils";
import { handleWeakPasswordError } from "../utils/error";
import { useContext } from "react";
import { IsGuestContext } from "./_app";

const Signup: NextPage = () => {
  return <AuthenticationPageLayout form={<SignUpForm />} />;
};

const SignUpForm: React.FC = () => {
  const router = useRouter();
  const { setIsGuest } = useContext(IsGuestContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    trigger,
  } = useForm<SignUpStudentDto>({
    mode: "onChange",
    shouldFocusError: true,
  });

  // Need to keep track of these values for validation
  const password = watch("password", "");

  const onSubmitHandler = async (payload: SignUpStudentDto) => {
    try {
      setIsGuest(false);
      await API.auth.register(payload);
      router.push("/emailConfirmation");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message;
        if (errorMessage === emailAlreadyExistsError) {
          toast.error(
            "Account with the given email already exists... try logging in instead 😄"
          );
          return;
        }

        if (handleWeakPasswordError(errorMessage)) {
          return;
        }
      }

      handleApiClientError(err as Error, router);
    }
  };

  return (
    <AuthForm
      onSubmit={handleSubmit(onSubmitHandler)}
      headingText="Create an Account"
      inputs={
        <>
          <Flex direction="column" rowGap="xs">
            <Flex alignItems="center" columnGap="sm" color="gray">
              <InfoOutlineIcon />
              <Text color="gray" lineHeight="1">
                Name is optional.
              </Text>
            </Flex>
            <Flex columnGap="md">
              <GraduateInput
                type="text"
                id="fullName"
                placeholder="Full Name"
                error={errors.fullName}
                {...register("fullName", {
                  pattern: noLeadOrTrailWhitespacePattern,
                })}
              />
            </Flex>
          </Flex>
          <GraduateInput
            id="email"
            placeholder="Email"
            error={errors.email}
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@husky\.neu\.edu$/i,
                message: "Please use a valid husky.neu.edu email address",
              },
            })}
          />
          <GraduateInput
            error={errors.password}
            type="password"
            id="password"
            placeholder="Password"
            {...register("password", {
              onBlur: () => trigger("passwordConfirm"),
              validate: (pass) => isStrongPassword(pass) || WEAK_PASSWORD_MSG,
              required: "Password is required",
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
        </>
      }
      footer={
        <Flex direction="column" width="100%" rowGap="md">
          <Button
            variant="solid"
            borderRadius="lg"
            isLoading={isSubmitting}
            isDisabled={Object.keys(errors).length > 0}
            type="submit"
          >
            Create Account
          </Button>
          <Text textAlign="center">
            Already have an account?{" "}
            <GraduateLink href="/login" text="Log In" />
          </Text>
        </Flex>
      }
    />
  );
};

export default Signup;
