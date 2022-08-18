import { HStack } from "@chakra-ui/react";
import { ScheduleYear2 } from "@graduate/common";
import { ScheduleTerm } from "./ScheduleTerm";

interface ScheduleYearProps {
  scheduleYear: ScheduleYear2<string>;
}

export const ScheduleYear: React.FC<ScheduleYearProps> = ({ scheduleYear }) => {
  const yearContent = (
    <HStack spacing="xl" border="1px" p="sm">
      <ScheduleTerm scheduleTerm={scheduleYear.fall} />
      <ScheduleTerm scheduleTerm={scheduleYear.spring} />
      {/* TODO: support summer full term */}
      <ScheduleTerm scheduleTerm={scheduleYear.summer1} />
      <ScheduleTerm scheduleTerm={scheduleYear.summer2} />
    </HStack>
  );

  return yearContent;
};
