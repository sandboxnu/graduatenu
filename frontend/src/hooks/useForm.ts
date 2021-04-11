import { useState, useCallback, useMemo, useEffect } from "react";

export interface FormErrors {
  readonly [field: string]: string | undefined;
}

type Validator<V> = (values: V) => FormErrors;

/**
 * Compose all the given validators into a single validation function.
 * current errors take precedence over newly-found ones in the final
 * set of errors.
 *
 * @param validators the validators to compose
 * @param errors the current set of errors
 */
const composeValidators = <V>(
  validators: Validator<V>[],
  errors: FormErrors
): Validator<V> => (values: V) =>
  validators.reduce(
    (acc: FormErrors, validator: Validator<V>) => ({
      ...validator(values),
      ...acc,
    }),
    errors
  );

/**
 * Custom hook for setting up a form with validation.
 *
 * @param initValues the initial values for each field
 * @param validators a single or array of validator functions for the form
 * @returns
 */
export const useForm = <V>(
  initValues: V,
  validators: Validator<V>[] | Validator<V>
) => {
  const [values, setValues] = useState<V>(initValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [errorsVisible, setErrorsVisible] = useState(false);

  const setPartialValues = useCallback(
    (partialValues: Partial<V>) => setValues({ ...values, ...partialValues }),
    [values]
  );

  const validator = useMemo(() => {
    if (Array.isArray(validators)) {
      return composeValidators(validators, errors);
    }

    return validators;
  }, [errors, validators]);

  useEffect(() => {
    if (errorsVisible) {
      setErrors(validator(values));
    }
  }, [values]);

  const checkHasError = useCallback(() => {
    const newErrors = validator(values);
    const hasError = Object.values(newErrors).some(Boolean);

    setErrors(newErrors);
    setErrorsVisible(true);

    return hasError;
  }, [validator, values]);

  const resetForm = useCallback(() => {
    setValues(initValues);
    setErrors({});
    setErrorsVisible(false);
  }, [initValues]);

  return {
    values,
    setValues: setPartialValues,
    errors,
    checkHasError,
    errorsVisible,
    resetForm,
  };
};
