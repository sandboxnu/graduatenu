import { Box, Text } from "@chakra-ui/react";
import {
  MajorValidationError,
  ScheduleCourse2,
  Section,
} from "@graduate/common";
import { useState } from "react";
import SectionRequirement from "./SectionRequirement";

interface SidebarSectionProps {
  section: Section;
  courseData: { [id: string]: ScheduleCourse2<null> };
  dndIdPrefix: string;
  validationStatus?: MajorValidationError;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({
  section,
  courseData,
  dndIdPrefix,
  validationStatus,
}) => {
  const [opened, setOpened] = useState(false);

  const isComplete = validationStatus == undefined;
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
      >
        {isComplete ? (
          <span
            style={{
              background: "green",
              color: "white",
              padding: "3px 6px",
              width: "26px",
              marginRight: "6px",
              borderRadius: "30px",
            }}
          >
            ✓
          </span>
        ) : (
          ""
        )}
        {section.title}
      </Text>
      <Box
        style={{ display: opened ? "" : "none" }}
        backgroundColor="neutral.900"
        padding="10px 20px 15px 10px"
        cursor="default"
      >
        {opened &&
          section.requirements.map((requirement, index) => (
            <SectionRequirement
              requirement={requirement}
              courseData={courseData}
              dndIdPrefix={dndIdPrefix + "-" + index}
              key={index}
            />
          ))}
      </Box>
    </Box>
  );
};

export default SidebarSection;
