import { SeasonEnum } from "../models/types";

const NUM_YEARS_AND_COOPS_OPTIONS: { numYears: number; numCoops: number }[] = [
  { numYears: 5, numCoops: 3 },
  { numYears: 4, numCoops: 2 },
];

const SEASON_ENUM_TO_TITLE: Record<string, string> = {
  [SeasonEnum.FL]: "Fall",
  [SeasonEnum.SP]: "Spring",
  [SeasonEnum.SM]: "Summer",
};

const isValidCoopCycleSeason = (season: SeasonEnum): boolean =>
  season !== SeasonEnum.S1 && season !== SeasonEnum.S2;

/**'
 * This is the basic set of co-op cycle options which can be selected for any major.
 * It consists of:
 * - 5 years, 3 co-ops, spring/fall/summer
 * - 4 years, 3 co-ops, spring/fall/summer
 */
export const BASE_FORMATTED_COOP_CYCLES: string[] =
  NUM_YEARS_AND_COOPS_OPTIONS.map((option) =>
    Object.values(SeasonEnum)
      .filter(isValidCoopCycleSeason)
      .map((season: string) => {
        return (
          `${option.numYears} Years, ` +
          `${option.numCoops} Co-ops, ` +
          `${SEASON_ENUM_TO_TITLE[season]} Cycle`
        );
      })
  ).reduce((acc, coopCyclesPerOption) => [...acc, ...coopCyclesPerOption], []);
