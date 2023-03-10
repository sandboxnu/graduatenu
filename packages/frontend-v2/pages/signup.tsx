import { Flex, Text, Heading, Button } from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import { SignUpStudentDto } from "@graduate/common";
import { AxiosError } from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import {
  AuthenticationPageLayout,
  AuthForm,
  GraduateLink,
  GraduateInput,
} from "../components";
import { handleApiClientError, toast } from "../utils";

const Signup: NextPage = () => {
  return <AuthenticationPageLayout form={<SignUpForm />} />;
};

const SignUpForm: React.FC = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<SignUpStudentDto>({
    mode: "onTouched",
    shouldFocusError: true,
  });

  // Need to keep track of this value to ensure that confirm password is equal
  const password = watch("password", "");

  const onSubmitHandler = async (payload: SignUpStudentDto) => {
    try {
      console.log("Name: ", payload);
      await API.auth.register(payload);
      router.push("/home");
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 400) {
        toast.error(
          "Account with the given email already exists... try signing up instead 😄"
        );
      } else {
        handleApiClientError(error, router);
      }
    }
  };

  return (
    <AuthForm
      onSubmit={handleSubmit(onSubmitHandler)}
      headingText="Create an Account"
      inputs={
        <>
          <Flex columnGap="md">
            <GraduateInput
              type="text"
              id="firstName"
              placeholder="First Name"
              {...register("firstName")}
              helpMessage="Optional"
            />
            <GraduateInput
              type="text"
              id="lastName"
              placeholder="Last Name"
              {...register("lastName")}
              helpMessage="Optional"
            />
          </Flex>
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
          <GraduateInput
            error={errors.password}
            type="password"
            id="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
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
            type="submit"
          >
            Create Account
          </Button>
          <Text textAlign="center">
            Already have an account? <GraduateLink href="/login" text="Login" />
          </Text>
        </Flex>
      }
    />
  );
};

export default Signup;
