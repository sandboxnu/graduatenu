import {
  ChevronDownIcon,
  ChevronUpIcon,
  SmallCloseIcon,
} from "@chakra-ui/icons";
import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import SectionRequirement from "./SectionRequirement";
import { IAndCourse2, ScheduleCourse2 } from "@graduate/common";
import { DraggableScheduleCourse } from "../ScheduleCourse";

// Define the props interface for GenericSection
interface GenericSectionProps {
  courseData: { [id: string]: ScheduleCourse2<null> };
  dndIdPrefix: string;
}

// The sample IAndCourse2 requirement object
const andCourseRequirement: IAndCourse2 = {
  type: "AND",
  courses: [],
};

const ClassOption: React.FC<{ type: "NUpath" | "Elective Placeholder" }> = ({
  type,
}) => {
  return (
    <Text fontSize="sm" color="primary.blue.dark.main" mt="0">
      {type === "NUpath" ? "NUpath" : "Elective Placeholder"}
    </Text>
  );
};

const GenericSection: React.FC<GenericSectionProps> = ({
  courseData,
  dndIdPrefix,
}) => {
  const [opened, setOpened] = useState(false);

  console.log(Object.keys(courseData)[0], "asdasd");

  return (
    <Box
      borderTopWidth="1px"
      borderTopColor="neutral.200"
      cursor="pointer"
      userSelect="none"
    >
      <Flex
        onClick={() => {
          setOpened(!opened);
        }}
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        color="dark.main"
        fontWeight="bold"
        py="md"
        px="md"
        margin="0"
        backgroundColor="neutral.50"
        transition="background-color 0.25s ease"
        _hover={{
          backgroundColor: "neutral.100",
        }}
        _active={{
          backgroundColor: "neutral.200",
        }}
        display="flex"
        position="sticky"
        top="0px"
        zIndex={1}
      >
        <Flex direction="row" height="100%" columnGap="sm">
          <Box
            bg="transparent"
            borderColor="neutral.400"
            borderWidth="1px"
            width="18px"
            height="18px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="2xl"
            mt="4xs"
            p="xs"
            position="relative"
          >
            <SmallCloseIcon position="absolute" opacity={0} />
          </Box>
          <Text color="primary.blue.dark.main" mt="0" fontSize="sm">
            General Placeholders
          </Text>
        </Flex>
        <Flex ml="xs" alignItems="center">
          {opened ? (
            <ChevronUpIcon boxSize="25px" color="primary.blue.dark.main" />
          ) : (
            <ChevronDownIcon boxSize="25px" color="primary.blue.dark.main" />
          )}
        </Flex>
      </Flex>
      <Box
        style={{ display: opened ? "" : "none" }}
        backgroundColor="neutral.100"
        borderTopWidth=".5px"
        borderTopColor="neutral.200"
        padding="10px 20px 15px 10px"
        cursor="default"
      >
        {opened && (
          <Stack spacing={3}>
            <Box pl="xs" pt="xs">
              {Object.keys(courseData).length > 0 && (
                <DraggableScheduleCourse
                  key={Object.keys(courseData)[0]}
                  scheduleCourse={{
                    ...courseData[Object.keys(courseData)[0]],
                    id: dndIdPrefix + "-" + Object.keys(courseData)[0],
                  }}
                  isInSidebar
                  // TODO: isChecked is for when the requirement is added to the plan and validated. When true, this will render a checkmark.
                  isChecked={false}
                  isDisabled={false}
                />
              )}
            </Box>
            <ClassOption type="Elective Placeholder" />
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default GenericSection;
