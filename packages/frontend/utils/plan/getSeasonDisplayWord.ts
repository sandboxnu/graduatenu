import { SeasonEnum } from "@graduate/common";
import { logger } from "../logger";

/** Gets the display string shown to the user for a given season */
export const getSeasonDisplayWord = (season: SeasonEnum): string => {
  const SEASON_TO_SEASON_DISPLAY_WORD = new Map<
    keyof typeof SeasonEnum,
    string
  >([
    [SeasonEnum.FL, "Fall"],
    [SeasonEnum.SP, "Spring"],
    [SeasonEnum.S1, "Summer I"],
    [SeasonEnum.S2, "Summer II"],
  ]);

  const seasonDisplayWord = SEASON_TO_SEASON_DISPLAY_WORD.get(season);
  if (!seasonDisplayWord) {
    logger.debug("getSeasonDisplayWord", "Unknown season", season);
    throw new Error("Unknown Season");
  }

  return seasonDisplayWord;
};
