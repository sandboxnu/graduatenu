import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  Text,
} from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { logger, redirectToOnboardingOrHome } from "../utils";
import { LoginStudentDto } from "@graduate/common";
import { useRedirectIfLoggedIn } from "../hooks";

const Login: NextPage = () => {
  const [apiError, setApiError] = useState("");
  const router = useRouter();
  const renderSpinner = useRedirectIfLoggedIn();

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
      const user = await API.auth.login(payload);
      redirectToOnboardingOrHome(user, router);
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 401)
        setApiError("Invalid credentials, please try again.");
      else setApiError(error.message);
      logger.error(error);
    }
  };

  if (renderSpinner)
    return (
      <Text pt="5%" fontSize="3xl" color="red.300">
        Loading
      </Text>
    );

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <h2>Log In</h2>
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
          placeholder="example@email.com"
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
            type="password"
            id="password"
            placeholder="Enter Password"
            {...register("password", {
              required: "Password is required",
            })}
          />
        </InputGroup>
        <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
      </FormControl>

      <Button
        mr={{ desktop: "7.5rem", laptop: "6.25rem", tablet: "3.25rem" }}
        mt="15%"
        isLoading={isSubmitting}
        type="submit"
      >
        Log In
      </Button>
    </form>
  );
};

export default Login;
