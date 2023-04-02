import { Major2 } from "@graduate/common";
import * as Computer_Science_BSCS_2022 from "./Computer_Science_BSCS/Computer_Science_BSCS-2022.json";

const SUPPORTED_MAJORS_2022: Record<string, Major2> = {
  "Computer Science, BSCS": Computer_Science_BSCS_2022 as any,
};

const SUPPORED_MAJORS_NAMES_2022 = Object.keys(SUPPORTED_MAJORS_2022);

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
