import { Major2 } from "@graduate/common";
import * as bscs from "./bscs.json";
import * as bscsNoConcentration from "./bscs-no-concentration.json";

export const SUPPORTED_MAJORS_2022: Record<string, Major2> = {
  "Computer Science, BSCS": bscs as any,
  "Computer Science, BSCS No Concentration": bscsNoConcentration as any,
};

export const SUPPORED_MAJORS_NAMES_2022 = Object.keys(SUPPORTED_MAJORS_2022);
