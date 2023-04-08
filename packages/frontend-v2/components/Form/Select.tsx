import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { Control, FieldError, useController } from "react-hook-form";
import Select from "react-select";

type PlanSelectProps = {
  error?: FieldError;
  label: string;
  helperText?: string;
  options: (string | number)[];
  /** Any side effects as a result of this field changing. */
  onChangeSideEffect?: (val: string | null) => void;
  /** The name of the react hook form field. */
  name: string;
  /** Returned by useForm. */
  control: Control<any>;
  /** Validation rules for the form. */
  rules?: any;
  /** Are the field values numbers. */
  isNumeric?: boolean;
  isSearchable?: boolean;
  /** An option in the select dropdown that indicates "no selection". */
  noValueOptionLabel?: string;
};

export const PlanSelect: React.FC<PlanSelectProps> = ({
  label,
  options,
  helperText,
  onChangeSideEffect,
  name,
  control,
  rules,
  isNumeric,
  isSearchable,
  noValueOptionLabel,
}) => {
  const {
    field: { onChange: onChangeUpdateValue, value, ...fieldRest },
    fieldState: { error },
  } = useController({ name, control, rules });

  const selectOptions: any[] = options.map((val) => ({
    value: val,
    label: val,
  }));

  let noValueOption;
  if (noValueOptionLabel) {
    noValueOption = { value: null, label: noValueOptionLabel };
    selectOptions.unshift(noValueOption);
  }

  const onChange = (option: any) => {
    let val = option ? option.value : null;
    onChangeSideEffect && onChangeSideEffect(val);

    if (isNumeric && val) {
      val = parseInt(val, 10);
    }

    onChangeUpdateValue(val);
  };

  let selectedValue = value;
  if (isNumeric) {
    selectedValue = value ? value.toString() : null;
  }
  const selectedOption =
    selectOptions.find((option: any) => option.value === selectedValue) ??
    noValueOption;

  return (
    <FormControl isInvalid={error != null}>
      <FormLabel
        color="primary.red.main"
        size="md"
        fontWeight="medium"
        mb="2xs"
      >
        {label}
      </FormLabel>
      <Select
        options={selectOptions}
        onChange={onChange}
        value={selectedOption}
        isSearchable={isSearchable}
        defaultValue={noValueOption}
        {...fieldRest}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  );
};
