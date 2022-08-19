import { Box, Heading, HStack } from "@chakra-ui/react";
import { ScheduleYear2 } from "@graduate/common";
import { ScheduleTerm } from "./ScheduleTerm";

interface ScheduleYearProps {
  scheduleYear: ScheduleYear2<string>;
}

export const ScheduleYear: React.FC<ScheduleYearProps> = ({ scheduleYear }) => {
  const yearContent = (
    <Box border="1px" p="sm">
      <Heading size="md">{scheduleYear.year}</Heading>
      <HStack spacing="xl">
        <ScheduleTerm scheduleTerm={scheduleYear.fall} />
        <ScheduleTerm scheduleTerm={scheduleYear.spring} />
        {/* TODO: support summer full term */}
        <ScheduleTerm scheduleTerm={scheduleYear.summer1} />
        <ScheduleTerm scheduleTerm={scheduleYear.summer2} />
      </HStack>
    </Box>
  );

  return yearContent;
};
