import { NextPage } from "next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { CreateStudentDto } from "../temp/dto-types";
import { API } from "@graduate/api-client";
import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

const Signup: NextPage = () => {
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateStudentDto>({
    resolver: classValidatorResolver(CreateStudentDto),
    mode: "onTouched",
    shouldFocusError: true,
  });

  const capitalizeFirstLetter = (s: string | undefined) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1) : undefined;

  // Auto login & onboarding stuff
  const onSubmitHandler = async (payload: CreateStudentDto) => {
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
      setApiError("Invalid Credentials. Please try again");
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
        <FormErrorMessage>
          {capitalizeFirstLetter(errors.email?.message)}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors.password != null}>
        <InputGroup>
          <Input
            pr="4.5rem"
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Enter Password"
            {...register("password")}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage>
          {capitalizeFirstLetter(errors.password?.message)}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors.passwordConfirm != null}>
        <InputGroup>
          <Input
            pr="4.5rem"
            type={showConfirmPassword ? "text" : "password"}
            id="passwordConfirm"
            placeholder="Confirm Password"
            {...register("passwordConfirm")}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage>
          {capitalizeFirstLetter(errors.passwordConfirm?.message)}
        </FormErrorMessage>
      </FormControl>

      <Button
        mr={{ desktop: "7.5rem", laptop: "6.25rem", tablet: "3.25rem" }}
        mt="15%"
        isLoading={isSubmitting}
        type="submit"
      >
        Submit
      </Button>
    </form>
  );
};

export default Signup;
