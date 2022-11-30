import { Major2 } from "@graduate/common";
import * as bscs from "./bscs.json";

export const SUPPORTED_MAJORS_2022: Record<string, Major2> = {
  "Computer Science, BSCS": bscs as any,
};

export const SUPPORED_MAJORS_NAMES_2022 = Object.keys(SUPPORTED_MAJORS_2022);
