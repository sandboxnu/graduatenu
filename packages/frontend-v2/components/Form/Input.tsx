import {
  FormControl,
  Input,
  FormErrorMessage,
  InputGroup,
  FormLabel,
  ComponentWithAs,
  FormControlProps,
  FormHelperText,
} from "@chakra-ui/react";
import { FieldError } from "react-hook-form";
import { forwardRef, HTMLInputTypeAttribute } from "react";

interface InputProps {
  error?: FieldError;
  id: string;
  placeholder: string;
  type: HTMLInputTypeAttribute;
  helpMessage?: string;
}

// eslint-disable-next-line react/display-name
export const GraduateInput = forwardRef<HTMLInputElement, InputProps>(
  ({ error, helpMessage, ...rest }, ref) => (
    <FormControl isInvalid={error != undefined}>
      <Input
        {...rest}
        ref={ref}
        size="lg"
        variant="outline"
        borderColor="neutral.main"
        borderWidth="2px"
        borderRadius="lg"
        errorBorderColor="red.300"
      />
      {helpMessage && <FormHelperText mt="3xs">{helpMessage}</FormHelperText>}
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
