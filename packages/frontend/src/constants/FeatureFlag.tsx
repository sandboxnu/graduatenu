const env = typeof process !== "undefined" && process.env;
export const FEEDBACK_BUTTON_FLAG =
  env && env.REACT_APP_FEEDBACK_BUTTON === "true";
