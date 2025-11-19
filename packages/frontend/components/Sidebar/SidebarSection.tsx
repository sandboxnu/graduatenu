import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SmallCloseIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";

import { Box, Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import {
  CourseOverride,
  courseToString,
  ScheduleCourse2,
  Section,
} from "@graduate/common";
import { useState } from "react";
import SectionRequirement from "./SectionRequirement";
import { SidebarValidationStatus } from "./Sidebar";
import { GraduateToolTip } from "../GraduateTooltip";

interface SidebarSectionProps {
  section: Section;
  courseData: { [id: string]: ScheduleCourse2<null> };
  dndIdPrefix: string;
  validationStatus: SidebarValidationStatus;
  coursesTaken: ScheduleCourse2<unknown>[];
  loading?: boolean;
  overrides?: CourseOverride[];
  onAddOverride?: (sectionTitle: string, courseString: string) => void;
  onRemoveOverride?: (sectionTitle: string, courseString: string) => void;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({
  section,
  courseData,
  dndIdPrefix,
  validationStatus,
  loading,
  coursesTaken,
  overrides = [],
  onAddOverride,
  onRemoveOverride,
}) => {
  const [opened, setOpened] = useState(false);

  const grey = "neutral.400";
  const green = "states.success.main";

  const sectionOverrides = overrides.filter(
    (o) => o.sectionTitle === section.title
  );

  const warningLabel = section.warnings && (
    <Stack p="sm">
      <Text>
        Unfortunately, we currently have no way of verifying the following.
        Please take a closer look yourself.
      </Text>
      {section.warnings.map((warning, idx) => (
        <Text key={idx}>
          {idx + 1}. {warning}
        </Text>
      ))}
    </Stack>
  );

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
            bg={
              validationStatus === SidebarValidationStatus.Complete
                ? green
                : validationStatus === SidebarValidationStatus.Error
                ? grey
                : validationStatus === SidebarValidationStatus.InProgress
                ? "orange"
                : "transparent"
            }
            borderColor={
              validationStatus === SidebarValidationStatus.Complete
                ? green
                : validationStatus === SidebarValidationStatus.InProgress
                ? "orange"
                : grey
            }
            color={
              validationStatus === SidebarValidationStatus.Loading
                ? grey
                : "white"
            }
            borderWidth="1px"
            width="18px"
            height="18px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            transition="background 0.25s ease, color 0.25s ease, border 0.25s ease"
            transitionDelay="0.1s"
            borderRadius="2xl"
            mt="4xs"
            p="xs"
            position="relative"
          >
            {/*
              The following four icons appear and disappear based on opacity to allow for transitions (if they're conditionally rendered, then transitions can't occur).
            */}
            <CheckIcon
              position="absolute"
              opacity={
                validationStatus === SidebarValidationStatus.Complete ? 1 : 0
              }
              transition="opacity 0.25s ease"
              transitionDelay="0.1s"
              boxSize="9px"
            />
            <SmallCloseIcon
              position="absolute"
              opacity={
                validationStatus === SidebarValidationStatus.Error ? 1 : 0
              }
              transition="opacity 0.25s ease"
              transitionDelay="0.1s"
              boxSize="13px"
            />
            <Spinner
              size="xs"
              color="grey"
              position="absolute"
              opacity={
                validationStatus === SidebarValidationStatus.Loading ? 1 : 0
              }
              transition="opacity 0.25s ease"
              transitionDelay="0.1s"
            />
            <Text
              opacity={
                validationStatus === SidebarValidationStatus.InProgress ? 1 : 0
              }
              fontSize="s"
              boxSize="34px"
              color="white"
            >
              ...
            </Text>
          </Box>
          <Text color="primary.blue.dark.main" mt="0" fontSize="sm">
            {section.title}
          </Text>
        </Flex>
        <Flex ml="xs" alignItems="center">
          {section.warnings && section.warnings.length > 0 && (
            <GraduateToolTip label={warningLabel} placement="top">
              <WarningTwoIcon boxSize="15px" color="states.warning.main" />
            </GraduateToolTip>
          )}
          {opened ? (
            <ChevronUpIcon boxSize="25px" color="primary.blue.dark.main" />
          ) : (
            <ChevronDownIcon boxSize="25px" color="primary.blue.dark.main" />
          )}
        </Flex>
      </Flex>
      {opened && onAddOverride && onRemoveOverride && (
        <Box
          px="md"
          py="sm"
          backgroundColor="neutral.150"
          borderTopWidth="1px"
          borderTopColor="neutral.200"
          onClick={(e) => e.stopPropagation()}
        >
          <Text
            fontSize="xs"
            fontWeight="bold"
            mb="xs"
            color="primary.blue.dark.main"
          >
            Override this section with courses:
          </Text>
          {sectionOverrides.length > 0 && (
            <Stack spacing="xs" mb="sm">
              {sectionOverrides.map((override, idx) => (
                <Flex
                  key={idx}
                  alignItems="center"
                  p="xs"
                  backgroundColor="white"
                  borderRadius="md"
                  justifyContent="space-between"
                >
                  <SmallCloseIcon
                    cursor="pointer"
                    onClick={() =>
                      onRemoveOverride(section.title, override.courseString)
                    }
                    color="red.500"
                    _hover={{ color: "red.700" }}
                  />
                  <Text fontSize="sm" flex="1" ml="xs">
                    {override.courseString}
                  </Text>
                  <Box
                    bg={"states.success.main"}
                    borderColor={"states.success.main"}
                    color={"white"}
                    borderWidth="1px"
                    width="18px"
                    height="18px"
                    display="flex"
                    transition="background 0.25s ease, color 0.25s ease, border 0.25s ease"
                    transitionDelay="0.1s"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="2xl"
                    margin="8px"
                    p="xs"
                  >
                    <CheckIcon position="absolute" boxSize="9px" />
                  </Box>
                </Flex>
              ))}
            </Stack>
          )}

          {sectionOverrides.length < 5 && (
            <Box>
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    onAddOverride(section.title, e.target.value);
                  }
                }}
                style={{
                  width: "100%",
                  padding: "6px",
                  borderRadius: "4px",
                  border: "1px solid #CBD5E0",
                }}
              >
                <option value="">Add override course</option>
                {coursesTaken
                  .filter((c) => {
                    const courseStr = courseToString(c);
                    // don't show courses already overridden for this section
                    return !sectionOverrides.find(
                      (o) => o.courseString === courseStr
                    );
                  })
                  .map((course) => {
                    const courseStr = courseToString(course);
                    return (
                      <option key={courseStr} value={courseStr}>
                        {courseStr} - {course.name}
                      </option>
                    );
                  })}
              </select>
              <Text fontSize="xs" color="gray.600" mt="xs">
                {5 - sectionOverrides.length} override(s) remaining
              </Text>
            </Box>
          )}
        </Box>
      )}
      <Box
        style={{ display: opened ? "" : "none" }}
        backgroundColor="neutral.100"
        borderTopWidth=".5px"
        borderTopColor="neutral.200"
        padding="10px 20px 15px 10px"
        cursor="default"
      >
        {loading && (
          <Flex alignItems="center">
            <Spinner size="sm"></Spinner>
            <Text marginLeft="xs">Loading...</Text>
          </Flex>
        )}
        {opened && !loading && (
          <>
            {section.minRequirementCount < section.requirements.length && (
              <Text fontSize="sm" as="i">
                Complete {section.minRequirementCount} of the following:
              </Text>
            )}
            {section.requirements.map((requirement, index) => (
              <SectionRequirement
                requirement={requirement}
                courseData={courseData}
                dndIdPrefix={dndIdPrefix + "-" + index}
                key={index}
                coursesTaken={coursesTaken}
              />
            ))}
          </>
        )}
      </Box>
    </Box>
  );
};

export default SidebarSection;
