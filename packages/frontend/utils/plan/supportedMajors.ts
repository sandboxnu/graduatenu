import {
  GetSupportedMajorsResponse,
  majorNameComparator,
} from "@graduate/common";

export const extractSupportedMajorYears = (
  supportedMajorsData?: GetSupportedMajorsResponse
) => {
  return Object.keys(supportedMajorsData?.supportedMajors ?? {});
};
export const extractSupportedMajorNames = (
  catalogYear?: number,
  supportedMajorsData?: GetSupportedMajorsResponse
): string[] => {
  if (!catalogYear) {
    return [];
  }
  return Object.keys(
    supportedMajorsData?.supportedMajors[catalogYear] ?? {}
  ).sort(majorNameComparator);
};
