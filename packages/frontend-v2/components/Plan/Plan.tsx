import { Grid, GridItem } from "@chakra-ui/react";
import { PlanModel } from "@graduate/common";
import { ScheduleYear } from "./ScheduleYear";

interface PlanProps {
  plan: PlanModel<string>;
}

export const Plan: React.FC<PlanProps> = ({ plan }) => {
  const numYears = plan.schedule.years.length;
  return (
    <Grid templateRows={`repeat(${numYears}, 1fr)`}>
      {plan.schedule.years.map((scheduleYear, idx) => (
        <GridItem
          key={scheduleYear.year}
          borderX="1px"
          borderBottom={idx === numYears - 1 ? "1px" : undefined}
        >
          <ScheduleYear scheduleYear={scheduleYear} />
        </GridItem>
      ))}
    </Grid>
  );
};
