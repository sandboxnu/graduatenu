import { Flex } from "@chakra-ui/react";
import {
  CoReqWarnings,
  PlanModel,
  PreReqWarnings,
  ScheduleCourse2,
  ScheduleYear2,
  SeasonEnum,
} from "@graduate/common";
import { useState, createContext } from "react";
import { addClassesToTerm, removeYearFromPlan } from "../../utils";
import { removeCourseFromTerm } from "../../utils";
import { ScheduleYear } from "./ScheduleYear";
import { useDroppable } from "@dnd-kit/core";
import { AddYearButton } from "./AddYearButton";

interface PlanProps {
  plan: PlanModel<string>;
  preReqErr?: PreReqWarnings;
  coReqErr?: CoReqWarnings;
  setIsRemove?: (val: boolean) => void;

  /**
   * Function to POST the plan and update the SWR cache for "student with plans"
   * with the given updated plan.
   */
  mutateStudentWithUpdatedPlan: (updatedPlan: PlanModel<string>) => void;
}

export const TotalYearsContext = createContext<number | null>(null);
export const PlanContext = createContext<PlanModel<string> | null>(null);
export const Plan: React.FC<PlanProps> = ({
  plan,
  mutateStudentWithUpdatedPlan,
  preReqErr = undefined,
  coReqErr = undefined,
  setIsRemove,
}) => {
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set());
  const totalYears = plan.schedule.years.length;

  const toggleExpanded = (year: ScheduleYear2<unknown>) => {
    if (expandedYears.has(year.year)) {
      removeFromExpandedYears(year);
    } else {
      addToExpandedYears(year);
    }
  };

  const { setNodeRef } = useDroppable({ id: "plan" });

  const removeFromExpandedYears = (year: ScheduleYear2<unknown>) => {
    const updatedSet = new Set(expandedYears);
    updatedSet.delete(year.year);
    setExpandedYears(updatedSet);
  };

  const addToExpandedYears = (year: ScheduleYear2<unknown>) => {
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
    courseIndex: number,
    termYear: number,
    termSeason: SeasonEnum
  ) => {
    const updatedPlan = removeCourseFromTerm(
      course,
      courseIndex,
      termYear,
      termSeason,
      plan
    );
    mutateStudentWithUpdatedPlan(updatedPlan);
  };

  const removeYearFromCurrPlan = async (yearNum: number) => {
    const updatedPlan = removeYearFromPlan(plan, yearNum);
    mutateStudentWithUpdatedPlan(updatedPlan);

    /**
     * We want to ensure that the expanded set remains consistent: years that
     * were expanded before remain expanded, and years that weren't remain collapsed.
     *
     * Years after yearNum were all decremented by 1(because yearNum was
     * removed). Hence, if a year x + 1 was in the expandedSet previously, add x.
     */
    setExpandedYears((prevExpandedYears) => {
      const updatedExpandedYears = new Set<number>();
      for (let i = 1; i < updatedPlan.schedule.years.length + 1; i++) {
        if (i < yearNum && prevExpandedYears.has(i)) {
          updatedExpandedYears.add(i);
        } else if (i >= yearNum && prevExpandedYears.has(i + 1)) {
          updatedExpandedYears.add(i);
        }
      }

      return updatedExpandedYears;
    });
  };

  return (
    <TotalYearsContext.Provider value={totalYears}>
      <PlanContext.Provider value={plan}>
        <Flex direction="column" rowGap="sm">
          <Flex flexDirection="column" rowGap="4xs" ref={setNodeRef}>
            {plan.schedule.years.map((scheduleYear) => {
              const isExpanded = expandedYears.has(scheduleYear.year);

              return (
                <Flex key={scheduleYear.year} flexDirection="column">
                  <ScheduleYear
                    catalogYear={plan.catalogYear}
                    yearCoReqError={coReqErr?.years.find(
                      (year) => year.year == scheduleYear.year
                    )}
                    yearPreReqError={preReqErr?.years.find(
                      (year) => year.year == scheduleYear.year
                    )}
                    scheduleYear={scheduleYear}
                    isExpanded={isExpanded}
                    toggleExpanded={() => toggleExpanded(scheduleYear)}
                    addClassesToTermInCurrPlan={addClassesToTermInCurrPlan}
                    removeCourseFromTermInCurrPlan={
                      removeCourseFromTermInCurrPlan
                    }
                    removeYearFromCurrPlan={() =>
                      removeYearFromCurrPlan(scheduleYear.year)
                    }
                    setIsRemove={setIsRemove}
                  />
                </Flex>
              );
            })}
          </Flex>
          <Flex>
            <AddYearButton
              plan={plan}
              mutateStudentWithUpdatedPlan={mutateStudentWithUpdatedPlan}
            />
          </Flex>
        </Flex>
      </PlanContext.Provider>
    </TotalYearsContext.Provider>
  );
};
