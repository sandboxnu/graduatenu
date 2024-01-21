/** Does the given password satisfy our minimum criteria for strength? */
export const isStrongPassword = (password: string): boolean => {
  const containsLettersAndNumbersRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])/;
  return password.length >= 8 && containsLettersAndNumbersRegex.test(password);
};

/**
 * Comparator function for sorting majors by name Criteria: ignores spacing and
 * special characters when sorting
 */
export const majorNameComparator = (a: string, b: string) => {
  const trimmedA = a
    .replace(/[^A-Z0-9]/gi, "")
    .trim()
    .toLowerCase();
  const trimmedB = b
    .replace(/[^A-Z0-9]/gi, "")
    .trim()
    .toLowerCase();
  return trimmedB.localeCompare(trimmedA);
};
