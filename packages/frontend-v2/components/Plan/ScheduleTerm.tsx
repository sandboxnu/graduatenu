import { Grid, GridItem, Heading } from "@chakra-ui/react";
import { ScheduleTerm2, SeasonEnum } from "@graduate/common";
import { DraggableScheduleCourse } from "../ScheduleCourse";
import { useDroppable } from "@dnd-kit/core";
import { logger } from "../../utils";

interface ScheduleTermProps {
  scheduleTerm: ScheduleTerm2<string>;
  isLastColumn?: boolean;
}

export const ScheduleTerm: React.FC<ScheduleTermProps> = ({
  scheduleTerm,
  isLastColumn,
}) => {
  const { isOver, setNodeRef } = useDroppable({ id: scheduleTerm.id });

  return (
    <GridItem
      ref={setNodeRef}
      borderRight={!isLastColumn ? "1px" : undefined}
      backgroundColor={isOver ? "neutral.300" : undefined}
      px="sm"
      pt="2xs"
      pb="xl"
    >
      <ScheduleTermHeader
        season={scheduleTerm.season}
        year={scheduleTerm.year}
      />
      <Grid gap="2xs">
        {scheduleTerm.classes.map((scheduleCourse) => (
          <DraggableScheduleCourse
            scheduleCourse={scheduleCourse}
            key={scheduleCourse.id}
          />
        ))}
      </Grid>
    </GridItem>
  );
};

interface ScheduleTermHeaderProps {
  season: SeasonEnum;
  year: number;
}

const ScheduleTermHeader: React.FC<ScheduleTermHeaderProps> = ({
  season,
  year,
}) => {
  const seasonDisplayWord = getSeasonDisplayWord(season);
  return (
    <Heading size="sm" pb="sm">
      {seasonDisplayWord} {year}
    </Heading>
  );
};

/** Gets the display string shown to the user for a given season */
const getSeasonDisplayWord = (season: SeasonEnum): string => {
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
