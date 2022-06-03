import { toast as toastify } from "react-toastify";
import { logger } from "./logger";

type Options = {
  log: boolean;
};

const successToast = (message: string, options?: Options) => {
  options?.log && logger.debug(message);
  toastify.success(message);
};

const warningToast = (message: string, options?: Options) => {
  options?.log && logger.warn(message);
  toastify.warning(message);
};

const errorToast = (message: string, options?: Options) => {
  options?.log && logger.error(message);
  toastify.error(message);
};

const infoToast = (message: string, options?: Options) => {
  options?.log && logger.info(message);
  toastify.info(message);
};

export const toast = {
  success: successToast,
  info: infoToast,
  warn: warningToast,
  error: errorToast,
};
