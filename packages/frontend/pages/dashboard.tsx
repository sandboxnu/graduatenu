import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import { NextPage } from "next";
import { PropsWithChildren, useContext, useState } from "react";
import { GraduatePostAuthHeader, GraduatePreAuthHeader } from "../components";
import { IsGuestContext } from "./_app";
import { DELETE_COURSE_AREA_DND_ID } from "../utils";
import { DashboardSidebar } from "../components/DashboardSidebar";

const DashboardPage: NextPage = () => {
  const [selectedSemesters, setSelectedSemesters] = useState<string[]>([]);
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectedColleges, setSelectedColleges] = useState<string[]>([]);

  console.log("DashboardPage render - selectedMajors:", selectedMajors);

  return (
    <PageLayout>
      <Box
        bg="neutral.100"
        overflowY="auto"
        width={{ desktop: "360px", tablet: "300px" }}
        flexShrink={0}
      >
        <DashboardSidebar
          selectedSemesters={selectedSemesters}
          setSelectedSemesters={setSelectedSemesters}
          selectedMajors={selectedMajors}
          setSelectedMajors={setSelectedMajors}
          selectedCourses={selectedCourses}
          setSelectedCourses={setSelectedCourses}
          selectedColleges={selectedColleges}
          setSelectedColleges={setSelectedColleges}
        />
      </Box>

      <Box
        overflowY="auto"
        width={{ desktop: "1036px", tablet: "590px" }}
        outline="primary.blue.light.main"
        borderWidth="1.5px"
        borderRadius="16px"
        margin="20px"
      >
        <Heading size="md" padding="32px">
          {selectedMajors.map((major) => major.split(", ")[0]).join(", ")}
        </Heading>
      </Box>
    </PageLayout>
  );
};

/** Basic Layout(i.e: header, sidebar, etc). */
const PageLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { setNodeRef } = useDroppable({ id: DELETE_COURSE_AREA_DND_ID });
  const { isGuest } = useContext(IsGuestContext);
  return (
    <Flex
      flexDirection="column"
      height="100vh"
      overflow="hidden"
      ref={setNodeRef}
    >
      {isGuest ? (
        <GraduatePreAuthHeader hasWhatsNew={false} />
      ) : (
        <GraduatePostAuthHeader hasWhatsNew={false} />
      )}
      <Flex height="100%" overflow="hidden">
        {children}
      </Flex>
    </Flex>
  );
};

export default DashboardPage;
