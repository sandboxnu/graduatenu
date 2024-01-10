/**
 * Creates the context string for application level logs in a service. The
 * context string is printed in square brackets before the log message.
 *
 * @param serviceName The name of the service logging
 * @param methodName  The name of the method logging
 */
export const formatServiceCtx = (
  serviceName: string,
  methodName: string
): string => {
  return `${serviceName} - ${methodName}`;
};
