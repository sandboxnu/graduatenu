import {
  FormControl,
  Input,
  FormErrorMessage,
  InputGroup,
} from "@chakra-ui/react";
import { FieldError } from "react-hook-form";
import { forwardRef } from "react";

interface InputProps {
  error: FieldError | undefined;
  id: string;
  placeholder: string;
  type: string;
}

// eslint-disable-next-line react/display-name
export const StringInput = forwardRef<HTMLInputElement, InputProps>(
  ({ error, ...rest }, ref) => (
    <FormControl isInvalid={error != undefined} height='2xl'>
      <InputGroup>
        <Input
          {...rest}
          ref={ref}
          size="lg"
          variant="outline"
          errorBorderColor="red.300"
        />
      </InputGroup>
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  )
);
