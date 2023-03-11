/** Does the given password satisfy our minimum criteria for strength? */
export const isStrongPassword = (password: string): boolean => {
  const containsLettersAndNumbersRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])/;
  return password.length >= 8 && containsLettersAndNumbersRegex.test(password);
};
