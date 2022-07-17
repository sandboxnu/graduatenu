/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextPage } from "next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { CreateStudentDto } from "../temp/dto-types";
// import { API } from "@graduate/api-client";
import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";

const Signup: NextPage = () => {
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resolver = classValidatorResolver(CreateStudentDto);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateStudentDto>({ resolver });

  const onSubmitHandler = async (data: any) => {
    console.log(data);
    // try {
    //   const user = await API.auth.register({ email, password });
    //   if (user) {
    //     if (user.isOnboarded)
    //       // redirect to home
    //       console.log("redirect to home");
    //     // redirect to onboarding
    //     else console.log("redirect to onboarding");
    //   }
    // } catch (err) {
    //   setApiError("Invalid Credentials. Please try again");
    // }
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
        <Input id="email" placeholder="email" {...register("email")} />
        <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
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
        <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
      </FormControl>
      
      <FormControl isInvalid={errors.confirmPassword != null}>
        <InputGroup>
          <Input
            pr="4.5rem"
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            placeholder="Enter Password"
            {...register("confirmPassword")}
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
        <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
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

//TODO: fix logic and validation, then replicate for login
