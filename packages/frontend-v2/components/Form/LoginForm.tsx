import { Button, Text, Flex } from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import { LoginStudentDto } from "@graduate/common";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useRedirectIfLoggedIn } from "../../hooks/useRedirectIfLoggedIn";
import { logger, redirectToOnboardingOrHome } from "../../utils";
import { StringInput } from "./Input";
import { toast } from "../../utils/toast";

export const LoginForm = () => {
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
      if (error.response?.status === 401) toast.error("Invalid Credentials!");
      else toast.error("Something went wrong!");
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
      <Flex
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        height="50vh"
        mt="5rem"
      >
        <Flex
          direction="column"
          justifyContent="space-between"
          alignItems="center"
          width="25%"
          height="40%"
        >
          <Text fontSize="3xl" color="primary.main" as='b'>
            Hey there!
          </Text>

          <Flex
            direction="column"
            justifyContent="space-evenly"
            alignItems="center"
            width="100%"
            height="70%"
          >
            <StringInput
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

            <StringInput
              error={errors.password}
              type="password"
              id="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
              })}
            />
          </Flex>
          <p>
            Forgot Password? Click <a href="test">here.</a>
          </p>
        </Flex>

        <Flex
          direction="column"
          justifyContent="space-evenly"
          alignItems="stretch"
          height="25%"
          textAlign="center"
        >
          <Button
            isLoading={isSubmitting}
            type="submit"
            variant="solid"
            borderRadius="0px"
          >
            LOGIN
          </Button>
          <p>OR</p>
          <Button
            onClick={() => router.push("/signup")}
            variant="solid"
            backgroundColor="blue.700"
            borderRadius="0px"
          >
            SIGN UP
          </Button>
        </Flex>
      </Flex>
    </form>
  );
};
