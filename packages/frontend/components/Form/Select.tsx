import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { OptionObject } from "@graduate/common";
import { useMemo } from "react";
import { Control, FieldError, useController } from "react-hook-form";
import Select, { components } from "react-select";
import { FilterOptionOption } from "react-select/dist/declarations/src/filters";

type PlanSelectProps = {
  error?: FieldError;
  label: string;
  helperText?: string;
  /** List of (label, value) if for label and value */
  options: OptionObject[];
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
  isDisabled?: boolean;
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
  isDisabled,
  placeholder,
  // useFuzzySearch,
}) => {
  const customFilterOption = (
    option: FilterOptionOption<any>,
    rawInput: string
  ) => {
    const words = rawInput.split(" ");
    return words.reduce(
      (acc, cur) =>
        acc && option.label.toLowerCase().includes(cur.toLowerCase()),
      true
    );
  };

  const highlightMatch = (label: string, rawInput: string) => {
    if (!rawInput) return label;

    const escapedQuery = rawInput.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedQuery})`, "gi");
    const parts = label.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <strong key={index}>{part}</strong>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  const CustomOption = (props: any) => {
    return (
      <components.Option {...props}>
        {highlightMatch(props.data.label, props.selectProps.inputValue)}
      </components.Option>
    );
  };

  // sorts the majors so that 'pure' majors are at top of search
  // prior to 'and' being in the input
  // const customFilterOptions = (
  //   options: FilterOptionOption<any>[],
  //   rawInput: string
  // ) => {
  //   const filtered = options.filter((option: FilterOptionOption<any>) =>
  //     customFilterOption(option, rawInput)
  //   );

  //   const words = rawInput.split(',');
  //   const containsAnd = words.includes('and');

  //   return filtered.sort((a, b) => {
  //     const aContainsAnd = a.label.toLowerCase().includes("and");
  //     const bContainsAnd = b.label.toLowerCase().includes("and");

  //     if (!containsAnd) {
  //       if (aContainsAnd && !bContainsAnd) return 1;  // push 'and' ones down
  //       if (!aContainsAnd && bContainsAnd) return -1; // bring non-'and' ones up
  //     }

  //     return a.label.localeCompare(b.label);
  //   });
  // };

  // TODO: Find a more efficient way to implement fuzzy search
  // const filterOptions = useFuzzySearch
  //   ? (option: FilterOptionOption<any>, inputValue: string) => {
  //       if (inputValue.length !== 0) {
  //         const list = new Fuse(options, {
  //           keys: ["value"],
  //           isCaseSensitive: false,
  //           shouldSort: true,
  //           ignoreLocation: true,
  //           findAllMatches: true,
  //           includeScore: true,
  //           threshold: 0.4,
  //         }).search(inputValue);
  //         return list
  //           .map((element) => element.item.value)
  //           .includes(option.data.value);
  //       } else {
  //         return true;
  //       }
  //     }
  //   : null;

  const {
    field: { onChange: onChangeUpdateValue, value, ...fieldRest },
    fieldState: { error },
  } = useController({ name, control, rules });

  const onChange = (option: any) => {
    let val = option ? option.value : "";

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
  const selectedOption = options.find(
    (option: any) => option.value === selectedValue
  );

  const sortedOptions = useMemo(() => {
    return [...options].sort((a, b) => {
      if (String(a.label).length >= String(b.label).length) return 1;
      return -1;
    });
  }, [options, fieldRest?.name]);

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
        options={sortedOptions}
        onChange={onChange}
        value={selectedOption}
        isSearchable={isSearchable}
        isDisabled={isDisabled}
        placeholder={placeholder}
        filterOption={customFilterOption}
        components={{ Option: CustomOption }}
        {...fieldRest}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  );
};
