import { weakPasswordError } from "@graduate/common";
import { toast } from "react-toastify";
import { WEAK_PASSWORD_MSG } from "../constants";

/**
 * Handle the weak password error message if thrown by our API, and return
 * whether it was handled.
 */
export const handleWeakPasswordError = (errorMessage: string): boolean => {
  if (errorMessage === weakPasswordError) {
    toast.error(`Password too weak. ${WEAK_PASSWORD_MSG}`);
    return true;
  }

  return false;
};
