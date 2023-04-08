import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SmallCloseIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";
import { Box, Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import { ScheduleCourse2, Section } from "@graduate/common";
import { useState } from "react";
import SectionRequirement from "./SectionRequirement";
import { SidebarValidationStatus } from "./Sidebar";
import { GraduateToolTip } from "../GraduateTooltip";

interface SidebarSectionProps {
  section: Section;
  courseData: { [id: string]: ScheduleCourse2<null> };
  dndIdPrefix: string;
  validationStatus: SidebarValidationStatus;
  loading?: boolean;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({
  section,
  courseData,
  dndIdPrefix,
  validationStatus,
  loading,
}) => {
  const [opened, setOpened] = useState(false);

  const grey = "neutral.400";
  const green = "states.success.main";

  const warningLabel = section.warnings && (
    <Stack>
      <Text>
        Unfortunately we currently have no way of verifying the following.
        Please ensure that you have a closer look yourself.
      </Text>
      {section.warnings.map((warning, idx) => (
        <Text>
          {idx + 1}. {warning}
        </Text>
      ))}
    </Stack>
  );

  return (
    <Box
      borderTopWidth="1px"
      borderTopColor="neutral.900"
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
        backgroundColor="neutral.main"
        transition="background-color 0.1s ease"
        _hover={{
          backgroundColor: "neutral.900",
        }}
        _active={{
          backgroundColor: "neutral.200",
        }}
        display="flex"
        position="sticky"
        top="0px"
        zIndex={1}
      >
        <Flex direction="row">
          <Box
            bg={
              validationStatus === SidebarValidationStatus.Complete
                ? green
                : validationStatus === SidebarValidationStatus.Error
                ? grey
                : "transparent"
            }
            borderColor={
              validationStatus === SidebarValidationStatus.Complete
                ? green
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
            transition="background 0.25s ease, color 0.25s ease, border 0.25s ease"
            alignItems="center"
            justifyContent="center"
            marginRight="sm"
            borderRadius="2xl"
            mt="4xs"
          >
            {validationStatus === SidebarValidationStatus.Complete && (
              <CheckIcon
                position="absolute"
                transition="opacity 0.25s ease"
                boxSize="9px"
              />
            )}
            {validationStatus === SidebarValidationStatus.Error && (
              <SmallCloseIcon
                position="absolute"
                transition="opacity 0.25s ease"
                boxSize="13px"
              />
            )}
            {validationStatus === SidebarValidationStatus.Loading && (
              <Spinner
                size="xs"
                color="grey"
                position="absolute"
                transition="opacity 0.25s ease"
              />
            )}
          </Box>
          <Text color="primary.blue.dark.main" mt="0" fontSize="sm">
            {section.title}
          </Text>
        </Flex>
        <Flex ml="xs" alignItems="center">
          {section.warnings && (
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
      <Box
        style={{ display: opened ? "" : "none" }}
        backgroundColor="neutral.900"
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
              <Text>
                Complete {section.minRequirementCount} of the following
              </Text>
            )}
            {section.requirements.map((requirement, index) => (
              <SectionRequirement
                requirement={requirement}
                courseData={courseData}
                dndIdPrefix={dndIdPrefix + "-" + index}
                key={index}
              />
            ))}
          </>
        )}
      </Box>
    </Box>
  );
};

export default SidebarSection;
