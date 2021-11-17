export const deepCopy = <T>(original: T): T => {
  return JSON.parse(JSON.stringify(original));
};
