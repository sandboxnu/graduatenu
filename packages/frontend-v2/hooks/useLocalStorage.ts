import { useState, Dispatch, useEffect } from "react";


/**
 * Using this hook allows for any component to access localstorage.
 * Accessing the hook allows for the functionality of setting and getting a value in localstorage.
 * @param key Key for the localstorage value.
 * @param defaultValue Default value returned if the hook cannot access the value in localstorage.
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, Dispatch<T>] {
  const [storedValue, setStoredValue] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : defaultValue);
    } catch (error) {
      console.error(error);
    }
  }, [])

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window?.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  // TODO: add removeValue function


  return [storedValue, setValue];
}