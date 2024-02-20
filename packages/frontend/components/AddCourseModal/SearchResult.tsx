import { AddIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { NUPathEnum, ScheduleCourse2 } from "@graduate/common";
import { getCourseDisplayString } from "../../utils/";
import { GraduateToolTip } from "../GraduateTooltip";
import { NUPathLabel } from "./NUPathLabel";

interface SearchResultProps {
  course: ScheduleCourse2<null>;
  addSelectedCourse: (course: ScheduleCourse2<null>) => Promise<void>;
  isResultAlreadySelected: boolean;
  isResultAlreadyAdded: boolean;
  /** Another course is currently in the process of being selected. */
  isSelectingAnotherCourse?: boolean;
  selectedNUPaths: NUPathEnum[];
}

export const SearchResult: React.FC<SearchResultProps> = ({
  course,
  addSelectedCourse,
  isResultAlreadySelected,
  isResultAlreadyAdded,
  isSelectingAnotherCourse,
  selectedNUPaths: filteredPaths,
}) => {
  const isAddButtonDisabled = isResultAlreadyAdded || isResultAlreadySelected;
  const addButtonTooltip = isResultAlreadyAdded
    ? "This course has already been added."
    : isResultAlreadySelected
    ? "This course is already selected."
    : undefined;

  return (
    <Flex
      justifyContent="space-between"
      alignItems="end"
      padding="1"
      paddingY="2"
      borderBottom="2px"
      borderColor="neutral.100"
    >
      <Box flex="2">
        <Text>
          <Text as="span" fontSize="14px" fontWeight="bold" marginRight="2">
            {getCourseDisplayString(course)}
          </Text>
          <Text as="span" size="sm" fontWeight="normal">
            {course.name}
          </Text>
        </Text>
      </Box>
      <NUPathLabel
        nuPaths={course.nupaths ? course.nupaths : []}
        filteredPaths={filteredPaths}
      />
      <GraduateToolTip
        label={addButtonTooltip}
        isDisabled={!isAddButtonDisabled}
      >
        <IconButton
          aria-label="Add class"
          icon={<AddIcon />}
          color="primary.blue.light.main"
          borderColor="primary.blue.light.main"
          colorScheme="primary.blue.light.main"
          isRound
          size="xs"
          onClick={() => addSelectedCourse(course)}
          isLoading={isSelectingAnotherCourse}
          isDisabled={isResultAlreadyAdded || isResultAlreadySelected}
          alignSelf="center"
        />
      </GraduateToolTip>
    </Flex>
  );
};
