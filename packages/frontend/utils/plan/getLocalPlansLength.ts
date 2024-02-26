/**
 * Get the length of the plans in the local storage.
 *
 * @returns The length of the plans in the local storage.
 */
export const getLocalPlansLength = (): number => {
  const localStorageData = window.localStorage.getItem("student");
  if (localStorageData) {
    const parsedData = JSON.parse(localStorageData);
    if (parsedData && Array.isArray(parsedData.plans)) {
      return parsedData.plans.length;
    }
  }
  return 0;
};
