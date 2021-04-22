import { useState, useCallback, useEffect } from "react";

export interface FormErrors {
  readonly [field: string]: string | undefined;
}

type Validator<V> = (values: V) => FormErrors;

/**
 * Custom hook for setting up a form with validation.
 *
 * @param initValues the initial values for each field
 * @param validators the validator for the form
 */
export const useForm = <V>(initValues: V, validator: Validator<V>) => {
  const [values, setValues] = useState<V>(initValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [errorsVisible, setErrorsVisible] = useState(false);

  const setPartialValues = useCallback(
    (partialValues: Partial<V>) => setValues({ ...values, ...partialValues }),
    [values]
  );

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
