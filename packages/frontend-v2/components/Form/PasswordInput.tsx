import {
  FormControl,
  Input,
  FormErrorMessage,
  InputGroup,
} from "@chakra-ui/react";
import { LoginStudentDto, SignUpStudentDto } from "@graduate/common";
import { FieldError, UseFormRegister } from "react-hook-form";

interface PasswordInputProps {
  error: FieldError | undefined;
  register: UseFormRegister<SignUpStudentDto | LoginStudentDto>;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  error,
  register,
}) => {
  return (
    <FormControl isInvalid={error != undefined}>
      <InputGroup>
        <Input
          id="password"
          placeholder="Password"
          type="password"
          {...register("password", {
            required: "Password is required",
          })}
        />
      </InputGroup>
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  );
};
