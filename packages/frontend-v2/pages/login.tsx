import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  Text,
} from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { LoginStudentDto } from "../temp/dto-types";
import { AxiosError } from "axios";

const Login: NextPage = () => {
  const [apiError, setApiError] = useState("");
  const [renderSpinner, setRenderSpinner] = useState(true);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginStudentDto>({
    resolver: classValidatorResolver(LoginStudentDto),
    mode: "onTouched",
    shouldFocusError: true,
  });

  const loginWithCookie = async () => {
    setRenderSpinner(true);
    try {
      const student = await API.student.getMe();
      if (student) {
        if (student.isOnboarded) {
          // Redirect to home
          router.push("/home");
        } else {
          // Redirect to onboarding
          router.push("/onboarding");
        }
      }
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);
      setRenderSpinner(false);
    }
  };

  useEffect(() => {
    loginWithCookie();
  }, []);

  const onSubmitHandler = async (payload: LoginStudentDto) => {
    try {
      const user = await API.auth.login(payload);
      if (user) {
        if (user.isOnboarded) {
          // redirect home
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
      console.log(error);
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
