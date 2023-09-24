type LogType = "info" | "debug" | "warn" | "error";

/**
 * A logger utilty that encapsulates all logging logic. This will eventually have logic that
 * handles production logging using tools like sentry.
 */
const log = (type: LogType, ...messages: unknown[]) => {
  console[type](...messages);
};

export const logger = {
  info: (...messages: unknown[]) => log("info", ...messages),
  debug: (...messages: unknown[]) => log("debug", ...messages),
  warn: (...messages: unknown[]) => log("warn", ...messages),
  error: (...messages: unknown[]) => log("error", ...messages),
};
