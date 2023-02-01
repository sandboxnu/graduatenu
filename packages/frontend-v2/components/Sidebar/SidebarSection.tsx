import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { ScheduleCourse2, Section } from "@graduate/common";
import { useState } from "react";
import SectionRequirement from "./SectionRequirement";
import { SidebarValidationStatus } from "./Sidebar";

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

  const grey = "neutral.400"
  const green = "states.success.900"

  return (
    <Box borderTop="1px solid white" cursor="pointer" userSelect="none">
      <Text
        onClick={() => {
          setOpened(!opened);
        }}
        color="dark.main"
        fontWeight="bold"
        py="md"
        px="sm"
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
        boxShadow="0px 5px 10px -6px #00000099"
      >
        <Box
          bg={validationStatus === SidebarValidationStatus.Complete ? green : 
            validationStatus === SidebarValidationStatus.Error ? grey : "transparent"}
          borderWidth="1px"
          borderColor={validationStatus === SidebarValidationStatus.Complete ? green : grey}
          color={validationStatus === SidebarValidationStatus.Loading ? grey : "white"}
          padding="sm md"
          width="26px"
          height="26px"
          display="flex"
          transition="background 0.25s ease, color 0.25s ease, border 0.25s ease"
          alignItems="center"
          justifyContent="center"
          marginRight="8px"
          borderRadius="8px"
          >
            <Text 
              position="absolute" 
              opacity={validationStatus === SidebarValidationStatus.Complete ? 1 : 0} transition="opacity 0.25s ease">✓</Text>
            <Text 
              position="absolute" 
              opacity={validationStatus === SidebarValidationStatus.Error ? 1 : 0} transition="opacity 0.25s ease">X</Text>
            <Spinner 
              size="xs" 
              color="grey" 
              position="absolute" 
              opacity={validationStatus === SidebarValidationStatus.Loading ? 1 : 0} transition="opacity 0.25s ease"/>
            </Box>
        {section.title}
      </Text>
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
