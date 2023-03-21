import { Flex, Text, Button } from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { API } from "@graduate/api-client";
import {
  emailAlreadyExistsError,
  isStrongPassword,
  SignUpStudentDto,
  weakPasswordError,
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
    trigger,
  } = useForm<SignUpStudentDto>({
    mode: "onTouched",
    shouldFocusError: true,
  });

  // Need to keep track of these values for validation
  const password = watch("password", "");
  const firstName = watch("firstName", "");

  const onSubmitHandler = async (payload: SignUpStudentDto) => {
    try {
      await API.auth.register(payload);
      router.push("/emailConfirmation");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message;
        if (errorMessage === emailAlreadyExistsError) {
          toast.error(
            "Account with the given email already exists... try signing up instead 😄"
          );
        } else if (errorMessage === weakPasswordError) {
          toast.error(
            "Password too weak. Ensure the password is at least 8 characters long and contains digits and letters."
          );
        } else {
          handleApiClientError(err, router);
        }
      } else {
        handleApiClientError(err as Error, router);
      }
    }
  };

  return (
    <AuthForm
      onSubmit={handleSubmit(onSubmitHandler)}
      headingText="Create an Account"
      inputs={
        <>
          <Flex direction="column" rowGap="xs">
            <Flex columnGap="md">
              <GraduateInput
                type="text"
                id="firstName"
                placeholder="First Name"
                {...register("firstName", {
                  onBlur: () => trigger("lastName"),
                })}
              />
              <GraduateInput
                type="text"
                id="lastName"
                placeholder="Last Name"
                error={errors.lastName}
                {...register("lastName", {
                  validate: (lastName) => {
                    if (lastName != "" && firstName == "") {
                      return "Please enter your first name along with your last name.";
                    }
                    return true;
                  },
                })}
              />
            </Flex>
            <Flex alignItems="center" columnGap="sm" color="gray">
              <InfoOutlineIcon />
              <Text color="gray" lineHeight="1">
                Name is optional. If provided, enter at least your first name.
              </Text>
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
              onBlur: () => trigger("passwordConfirm"),
              validate: (pass) =>
                isStrongPassword(pass) ||
                "A password should be at least 8 characters with digits and letters.",
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
            isDisabled={Object.keys(errors).length > 0}
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
