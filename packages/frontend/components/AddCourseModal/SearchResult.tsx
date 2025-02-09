import {
  AddIcon,
  InfoOutlineIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";
import { Box, Flex, IconButton, Text, Collapse } from "@chakra-ui/react";
import { NUPathEnum, ScheduleCourse2, SeasonEnum } from "@graduate/common";
import { getCourseDisplayString } from "../../utils/";
import { GraduateToolTip } from "../GraduateTooltip";
import { NUPathLabel } from "./NUPathLabel";
import { getSearchLink } from "../ScheduleCourse";
import { useState } from "react";

interface SearchResultProps {
  course: ScheduleCourse2<null>;
  year: number | undefined;
  season: SeasonEnum;
  addSelectedCourse: (course: ScheduleCourse2<null>) => Promise<void>;
  isResultAlreadySelected: boolean;
  isResultAlreadyAdded: boolean;
  /** Another course is currently in the process of being selected. */
  isSelectingAnotherCourse?: boolean;
  selectedNUPaths: NUPathEnum[];
}

export const SearchResult: React.FC<SearchResultProps> = ({
  course,
  year,
  season,
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
  /* This useState is only used for course-coreq hybrid search results */
  const [opened, setOpened] = useState(false);

  return (
    <Box>
      <Flex
        justifyContent="space-between"
        alignItems="end"
        padding="2xs"
        paddingY="xs"
        borderBottom="1px"
        borderColor="neutral.100"
      >
        <Flex width="100%" mr="md" alignItems="center" minH="25px">
          <Box lineHeight="1.2">
            <Text as="span" fontSize="sm" fontWeight="bold" marginRight="sm">
              {getCourseDisplayString(course)}
            </Text>
            <Text as="span" fontSize="sm">
              {course.name}
            </Text>
            {course.coreqs &&
              (opened ? (
                <ChevronUpIcon
                  boxSize="25px"
                  color="black"
                  onClick={() => setOpened(!opened)}
                />
              ) : (
                <ChevronDownIcon
                  boxSize="25px"
                  color="black"
                  onClick={() => setOpened(!opened)}
                />
              ))}
          </Box>
          <Box ml="auto" mr="sm"></Box>
          <GraduateToolTip
            label={`Search for ${getCourseDisplayString(course)} on SearchNEU`}
          >
            <a
              href={getSearchLink(year ?? 2022, season, course)}
              target="_blank"
              rel="noreferrer"
            >
              <IconButton
                aria-label="Search course information"
                icon={<InfoOutlineIcon />}
                color="primary.blue.light.main"
                border={0}
                colorScheme="primary.blue.light.main"
                isRound
                size="md"
                isLoading={isSelectingAnotherCourse}
                isDisabled={isResultAlreadyAdded || isResultAlreadySelected}
                alignSelf="center"
              />
            </a>
          </GraduateToolTip>
          <NUPathLabel
            nuPaths={course.nupaths ? course.nupaths : []}
            filteredPaths={filteredPaths}
          />
        </Flex>

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
            mr="sm"
            onClick={() => addSelectedCourse(course)}
            isLoading={isSelectingAnotherCourse}
            isDisabled={isResultAlreadyAdded || isResultAlreadySelected}
            alignSelf="center"
          />
        </GraduateToolTip>
      </Flex>
      {/* {course.coreqs && (
        <Collapse in={opened} animateOpacity>
          <Box px="sm" py="xs" borderRadius="lg" backgroundColor="transparent">
            <Text fontSize="sm">boo</Text>
          </Box>
        </Collapse>
      )} */}
    </Box>
  );
};
