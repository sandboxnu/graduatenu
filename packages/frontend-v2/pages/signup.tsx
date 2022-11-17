import { Text } from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import { SignUpStudentDto } from "@graduate/common";
import { AxiosError } from "axios";
import { NextPage } from "next";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import {
  AlterSubmitButton,
  FormButtons,
  FormFormat,
  HeaderAndInput,
  HeaderContainer,
  InputGroup,
  Logo,
  StringInput,
  SubmitButton,
} from "../components";
import { toast } from "../utils";

interface SignUpFormTopProps {
  register: UseFormRegister<SignUpStudentDto>;
  errors: FieldErrors<SignUpStudentDto>;
  password: string;
}

interface SignUpFormButton {
  isSubmitting: boolean;
  router: NextRouter;
}

const Signup: NextPage = () => {
  return (
    <>
      <Header />
      <SignUpForm />
    </>
  );
};

const Header = (): JSX.Element => {
  return (
    <HeaderContainer>
      <Logo />
      <Link href="/login">Log In</Link>
    </HeaderContainer>
  );
};

const SignUpForm = () => {
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
      await API.auth.register(payload);
      router.push("/home");
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 401) toast.error("Invalid Credentials!");
      else toast.error("Something went wrong!");
    }
  };

  return (
    <FormFormat onSubmit={handleSubmit(onSubmitHandler)}>
      <SignUpFormTopInput
        errors={errors}
        password={password}
        register={register}
      />
      <SignUpFormButton isSubmitting={isSubmitting} router={router} />
    </FormFormat>
  );
};

const SignUpFormTopInput: React.FC<SignUpFormTopProps> = ({
  errors,
  register,
  password,
}) => (
  <HeaderAndInput>
    <Text
      fontSize="3xl"
      color="primary.red.main"
      as="b"
      mb="xl"
      textAlign="center"
    >
      Welcome!
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

      <StringInput
        error={errors.passwordConfirm}
        type="password"
        id="confirmPassword"
        placeholder="Confirm Password"
        {...register("passwordConfirm", {
          validate: (confirmPass) =>
            confirmPass === password || "Passwords do not match!",
          required: true,
        })}
      />
    </InputGroup>
  </HeaderAndInput>
);

const SignUpFormButton: React.FC<SignUpFormButton> = ({
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
      SIGN UP
    </SubmitButton>
    <p>OR</p>
    <AlterSubmitButton onClick={() => router.push("/login")}>
      LOGIN
    </AlterSubmitButton>
  </FormButtons>
);

export default Signup;
