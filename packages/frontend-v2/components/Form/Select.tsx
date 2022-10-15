import {
  FormControl,
  forwardRef,
  SelectProps,
  FormLabel,
  Select,
  ComponentWithAs,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Key } from "react";
import { FieldError } from "react-hook-form";

type PlanSelectProps = {
  error?: FieldError;
  label: string;
  array: Key[];
};
export const PlanSelect = forwardRef<
  PlanSelectProps,
  ComponentWithAs<"select", SelectProps>
>(({ error, label, array, ...rest }, ref) => (
  <FormControl isInvalid={error != null}>
    <FormLabel color="primary.red.main" size="md" fontWeight="medium" mb="2xs">
      {label}
    </FormLabel>
    <Select {...rest} ref={ref}>
      {array.map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </Select>
    <FormErrorMessage>{error?.message}</FormErrorMessage>
  </FormControl>
));
