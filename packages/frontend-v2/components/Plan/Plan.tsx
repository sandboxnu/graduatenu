import { VStack } from "@chakra-ui/react";
import { PlanModel } from "@graduate/common";
import { ScheduleYear } from "./ScheduleYear";

interface PlanProps {
  plan: PlanModel<string>;
}

export const Plan: React.FC<PlanProps> = ({ plan }) => {
  return (
    <VStack spacing="xl">
      {plan.schedule.years.map((scheduleYear) => (
        <ScheduleYear scheduleYear={scheduleYear} key={scheduleYear.year} />
      ))}
    </VStack>
  );
};
