import {
  Text,
  Flex,
  FormControl,
  Input,
  FormErrorMessage,
  InputGroup,
  Button,
} from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import { SignUpStudentDto } from "@graduate/common";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { redirectToOnboardingOrHome, logger } from "../../utils";
import { AxiosError } from "axios";

export const SignUpForm = () => {
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

  // Need to keep track of this value to ensure that confirm password is equal
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
      <Flex direction={"column"}>
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
      </Flex>
    </form>
  );
};
