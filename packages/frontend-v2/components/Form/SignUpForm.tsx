import { Button, Flex, Text } from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import { SignUpStudentDto } from "@graduate/common";
import { AxiosError } from "axios";
import { useRouter, NextRouter } from "next/router";
import { useState } from "react";
import { useForm, UseFormRegister, FieldErrors } from "react-hook-form";
import { logger, redirectToOnboardingOrHome } from "../../utils";
import { StringInput } from "./Input";
import { toast } from "../../utils/toast";

interface SignUpFormTopProps {
  register: UseFormRegister<SignUpStudentDto>;
  errors: FieldErrors<SignUpStudentDto>;
  password: string;
}

interface SignUpFormButton {
  isSubmitting: boolean;
  router: NextRouter;
}

export const SignUpForm = () => {
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
      if (error.response?.status === 401) toast.error("Invalid Credentials!");
      else toast.error("Something went wrong!");
    }
  };

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
        height="83vh"
        width="md"
        mt="5rem"
      >
        <SignUpFormTopInput
          errors={errors}
          password={password}
          register={register}
        />
        <SignUpFormButton isSubmitting={isSubmitting} router={router} />
      </Flex>
    </Flex>
  );
};

const SignUpFormTopInput: React.FC<SignUpFormTopProps> = ({
  errors,
  register,
  password,
}) => (
  <Flex
    direction="column"
    justifyContent="space-between"
    alignItems="center"
    height="40%"
    width="100%"
  >
    <Text
      fontSize="3xl"
      color="primary.red.main"
      as="b"
      mb="2rem"
      textAlign="center"
    >
      Welcome!
    </Text>

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
  </Flex>
);

const SignUpFormButton: React.FC<SignUpFormButton> = ({
  isSubmitting,
  router,
}) => (
  <Flex
    direction="row"
    justifyContent="space-between"
    alignItems="flex-end"
    height="25%"
    textAlign="center"
    width="100%"
    mb='1rem'
  >
    <Button
      isLoading={isSubmitting}
      type="submit"
      variant="solid"
      borderRadius="0px"
      flex="1"
      mr="1rem"
      size='sm'
      backgroundColor='primary.red.100'
    >
      PREV
    </Button>
    <Button
      isLoading={isSubmitting}
      type="submit"
      variant="solid"
      borderRadius="0px"
      flex="1"
      mr="1rem"
      size='sm'
      backgroundColor='orange'
    >
      SAVE
    </Button>
    <Button
      onClick={() => router.push("/signup")}
      variant="solid"
      backgroundColor="primary.red.main"
      borderRadius="0px"
      size='sm'
      flex="2"
    >
      NEXT
    </Button>
  </Flex>
);
