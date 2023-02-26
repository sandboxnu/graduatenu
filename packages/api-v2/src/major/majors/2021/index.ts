import { Major2 } from "@graduate/common";
import * as math_physics from "./math-physics-2021.json";
import * as linguistics_english from "./linguistics-english-2021.json";

export const SUPPORTED_MAJORS_2021: Record<string, Major2> = {
  "Mathematics and Physics, BS": math_physics as any,
  "Linguistics and English, BA": linguistics_english as any,
};

export const SUPPORED_MAJORS_NAMES_2021 = Object.keys(SUPPORTED_MAJORS_2021);
