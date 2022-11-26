import { Major2 } from "@graduate/common";
import * as bscs from "./bscs.json";

export const SUPPORED_MAJORS_NAMES_2022 = ["Computer Science, BSCS"] as const;
type SUPPORED_MAJORS_NAMES_2022_TUPLE_TYPE = typeof SUPPORED_MAJORS_NAMES_2022;
type SUPPORED_MAJORS_NAMES_2022_TYPE =
  SUPPORED_MAJORS_NAMES_2022_TUPLE_TYPE[number];

export const isSupportedMajor2022 = (
  major: string
): major is SUPPORED_MAJORS_NAMES_2022_TYPE => {
  return SUPPORED_MAJORS_NAMES_2022.includes(
    major as SUPPORED_MAJORS_NAMES_2022_TYPE
  );
};

export const SUPPORTED_MAJORS_2022: Record<
  SUPPORED_MAJORS_NAMES_2022_TYPE,
  Major2
> = {
  "Computer Science, BSCS": bscs as any,
};
