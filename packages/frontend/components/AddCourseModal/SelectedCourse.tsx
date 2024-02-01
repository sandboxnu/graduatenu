import { Flex, Text } from "@chakra-ui/react";
import { NUPathEnum, ScheduleCourse2 } from "@graduate/common";
import { getCourseDisplayString } from "../../utils/";
import { CourseTrashButton } from "../ScheduleCourse/CourseTrashButton";
import { NUPathLabel } from "./NUPathLabel";

interface SelectedCourseProps {
  selectedCourse: ScheduleCourse2<null>;
  filteredPaths?: NUPathEnum[];
  removeSelectedCourse: (course: ScheduleCourse2<null>) => void;
}

export const SelectedCourse: React.FC<SelectedCourseProps> = ({
  selectedCourse,
  removeSelectedCourse,
  filteredPaths,
}) => {
  return (
    <Flex
      borderRadius="md"
      borderColor="gray.100"
      backgroundColor="white.100"
      alignItems="center"
      flexGrow="1"
    >
      <Flex direction="row" flexWrap="wrap">
        <Text>
          <Text
            as="span"
            fontSize="14px"
            fontWeight="bold"
            word-whiteSpace="10px"
            paddingRight="5px"
          >
            {getCourseDisplayString(selectedCourse) + " "}
          </Text>
          <Text as="span" size="sm" fontWeight="normal">
            {selectedCourse.name}
          </Text>
        </Text>
        <NUPathLabel
          nupaths={selectedCourse.nupaths == null ? [] : selectedCourse.nupaths}
          filteredPaths={filteredPaths ? filteredPaths : []}
        />
      </Flex>
      <CourseTrashButton onClick={() => removeSelectedCourse(selectedCourse)} />
    </Flex>
  );
};
