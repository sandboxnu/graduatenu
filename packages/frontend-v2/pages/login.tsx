import { Button, Flex, Text, useConst } from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import { LoginStudentDto } from "@graduate/common";
import { AxiosError } from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import {
  LoadingPage,
  GraduateInput,
  AuthenticationPageLayout,
  AuthForm,
  GraduateLink,
} from "../components";
import { useRedirectIfLoggedIn } from "../hooks";
import { handleApiClientError, toast } from "../utils";
import { useContext } from "react";
import { IsGuestContext } from "./_app";

const Login: NextPage = () => {
  return <AuthenticationPageLayout form={<LoginForm />} />;
};

const LoginForm: React.FC = () => {
  const router = useRouter();
  const renderSpinner = useRedirectIfLoggedIn();
  const { setIsGuest } = useContext(IsGuestContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginStudentDto>({
    mode: "onTouched",
    shouldFocusError: true,
  });

  const onSubmitHandler = async (payload: LoginStudentDto) => {
    try {
      setIsGuest(false);
      await API.auth.login(payload);
      router.push("/home");
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 401) {
        toast.error("Invalid Credentials!");
      } else {
        handleApiClientError(error, router);
      }
    }
  };

  if (renderSpinner) return <LoadingPage />;

  return (
    <AuthForm
      onSubmit={handleSubmit(onSubmitHandler)}
      headingText="Welcome Back!"
      inputs={
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

          <GraduateInput
            error={errors.password}
            type="password"
            id="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
            })}
          />
          <Flex alignSelf="end">
            <GraduateLink href="/forgotPassword" text="Forgot password?" />
          </Flex>
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
            Log In
          </Button>
          <Text textAlign="center">
            Need an account?{" "}
            <GraduateLink href="/signup" text="Create an Account" />
          </Text>
        </Flex>
      }
    />
  );
};

export default Login;
