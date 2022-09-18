import {
  FormControl,
  Input,
  FormErrorMessage,
  InputGroup,
} from "@chakra-ui/react";
import { FieldError } from "react-hook-form";

interface InputProps {
  error: FieldError | undefined;
  id: string;
  placeholder: string;
  type: string;
}

export const StringInput: React.FC<InputProps> = ({ error, ...rest }, ref) => (
  <FormControl isInvalid={error != undefined}>
    <InputGroup>
      <Input {...rest} ref={ref} />
    </InputGroup>
    <FormErrorMessage>{error?.message}</FormErrorMessage>
  </FormControl>
);
