import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";
import { PlanModel, ScheduleYear2 } from "@graduate/common";
import { useState } from "react";
import { ScheduleYear } from "./ScheduleYear";

interface PlanProps {
  plan: PlanModel<string>;
}

export const Plan: React.FC<PlanProps> = ({ plan }) => {
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

  return (
    <Flex flexDirection="column" rowGap="4xs">
      {plan.schedule.years.map((scheduleYear, idx) => {
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
            />
          </Box>
        );
      })}
    </Flex>
  );
};
