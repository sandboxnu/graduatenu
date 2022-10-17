import {
  FormControl,
  Input,
  FormErrorMessage,
  InputGroup,
  FormLabel,
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
    <FormControl isInvalid={error != undefined} height="2xl">
      <InputGroup>
        <Input
          {...rest}
          ref={ref}
          size="lg"
          variant="outline"
          errorBorderColor="red.300"
        />
      </InputGroup>
      <FormErrorMessage mt="3xs">{error?.message}</FormErrorMessage>
    </FormControl>
  )
);

type PlanInputOwnProps = {
  error?: FieldError;
  label: string;
};

type PlanInputProps = PlanInputOwnProps & InputProps;

export const PlanInput = forwardRef<HTMLInputElement, PlanInputProps>(
  ({ error, label, ...rest }, ref) => (
    <FormControl isInvalid={error != null}>
      <FormLabel
        color="primary.red.main"
        size="md"
        fontWeight="medium"
        mb="2xs"
      >
        {label}
      </FormLabel>
      <Input {...rest} ref={ref} />
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  )
);

PlanInput.displayName = "PlanInput";
