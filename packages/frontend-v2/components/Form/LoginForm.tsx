import { Button, Flex, Link, Text } from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import { LoginStudentDto } from "@graduate/common";
import { AxiosError } from "axios";
import { NextRouter, useRouter } from "next/router";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { useRedirectIfLoggedIn } from "../../hooks/useRedirectIfLoggedIn";
import { redirectToOnboardingOrHome } from "../../utils";
import { toast } from "../../utils/toast";
import { LoadingPage } from "../Spinner";
import { StringInput } from "./Input";
import { InputGroup } from "./InputGroup";

interface LoginFormTopProps {
  register: UseFormRegister<LoginStudentDto>;
  errors: FieldErrors<LoginStudentDto>;
}

interface LoginFormButton {
  isSubmitting: boolean;
  router: NextRouter;
}

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

  if (renderSpinner) return <LoadingPage />;

  return (
    <Flex
      as="form"
      onSubmit={handleSubmit(onSubmitHandler)}
      justifyContent="center"
      alignItems="center"
    >
      <Flex
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        height="50vh"
        width="md"
        mt="5rem"
      >
        <LoginFormTopInput errors={errors} register={register} />
        <LoginFormButton router={router} isSubmitting={isSubmitting} />
      </Flex>
    </Flex>
  );
};

const LoginFormTopInput: React.FC<LoginFormTopProps> = ({
  errors,
  register,
}) => {
  return (
    <Flex
      direction="column"
      justifyContent="space-between"
      alignItems="center"
      height="50%"
      width="100%"
    >
      <Text
        fontSize="3xl"
        color="primary.red.main"
        as="b"
        mb="2rem"
        textAlign="center"
      >
        Hey there!
      </Text>

      <InputGroup>
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
      </InputGroup>

      <Text fontSize="md" textAlign="center">
        Forgot Password? Click{" "}
        <Link href="/forgotPass" color="primary.red.main">
          here
        </Link>
        .
      </Text>
    </Flex>
  );
};

const LoginFormButton: React.FC<LoginFormButton> = ({
  isSubmitting,
  router,
}) => (
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
);
