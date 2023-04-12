import { ValidationRule } from "react-hook-form";

/**
 * A react-hook-form pattern that validates that the input has no leading or
 * trailing whitespaces.
 */
export const noLeadOrTrailWhitespacePattern: ValidationRule<RegExp> = {
  value: /^[^\s]+(\s+[^\s]+)*$/,
  message: "No trailing or leading whitespaces allowed.",
};
