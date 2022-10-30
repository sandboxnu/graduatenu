import { Box, Text } from "@chakra-ui/react";
import { ScheduleCourse2, Section } from "@graduate/common";
import { useState } from "react";
import SectionRequirement from "./SectionRequirement";

interface SidebarSectionProps {
  section: Section;
  courseData: { [id: string]: ScheduleCourse2<null> };
  dndIdPrefix: string;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({
  section,
  courseData,
  dndIdPrefix,
}) => {
  const [opened, setOpened] = useState(false);
  return (
    <Box
      backgroundColor="neutral.main"
      borderTop="1px solid white"
      cursor="pointer"
      userSelect="none"
    >
      <Text
        onClick={() => {
          setOpened(!opened);
        }}
        color="dark.main"
        fontWeight="bold"
        py="md"
        px="sm"
      >
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
