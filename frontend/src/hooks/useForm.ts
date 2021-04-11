import { useState, useCallback, useMemo, useEffect } from "react";

interface FormErrors {
  readonly [field: string]: string;
}

type Validator<V, E> = (values: V) => E;

/**
 * Compose all the given validators into a single validation function.
 * current errors take precedence over newly-found ones in the final
 * set of errors.
 *
 * @param validators the validators to compose
 * @param errors the current set of errors
 */
const composeValidators = <V, E>(
  validators: Validator<V, E>[],
  errors: E
): Validator<V, E> => (values: V) =>
  validators.reduce(
    (acc: E, validator: Validator<V, E>) => ({ ...validator(values), ...acc }),
    errors
  );

/**
 * Custom hook for setting up a form with validation.
 *
 * @param initValues the initial values for each field
 * @param initErrors the initial errors for each field
 * @param validators a single or array of validator functions for the form
 * @returns
 */
export const useForm = <V, E extends FormErrors>(
  initValues: V,
  initErrors: E,
  validators: Validator<V, E>[] | Validator<V, E>
) => {
  const [values, setValues] = useState<V>(initValues);
  const [errors, setErrors] = useState<E>(initErrors);
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
    const hasError = Object.values(newErrors).some(error => error !== "");

    setErrors(newErrors);
    setErrorsVisible(true);

    return hasError;
  }, [validator, values]);

  const resetForm = useCallback(() => {
    setValues(initValues);
    setErrors(initErrors);
    setErrorsVisible(false);
  }, [initErrors, initValues]);

  return {
    values,
    setValues: setPartialValues,
    errors,
    checkHasError,
    errorsVisible,
    resetForm,
  };
};
