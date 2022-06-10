import { Dispatch, useEffect, useState } from "react";

/**
 * Enum declared to be able to look up usages of storage keys and ensures
 * the keys are unique.
 */
export enum LocalStorageKey {
  // Delete later, this is for testing.
  Token = "Token",
}

/**
 * Using this hook allows for any component to access localstorage as NextJS uses SSR, so localstorage
 * may not be accessible upon initial page load.
 * Accessing the hook allows for the functionality of setting and getting a value in localstorage.
 * The storedValue returned is the value in localstorage for the key given to this hook. If it is undefined,
 * the hook will return null.
 * @param key Key for the localstorage value.
 */
export function useLocalStorage<T>(
  key: LocalStorageKey
): [T | null, Dispatch<T>] {
  const [storedValue, setStoredValue] = useState<T | null>(null);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) setStoredValue(JSON.parse(item));
    } catch (error) {
      console.error(error);
    }
  }, []);

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window?.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  // TODO: add removeValue function

  return [storedValue, setValue];
}
