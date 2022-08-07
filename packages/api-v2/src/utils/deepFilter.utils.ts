/**
 * A basic deep filter that filters out all the provided keys from a given
 * object. If the input isn't a object, then the function doesn't do anything.
 *
 * @param   input The input element to filter out the keys from
 * @param   keys  The keys to filter out
 * @returns       The filtered out object if the input is an object, else the
 *   input unchanged
 */
export const deepFilter = (input: unknown, keys: string[]): unknown => {
  if (!isObject(input)) {
    return input;
  }

  const filteredObj = {};
  const entries = Object.entries(input);
  entries.forEach(([key, val]) => {
    if (!keys.includes(key)) {
      const filteredVal = deepFilter(val, keys);
      filteredObj[key] = filteredVal;
    }
  });

  return filteredObj;
};

const isObject = (obj): obj is object => {
  return Object.prototype.toString.call(obj) === "[object Object]";
};
