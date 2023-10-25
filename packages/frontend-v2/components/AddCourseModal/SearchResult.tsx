import { SmallAddIcon } from "@chakra-ui/icons";
import { Flex, Box, Heading, IconButton, Text } from "@chakra-ui/react";
import { ScheduleCourse2 } from "@graduate/common";
import { getCourseDisplayString } from "../../utils/";
import { GraduateToolTip } from "../GraduateTooltip";

interface SearchResultProps {
  searchResult: ScheduleCourse2<null>;
  addSelectedCourse: (course: ScheduleCourse2<null>) => void;
  isResultAlreadySelected: boolean;
  isResultAlreadyAdded: boolean;
  /** Another course is currently in the process of being selected. */
  isSelectingAnotherCourse?: boolean;
}

export const SearchResult: React.FC<SearchResultProps> = ({
  searchResult,
  addSelectedCourse,
  isResultAlreadySelected,
  isResultAlreadyAdded,
  isSelectingAnotherCourse,
}) => {
  const isAddButtonDisabled = isResultAlreadyAdded || isResultAlreadySelected;
  const addButtonTooltip = isResultAlreadyAdded
    ? "This course has already been added."
    : isResultAlreadySelected
    ? "This course is already selected."
    : undefined;

  return (
    <Flex justifyContent="space-between" px="md">
      <Box>
        <Heading size="sm" fontWeight="normal">
          {searchResult.name}
        </Heading>
        <Text fontSize="12px" fontStyle="italics">
          {getCourseDisplayString(searchResult)}
        </Text>
      </Box>
      <GraduateToolTip
        label={addButtonTooltip}
        shouldWrapChildren
        mt="3"
        isDisabled={!isAddButtonDisabled}
      >
        <IconButton
          aria-label="Add class"
          icon={<SmallAddIcon />}
          variant="solid"
          borderColor="primary.blue.light.main"
          backgroundColor="primary.blue.light.200"
          color="primary.blue.light.main"
          colorScheme="primary.blue.light"
          borderRadius="3xl"
          size="sm"
          onClick={() => addSelectedCourse(searchResult)}
          isDisabled={isResultAlreadyAdded || isResultAlreadySelected}
          isLoading={isSelectingAnotherCourse}
        />
      </GraduateToolTip>
    </Flex>
  );
};
