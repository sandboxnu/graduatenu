import {
  GetMajorsResponse,
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

export const extractMajorYears = (majorsData?: GetMajorsResponse) => {
  return Object.keys(majorsData?.majors ?? {});
};
export const extractMajorNames = (
  catalogYear?: number,
  majorsData?: GetMajorsResponse
): string[] => {
  if (!catalogYear) {
    return [];
  }
  // extract the name to information mapping for the given year
  let majorMap = majorsData?.majors[catalogYear];
  return Object.keys(majorMap ?? {})
    .map(
      (majorName) =>
        majorName + (majorMap?.[majorName].metadata.verified ? "" : " [BETA]")
    )
    .sort(majorNameComparator);
};
