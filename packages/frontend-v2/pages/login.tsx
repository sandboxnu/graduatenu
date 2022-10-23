import { Link, Text } from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import { LoginStudentDto } from "@graduate/common";
import { AxiosError } from "axios";
import { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import {
  HeaderContainer,
  Logo,
  LoadingPage,
  FormFormat,
  HeaderAndInput,
  StringInput,
  FormButtons,
  SubmitButton,
  AlterSubmitButton,
  InputGroup,
} from "../components";
import { useRedirectIfLoggedIn } from "../hooks";
import { redirectToOnboardingOrHome, toast } from "../utils";

interface LoginFormTopProps {
  register: UseFormRegister<LoginStudentDto>;
  errors: FieldErrors<LoginStudentDto>;
}

interface LoginFormButton {
  isSubmitting: boolean;
  router: NextRouter;
}

const Login: NextPage = () => {
  return (
    <>
      <Header />
      <LoginForm />
    </>
  );
};

const Header = (): JSX.Element => (
  <HeaderContainer>
    <Logo />
    <Link href="/signup">Sign Up</Link>
  </HeaderContainer>
);

const LoginForm = () => {
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
    <FormFormat onSubmit={handleSubmit(onSubmitHandler)}>
      <LoginFormTopInput errors={errors} register={register} />
      <LoginFormButton router={router} isSubmitting={isSubmitting} />
    </FormFormat>
  );
};

const LoginFormTopInput: React.FC<LoginFormTopProps> = ({
  errors,
  register,
}) => {
  return (
    <HeaderAndInput>
      <Text
        fontSize="3xl"
        color="primary.red.main"
        as="b"
        mb="xl"
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
    </HeaderAndInput>
  );
};

const LoginFormButton: React.FC<LoginFormButton> = ({
  isSubmitting,
  router,
}) => (
  <FormButtons>
    <SubmitButton
      isLoading={isSubmitting}
      type="submit"
      variant="solid"
      borderRadius="none"
    >
      LOGIN
    </SubmitButton>
    <p>OR</p>
    <AlterSubmitButton onClick={() => router.push("/signup")}>
      SIGN UP
    </AlterSubmitButton>
  </FormButtons>
);

export default Login;
