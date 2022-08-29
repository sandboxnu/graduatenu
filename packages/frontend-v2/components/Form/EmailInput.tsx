import {
  FormControl,
  Input,
  FormErrorMessage,
  InputGroup,
} from "@chakra-ui/react";
import { LoginStudentDto, SignUpStudentDto } from "@graduate/common";
import { FieldError, UseFormRegister } from "react-hook-form";

interface EmailInputProps {
  error: FieldError | undefined;
  register: UseFormRegister<SignUpStudentDto | LoginStudentDto>;
}

export const EmailInput: React.FC<EmailInputProps> = ({ error, register }) => {
  return (
    <FormControl isInvalid={error != undefined}>
      <InputGroup>
        <Input
          id="email"
          placeholder="Email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />
      </InputGroup>
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  );
};
