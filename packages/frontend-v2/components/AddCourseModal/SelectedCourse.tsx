import { Flex, Text } from "@chakra-ui/react";
import { ScheduleCourse2 } from "@graduate/common";
import { getCourseDisplayString } from "../../utils/";
import { CourseTrashButton } from "../ScheduleCourse/CourseTashButton";

interface SelectedCourseProps {
  selectedCourse: ScheduleCourse2<null>;
  removeSelectedCourse: (course: ScheduleCourse2<null>) => void;
}

export const SelectedCourse: React.FC<SelectedCourseProps> = ({
  selectedCourse,
  removeSelectedCourse,
}) => {
  return (
    <Flex
      borderRadius="md"
      boxShadow="md"
      backgroundColor="neutral.main"
      alignItems="center"
    >
      <Text pl="sm" pr="2xs">
        {getCourseDisplayString(selectedCourse)}
      </Text>
      <Text fontSize="xs" pr="md">
        {selectedCourse.name}
      </Text>
      <CourseTrashButton
        onClick={() => removeSelectedCourse(selectedCourse)}
        ml="auto"
      />
    </Flex>
  );
};
