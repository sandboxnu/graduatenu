import { Major2 } from "@graduate/common";
import { SUPPORED_MAJORS_NAMES_2022, SUPPORTED_MAJORS_2022 } from "./2022";

/** Year => { Major Name => Major2, Supported Major Names => [Major Name] } */
export const SUPPORTED_MAJORS: Record<
  string,
  { majors: Record<string, Major2>; supportedMajorNames: string[] }
> = {
  "2022": {
    majors: SUPPORTED_MAJORS_2022,
    supportedMajorNames: SUPPORED_MAJORS_NAMES_2022,
  },
};

export const SUPPORTED_MAJOR_YEARS = Object.keys(SUPPORTED_MAJORS);
