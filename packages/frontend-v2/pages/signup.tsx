import { NextPage } from "next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { SignUpStudentDto } from "../temp/dto-types";
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
import { logger } from "../utils";

const Signup: NextPage = () => {
  const [apiError, setApiError] = useState("");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpStudentDto>({
    resolver: classValidatorResolver(SignUpStudentDto),
    mode: "onTouched",
    shouldFocusError: true,
  });

  const onSubmitHandler = async (payload: SignUpStudentDto) => {
    try {
      const user = await API.auth.register(payload);
      if (user) {
        if (user.isOnboarded) {
          // redirect to home
          console.log("redirect to home");
          router.push("/home");
        } else {
          // redirect to onboarding
          console.log("redirect to onboarding");
          router.push("/onboarding");
        }
      }
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
          placeholder="example@email.com"
          {...register("email")}
        />
        <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors.password != null}>
        <InputGroup>
          <Input
            type={"password"}
            id="password"
            placeholder="Enter Password"
            {...register("password")}
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
            {...register("passwordConfirm")}
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

export default Signup;
