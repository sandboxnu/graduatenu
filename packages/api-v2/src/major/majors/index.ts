import { Major2 } from "@graduate/common";
import { isSupportedMajor2022, SUPPORTED_MAJORS_2022 } from "./2022";

const SUPPORED_YEARS = [2022] as const;
type SUPPORTED_YEARS_TUPLE_TYPE = typeof SUPPORED_YEARS;
type SUPPORTED_YEARS_TYPE = SUPPORTED_YEARS_TUPLE_TYPE[number];

export const isSupportedYear = (year: number): year is SUPPORTED_YEARS_TYPE => {
  return SUPPORED_YEARS.includes(year as SUPPORTED_YEARS_TYPE);
};

export const SUPPORTED_MAJORS: Record<
  SUPPORTED_YEARS_TYPE,
  { majors: Record<string, Major2>; isSupportedMajorName: (string) => boolean }
> = {
  2022: {
    majors: SUPPORTED_MAJORS_2022,
    isSupportedMajorName: isSupportedMajor2022,
  },
};
