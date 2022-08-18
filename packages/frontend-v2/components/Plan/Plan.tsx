import { VStack } from "@chakra-ui/react";
import { PlanModel } from "@graduate/common";
import { ScheduleYear } from "./ScheduleYear";

interface PlanProps {
  plan?: PlanModel<string>;
}

export const Plan: React.FC<PlanProps> = ({ plan }) => {
  if (!plan) {
    // TODO: Support no plan -> create an empty plan and post to API
    throw new Error("Plan not provided");
  }

  return (
    <VStack spacing="xl">
      {plan.schedule.years.map((scheduleYear) => (
        <ScheduleYear scheduleYear={scheduleYear} key={scheduleYear.year} />
      ))}
    </VStack>
  );
};
