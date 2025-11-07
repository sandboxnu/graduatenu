import { Flex, GridItem, Text, useDisclosure } from "@chakra-ui/react";
import {
  courseToString,
  ScheduleCourse2,
  ScheduleTerm2,
  SeasonEnum,
  TermError,
} from "@graduate/common";
import { DraggableScheduleCourse } from "../ScheduleCourse";
import { useDroppable } from "@dnd-kit/core";
import {
  getSeasonDisplayWord,
  isCourseInTerm,
  totalCreditsInTerm,
} from "../../utils";
import { AddCourseButton, AddCourseModal } from "../AddCourseModal";

interface ScheduleTermProps {
  scheduleTerm: ScheduleTerm2<string>;
  catalogYear: number;
  yearNum: number;
  termCoReqErr?: TermError;
  termPreReqErr?: TermError;
  isSharedPlan?: boolean;

  /** Function to add classes to a given term in the plan being displayed. */
  addClassesToTermInCurrPlan: (
    classes: ScheduleCourse2<null>[],
    termYear: number,
    termSeason: SeasonEnum
  ) => void;

  /** Function to remove a course from a given term in the plan being displayed. */
  removeCourseFromTermInCurrPlan: (
    course: ScheduleCourse2<unknown>,
    courseIndex: number,
    termYear: number,
    termSeason: SeasonEnum
  ) => void;

  setIsRemove?: (val: boolean) => void;
}

export const ScheduleTerm: React.FC<ScheduleTermProps> = ({
  scheduleTerm,
  catalogYear,
  addClassesToTermInCurrPlan,
  yearNum,
  removeCourseFromTermInCurrPlan,
  setIsRemove,
  termCoReqErr = undefined,
  termPreReqErr = undefined,
  isSharedPlan,
}) => {
  const { isOver, setNodeRef } = useDroppable({ id: scheduleTerm.id });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isCourseInCurrTerm = (course: ScheduleCourse2<unknown>) => {
    return isCourseInTerm(course.classId, course.subject, scheduleTerm);
  };

  return (
    <GridItem
      ref={setNodeRef}
      transition="background-color 0.1s ease"
      backgroundColor={isOver ? "neutral.200" : "neutral.100"}
      display="flex"
      flexDirection="column"
      px="sm"
      pt="sm"
      pb="xl"
      userSelect="none"
    >
      <ScheduleTermHeader
        season={scheduleTerm.season}
        credits={totalCreditsInTerm(scheduleTerm)}
      />
      {scheduleTerm.classes.map((scheduleCourse, courseIndex) => (
        <DraggableScheduleCourse
          coReqErr={termCoReqErr?.[courseToString(scheduleCourse)]}
          preReqErr={termPreReqErr?.[courseToString(scheduleCourse)]}
          scheduleCourse={scheduleCourse}
          scheduleTerm={scheduleTerm}
          removeCourse={(course: ScheduleCourse2<unknown>) =>
            removeCourseFromTermInCurrPlan(
              course,
              courseIndex,
              yearNum,
              scheduleTerm.season
            )
          }
          isEditable
          key={scheduleCourse.id}
          setIsRemove={setIsRemove}
          isSharedPlan={isSharedPlan}
        />
      ))}
      {!isSharedPlan && <AddCourseButton onOpen={onOpen} />}
      <AddCourseModal
        season={scheduleTerm.season}
        isOpen={isOpen}
        catalogYear={catalogYear}
        addTo={getSeasonDisplayWord(scheduleTerm.season)}
        closeModalDisplay={onClose}
        isCourseAlreadyAdded={isCourseInCurrTerm}
        addSelectedClasses={(courses: ScheduleCourse2<null>[]) =>
          addClassesToTermInCurrPlan(courses, yearNum, scheduleTerm.season)
        }
        isAutoSelectCoreqs
      />
    </GridItem>
  );
};

interface ScheduleTermHeaderProps {
  season: SeasonEnum;
  credits: number;
}

const ScheduleTermHeader: React.FC<ScheduleTermHeaderProps> = ({
  season,
  credits,
}) => {
  const seasonDisplayWord = getSeasonDisplayWord(season);
  return (
    <Flex alignItems="start" columnGap="xs" pb="sm">
      <Text size="sm" textTransform="uppercase" fontWeight="bold">
        {seasonDisplayWord}
      </Text>
      <Text color="primary.blue.light.main" size="xs" fontWeight="medium">
        {credits} {credits === 1 ? "Credit" : "Credits"}
      </Text>
    </Flex>
  );
};
