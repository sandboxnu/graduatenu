import {
  Box,
  Flex,
  Heading,
  Divider,
  Text,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
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
        width={{ desktop: "1036px", tablet: "590px" }}
        outline="primary.blue.light.main"
        borderWidth="1.5px"
        borderRadius="16px"
        margin="10px"
      >
        <Heading size="md" padding="32px">
          {selectedMajors.map((major) => major.split(", ")[0]).join(", ")}
        </Heading>
        <Divider marginLeft="32px" marginRight="32px" />
        <Flex marginLeft="32px" marginRight="32px">
          {/*Semesters*/}
          <Box marginTop="24px">
            <Heading size="sm" marginBottom="10px">
              Semesters:
            </Heading>
            <Flex wrap="wrap">
              {selectedSemesters.map((sem) => (
                <Text
                  padding="4px"
                  paddingBottom="2px"
                  paddingTop="2px"
                  marginRight="8px"
                  marginBottom="4px"
                  bg="lightgrey"
                  borderRadius="6px"
                >
                  {sem}
                </Text>
              ))}
            </Flex>
          </Box>

          {/*Colleges*/}
          <Box marginTop="24px">
            <Heading size="sm" marginBottom="10px">
              Colleges:{" "}
            </Heading>
            <UnorderedList>
              {selectedColleges.map((college) => (
                <ListItem>{college}</ListItem>
              ))}
            </UnorderedList>
          </Box>

          {/*Courses*/}
          <Box marginRight="8px" marginTop="24px" paddingRight="5px">
            <Heading size="sm" marginBottom="10px">
              Courses:{" "}
            </Heading>
            <UnorderedList>
              {selectedCourses.map((course) => (
                <ListItem>{course}</ListItem>
              ))}
            </UnorderedList>
          </Box>
        </Flex>
      </Box>

      {/*Analytics Part*/}
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
