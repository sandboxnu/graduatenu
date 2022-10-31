import { Grid, GridItem, Heading, useDisclosure } from "@chakra-ui/react";
import { ScheduleCourse2, ScheduleTerm2, SeasonEnum } from "@graduate/common";
import { DraggableScheduleCourse } from "../ScheduleCourse";
import { useDroppable } from "@dnd-kit/core";
import { logger } from "../../utils";
import { AddCourseModal } from "../AddCourseModal";
import { AddIcon } from "@chakra-ui/icons";
import { BlueButton } from "../Button";

interface ScheduleTermProps {
  scheduleTerm: ScheduleTerm2<string>;

  /** Function to check if a courses exists in the current plan being displayed. */
  isCourseInCurrPlan: (course: ScheduleCourse2<unknown>) => boolean;

  /** Function to add classes to a given term in the plan being displayed. */
  addClassesToTermInCurrPlan: (
    classes: ScheduleCourse2<null>[],
    termYear: number,
    termSeason: SeasonEnum
  ) => void;

  /** Function to remove a course from a given term in the plan being displayed. */
  removeCourseFromTermInCurrPlan: (
    course: ScheduleCourse2<unknown>,
    termYear: number,
    termSeason: SeasonEnum
  ) => void;

  isLastColumn?: boolean;
}

export const ScheduleTerm: React.FC<ScheduleTermProps> = ({
  scheduleTerm,
  isCourseInCurrPlan,
  addClassesToTermInCurrPlan,
  removeCourseFromTermInCurrPlan,
  isLastColumn,
}) => {
  const { isOver, setNodeRef } = useDroppable({ id: scheduleTerm.id });
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <GridItem
      ref={setNodeRef}
      borderRight={!isLastColumn ? "1px" : undefined}
      transition="background-color 0.1s ease"
      backgroundColor={isOver ? "neutral.300" : "neutral.main"}
      px="sm"
      pt="2xs"
      pb="xl"
      userSelect="none"
    >
      <ScheduleTermHeader
        season={scheduleTerm.season}
        year={scheduleTerm.year}
      />
      <Grid gap="2xs">
        {scheduleTerm.classes.map((scheduleCourse) => (
          <DraggableScheduleCourse
            scheduleCourse={scheduleCourse}
            removeCourse={(course: ScheduleCourse2<unknown>) =>
              removeCourseFromTermInCurrPlan(
                course,
                scheduleTerm.year,
                scheduleTerm.season
              )
            }
            isEditable
            key={scheduleCourse.id}
          />
        ))}
      </Grid>
      <AddCourseButton onOpen={onOpen} />
      <AddCourseModal
        isOpen={isOpen}
        closeModalDisplay={onClose}
        isCourseInCurrPlan={isCourseInCurrPlan}
        addClassesToCurrTerm={(courses: ScheduleCourse2<null>[]) =>
          addClassesToTermInCurrPlan(
            courses,
            scheduleTerm.year,
            scheduleTerm.season
          )
        }
      />
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

interface AddCourseButtonProps {
  onOpen: () => void;
}

const AddCourseButton: React.FC<AddCourseButtonProps> = ({ onOpen }) => {
  return (
    <BlueButton
      leftIcon={<AddIcon w={2} h={2} color="primary.blue.light.main" />}
      onClick={onOpen}
      mt="md"
      size="sm"
    >
      Add Course
    </BlueButton>
  );
};
