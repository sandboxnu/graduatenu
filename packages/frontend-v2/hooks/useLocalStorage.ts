import { useState, Dispatch, SetStateAction } from "react";

// NextJS executes server side code first, and then client side. Window object is only present client side,
// so window could be undefined. This ensures the window object exists before we use it.
const isWindow = typeof window !== "undefined";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = isWindow && window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((value: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      isWindow &&
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  // TODO: add removeValue function


  return [storedValue, setValue];
}