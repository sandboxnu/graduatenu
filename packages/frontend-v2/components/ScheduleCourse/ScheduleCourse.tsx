import { Box, Text } from "@chakra-ui/react";
import { ScheduleCourse2 } from "@graduate/common";

interface ScheduleCourseProps {
  scheduleCourse: ScheduleCourse2<string>;
}

export const ScheduleCourse: React.FC<ScheduleCourseProps> = ({
  scheduleCourse,
}) => {
  return (
    <Box>
      <Text>{scheduleCourse.classId}</Text>
    </Box>
  );
};
