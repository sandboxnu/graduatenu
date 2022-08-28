import { NextPage } from "next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { API } from "@graduate/api-client";
import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { AxiosError } from "axios";
import { logger, redirectToOnboardingOrHome } from "../utils";
import { SignUpStudentDto } from "@graduate/common";
import { HeaderContainer, Logo } from "../components";

const Signup: NextPage = () => {};

const SignupForm = () => {
  const [apiError, setApiError] = useState("");
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

  const password = watch("password", "");

  const onSubmitHandler = async (payload: SignUpStudentDto) => {
    try {
      const user = await API.auth.register(payload);
      redirectToOnboardingOrHome(user, router);
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 401)
        setApiError("Invalid credentials, please try again.");
      else setApiError(error.message);
      logger.error(error);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <h2>Sign Up</h2>
      <br />

      {apiError && (
        <Text
          pt="5%"
          fontSize={{ desktop: "3xl", laptop: "2xl", tablet: "xl" }}
          color="red.300"
        >
          {apiError}
        </Text>
      )}

      <FormControl isInvalid={errors.email != null}>
        <Input
          id="email"
          placeholder="Example@email.com"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />
        <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors.password != null}>
        <InputGroup>
          <Input
            type={"password"}
            id="password"
            placeholder="Enter Password"
            {...register("password", {
              required: "Password is required",
            })}
          />
        </InputGroup>
        <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors.passwordConfirm != null}>
        <InputGroup>
          <Input
            type={"password"}
            id="passwordConfirm"
            placeholder="Confirm Password"
            {...register("passwordConfirm", {
              validate: (confirmPass) =>
                confirmPass === password || "Passwords do not match!",
            })}
          />
        </InputGroup>
        <FormErrorMessage>{errors.passwordConfirm?.message}</FormErrorMessage>
      </FormControl>

      <Button
        mr={{ desktop: "7.5rem", laptop: "6.25rem", tablet: "3.25rem" }}
        mt="15%"
        isLoading={isSubmitting}
        type="submit"
      >
        Sign Up
      </Button>
    </form>
  );
};

const Header = (): JSX.Element => {
  return (
    <HeaderContainer>
      <Logo />
    </HeaderContainer>
  );
};

export default Signup;
