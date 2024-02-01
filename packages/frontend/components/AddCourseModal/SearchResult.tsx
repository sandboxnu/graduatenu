import { AddIcon } from "@chakra-ui/icons";
import { Flex, Box, IconButton, Text, Divider } from "@chakra-ui/react";
import { NUPathEnum, ScheduleCourse2 } from "@graduate/common";
import { getCourseDisplayString } from "../../utils/";
import { GraduateToolTip } from "../GraduateTooltip";
import { NUPathLabel } from "./NUPathLabel";

interface SearchResultProps {
  searchResult: ScheduleCourse2<null>;
  addSelectedCourse: (course: ScheduleCourse2<null>) => void;
  isResultAlreadySelected: boolean;
  isResultAlreadyAdded: boolean;
  /** Another course is currently in the process of being selected. */
  isSelectingAnotherCourse?: boolean;
  filteredPaths: NUPathEnum[];
}

export const SearchResult: React.FC<SearchResultProps> = ({
  searchResult,
  addSelectedCourse,
  isResultAlreadySelected,
  isResultAlreadyAdded,
  isSelectingAnotherCourse,
  filteredPaths,
}) => {
  const isAddButtonDisabled = isResultAlreadyAdded || isResultAlreadySelected;
  const addButtonTooltip = isResultAlreadyAdded
    ? "This course has already been added."
    : isResultAlreadySelected
    ? "This course is already selected."
    : undefined;

  return (
    <Flex direction="column">
      <Flex justifyContent="space-between" px="md" paddingBottom="10px">
        <Box maxWidth="250px">
          <Text>
            <Text
              as="span"
              fontSize="14px"
              fontWeight="bold"
              word-whiteSpace="10px"
              paddingRight="5px"
            >
              {getCourseDisplayString(searchResult) + " "}
            </Text>
            <Text as="span" size="sm" fontWeight="normal">
              {searchResult.name}
            </Text>
          </Text>
        </Box>
        <NUPathLabel
          nupaths={searchResult.nupaths == null ? [] : searchResult.nupaths}
          filteredPaths={filteredPaths}
        />
        <GraduateToolTip
          label={addButtonTooltip}
          shouldWrapChildren
          mt="3"
          isDisabled={!isAddButtonDisabled}
        >
          <IconButton
            aria-label="Add class"
            icon={<AddIcon />}
            variant="solid"
            borderWidth="2px"
            borderColor="primary.blue.light.main"
            backgroundColor="rgba(0, 0, 0, 0)"
            color="primary.blue.light.main"
            colorScheme="primary.blue.light"
            borderRadius="3xl"
            size="xs"
            onClick={() => addSelectedCourse(searchResult)}
            isDisabled={isResultAlreadyAdded || isResultAlreadySelected}
            isLoading={isSelectingAnotherCourse}
            alignSelf="center"
          />
        </GraduateToolTip>
      </Flex>
      <Divider
        borderWidth="1px"
        colorScheme="gray"
        orientation="horizontal"
        flexGrow="1"
      />
    </Flex>
  );
};
