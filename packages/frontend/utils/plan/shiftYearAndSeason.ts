import { SeasonEnum } from "@graduate/common";

/**
 * Given the current year and season, shift the year and season by the given amount.
 *
 * @param   year   The current year
 * @param   season The current season
 * @param   shift  The amount to shift by, negative values will shift backwards
 *   and positive values will shift forwards
 * @returns        A tuple with the year and season with the shift applied
 */
export const shiftYearAndSeason = (
  year: number,
  season: SeasonEnum,
  shift: number
): {
  year: number;
  season: SeasonEnum;
} => {
  const validSeasons = [
    SeasonEnum.FL,
    SeasonEnum.SP,
    SeasonEnum.S1,
    SeasonEnum.S2,
  ];
  const yearSeasonTupleMap = new Map<number, [number, SeasonEnum]>();

  let yearSeasonValue = 0;
  let currentSeasonIndex = -1;
  // the maximum number of years is the current year plus the shift amount divided by 4 (because each year has 4 seasons)
  for (
    let yearTrack = 1;
    yearTrack <= year + Math.ceil(shift / 4);
    yearTrack++
  ) {
    for (const seasonTrack of validSeasons) {
      yearSeasonTupleMap.set(yearSeasonValue, [yearTrack, seasonTrack]);
      if (yearTrack === year && seasonTrack === season) {
        currentSeasonIndex = yearSeasonValue;
      }
      yearSeasonValue++;
    }
  }

  const result = yearSeasonTupleMap.get(currentSeasonIndex + shift) ?? [
    year,
    season,
  ];

  return {
    year: result[0],
    season: result[1],
  };
};
