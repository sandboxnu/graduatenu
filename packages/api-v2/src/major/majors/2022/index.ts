import { Major2 } from "@graduate/common";
import * as bscs from "./bscs.json";
import * as bio from "./biology-bs-2022.json";
import * as history from "./history-bs-2022.json";

export const SUPPORTED_MAJORS_2022: Record<string, Major2> = {
  "Computer Science, BSCS": bscs as any,
  "Biology, BS": bio as any,
  "History, BS": history as any,
};

export const SUPPORED_MAJORS_NAMES_2022 = Object.keys(SUPPORTED_MAJORS_2022);
