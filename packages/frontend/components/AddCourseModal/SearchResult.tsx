import { AddIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { NUPathEnum, ScheduleCourse2, SeasonEnum } from "@graduate/common";
import { getCourseDisplayString } from "../../utils/";
import { GraduateToolTip } from "../GraduateTooltip";
import { NUPathLabel } from "./NUPathLabel";
import Image from "next/image";
import { getSearchLink } from "../ScheduleCourse";

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
        </Box>
        <Box ml="auto" mr="sm"></Box>
        <a
          href={getSearchLink(2022, SeasonEnum.FL, course)}
          target="_blank"
          rel="noreferrer"
        >
          <Image
            src="/more-info.svg"
            width={14}
            height={14}
            alt="See on SearchNU!"
          />
        </a>
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
  );
};
