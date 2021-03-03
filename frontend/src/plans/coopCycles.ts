import { SeasonEnum } from "../models/types";

const NUM_YEARS_AND_COOPS_OPTIONS: { numYears: number; numCoops: number }[] = [
  { numYears: 5, numCoops: 3 },
  { numYears: 4, numCoops: 2 },
];

const SEASON_ENUM_TO_TITLE: Record<SeasonEnum, string> = {
  [SeasonEnum.FL]: "Fall",
  [SeasonEnum.SP]: "Spring",
  [SeasonEnum.SM]: "Summer",
  [SeasonEnum.S1]: "Summer 1",
  [SeasonEnum.S2]: "Summer 2",
};

/**'
 * This is the basic set of co-op cycle options which can be selected for any major.
 * It consists of:
 * - 5 years, 3 co-ops, spring/fall/summer/summer1/summer2
 * - 4 years, 3 co-ops, spring/fall/summer/summer1/summer2
 */
export const BASE_FORMATTED_COOP_CYCLES: string[] = NUM_YEARS_AND_COOPS_OPTIONS.map(
  option =>
    Object.values(SeasonEnum).map((season: SeasonEnum) => {
      return `${option.numYears} Years, 
      ${option.numCoops} Co-ops, 
      ${SEASON_ENUM_TO_TITLE[season]} Cycle`;
    })
).reduce((acc, coopCyclesPerOption) => [...acc, ...coopCyclesPerOption], []);
