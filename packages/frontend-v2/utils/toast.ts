import { toast as toastify } from "react-toastify";
import { logger } from "./logger";

type Options = {
  log?: boolean;
  toastId?: string | number;
};

const successToast = (message: string, options?: Options) => {
  options?.log && logger.debug(message);
  toastify.success(message, { toastId: options?.toastId });
};

const warningToast = (message: string, options?: Options) => {
  options?.log && logger.warn(message);
  toastify.warning(message, { toastId: options?.toastId });
};

const errorToast = (message: string, options?: Options) => {
  options?.log && logger.error(message);
  toastify.error(message, { toastId: options?.toastId });
};

const infoToast = (message: string, options?: Options) => {
  options?.log && logger.info(message);
  toastify.info(message, { toastId: options?.toastId });
};

export const toast = {
  success: successToast,
  info: infoToast,
  warn: warningToast,
  error: errorToast,
};
