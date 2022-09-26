import { Box, Flex } from "@chakra-ui/react";
import {
  PlanModel,
  ScheduleCourse2,
  ScheduleYear2,
  SeasonEnum,
} from "@graduate/common";
import { useState } from "react";
import { addClassesToTerm, isCourseInPlan } from "../../utils";
import { removeCourseFromTerm } from "../../utils/";
import { ScheduleYear } from "./ScheduleYear";

interface PlanProps {
  plan: PlanModel<string>;

  /**
   * Function to POST the plan and update the SWR cache for "student with plans"
   * with the given updated plan.
   */
  mutateStudentWithUpdatedPlan: (updatedPlan: PlanModel<string>) => void;
}

export const Plan: React.FC<PlanProps> = ({
  plan,
  mutateStudentWithUpdatedPlan,
}) => {
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set());

  const toggleExpanded = (year: ScheduleYear2<string>) => {
    if (expandedYears.has(year.year)) {
      removeFromExpandedYears(year);
    } else {
      addToExpandedYears(year);
    }
  };

  const removeFromExpandedYears = (year: ScheduleYear2<string>) => {
    const updatedSet = new Set(expandedYears);
    updatedSet.delete(year.year);
    setExpandedYears(updatedSet);
  };

  const addToExpandedYears = (year: ScheduleYear2<string>) => {
    const updatedSet = new Set(expandedYears);
    updatedSet.add(year.year);
    setExpandedYears(updatedSet);
  };

  const addClassesToTermInCurrPlan = (
    classes: ScheduleCourse2<null>[],
    termYear: number,
    termSeason: SeasonEnum
  ) => {
    const updatedPlan = addClassesToTerm(classes, termYear, termSeason, plan);
    mutateStudentWithUpdatedPlan(updatedPlan);
  };

  const removeCourseFromTermInCurrPlan = (
    course: ScheduleCourse2<unknown>,
    termYear: number,
    termSeason: SeasonEnum
  ) => {
    const updatedPlan = removeCourseFromTerm(
      course,
      termYear,
      termSeason,
      plan
    );
    mutateStudentWithUpdatedPlan(updatedPlan);
  };

  return (
    <Flex flexDirection="column" rowGap="4xs">
      {plan.schedule.years.map((scheduleYear) => {
        const isExpanded = expandedYears.has(scheduleYear.year);

        return (
          <Box
            key={scheduleYear.year}
            borderX={isExpanded ? "1px" : undefined}
            borderBottom={isExpanded ? "1px" : undefined}
            minHeight={isExpanded ? "300px" : undefined}
          >
            <ScheduleYear
              scheduleYear={scheduleYear}
              isExpanded={isExpanded}
              toggleExpanded={() => toggleExpanded(scheduleYear)}
              isCourseInCurrPlan={(course: ScheduleCourse2<unknown>) =>
                isCourseInPlan(course, plan)
              }
              addClassesToTermInCurrPlan={addClassesToTermInCurrPlan}
              removeCourseFromTermInCurrPlan={removeCourseFromTermInCurrPlan}
            />
          </Box>
        );
      })}
    </Flex>
  );
};
