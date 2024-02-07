import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import Fuse from "fuse.js";
import { Control, FieldError, useController } from "react-hook-form";
import Select from "react-select";
import { FilterOptionOption } from "react-select/dist/declarations/src/filters";

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
  /** The default text shown in the input box. */
  placeholder?: string;
  /** Fuzzy options to use */
  useFuzzySearch?: boolean;
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
  placeholder,
  useFuzzySearch,
}) => {
  const filterOptions = useFuzzySearch
    ? (option: FilterOptionOption<any>, inputValue: string) => {
        if (inputValue.length !== 0) {
          const list = new Fuse(options, {
            isCaseSensitive: false,
            shouldSort: true,
            ignoreLocation: true,
            findAllMatches: true,
            includeScore: true,
            threshold: 0.4,
          }).search(inputValue);

          return list.map((element) => element.item).includes(option.label);
        } else {
          return true;
        }
      }
    : null;

  const {
    field: { onChange: onChangeUpdateValue, value, ...fieldRest },
    fieldState: { error },
  } = useController({ name, control, rules });

  const selectOptions: any[] = options.map((val) => ({
    value: val,
    label: val,
  }));

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
  const selectedOption = selectOptions.find(
    (option: any) => option.value === selectedValue
  );

  const styles = {
    control: (baseStyles: any) => ({
      ...baseStyles,
      borderColor: "#e7ebf1",
    }),
    dropdownIndicator: (baseStyles: any, state: { isFocused: any }) => ({
      ...baseStyles,
      color: state.isFocused ? "#7586a0" : "#b4bbc8",
    }),
  };

  return (
    <FormControl isInvalid={error != null}>
      <FormLabel
        color="primary.blue.dark.main"
        size="md"
        fontWeight="medium"
        mb="4xs"
      >
        {label}
      </FormLabel>
      <Select
        styles={styles}
        options={selectOptions}
        onChange={onChange}
        value={selectedOption}
        isSearchable={isSearchable}
        placeholder={placeholder}
        filterOption={filterOptions}
        {...fieldRest}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  );
};
