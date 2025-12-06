import { Box, Button, Checkbox, Flex, Grid, Heading } from "@chakra-ui/react";
import { ScheduleCourse2 } from "@graduate/common";
import { memo, useState } from "react";
import { extractSupportedMajorOptions } from "../../utils";
import { SIDEBAR_DND_ID_PREFIX } from "../../utils";
import { useSearchCourses, useSupportedMajors } from "../../hooks";
import { NUPathEnum } from "@graduate/common";
import SidebarContainer from "../Sidebar/SidebarContainer";
import DashboardSidebarContainer from "./DashboardSidebarContainer";
import { MultipleSelectDropdown } from "./MultipleSelectedDropdown";

export enum SidebarValidationStatus {
  Loading = "Loading",
  Error = "Error",
  Complete = "Complete",
  InProgress = "InProgress",
}

export const COOP_BLOCK: ScheduleCourse2<string> = {
  name: "Co-op Education",
  classId: "Experiential Learning",
  subject: "",
  numCreditsMax: 8,
  numCreditsMin: 0,
  id: `${SIDEBAR_DND_ID_PREFIX}-co-op-block"`,
  nupaths: [NUPathEnum.EX],
};

interface DashboardSidebarProps {
  selectedSemesters: string[];
  setSelectedSemesters: React.Dispatch<React.SetStateAction<string[]>>;
  selectedMajors: string[];
  setSelectedMajors: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCourses: string[];
  setSelectedCourses: React.Dispatch<React.SetStateAction<string[]>>;
  selectedColleges: string[];
  setSelectedColleges: React.Dispatch<React.SetStateAction<string[]>>;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  selectedSemesters,
  setSelectedSemesters,
  selectedMajors,
  setSelectedMajors,
  selectedCourses,
  setSelectedCourses,
  selectedColleges,
  setSelectedColleges,
}) => {
  const { supportedMajorsData } = useSupportedMajors();
  const majors = extractSupportedMajorOptions(2022, supportedMajorsData).map(
    (major) => major.label.toString()
  );

  const { courses } = useSearchCourses("");

  const colleges = [
    "Bouve College of Health Science",
    "College of Arts, Media and Design",
    "College of Engineering",
    "College of Science",
    "College of Social Sciences and Humanities",
    "D'Amore-McKim School of Business",
    "Khoury College of Computer Sciences",
  ];

  const handleCheckboxChange = (value: string) => {
    setSelectedSemesters((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  return (
    <DashboardSidebarContainer
      title={"Filters"}
      subtitle={
        "Use these filters to see how different student groups are planning their courses"
      }
    >
      <Box
        borderTopWidth="3px"
        borderTopColor="neutral.200"
        cursor="pointer"
        userSelect="none"
        display="flex"
        backgroundColor="neutral.50"
        flex={1}
        padding="18px"
      >
        <Flex direction="column" flex={1}>
          <Heading
            as="h2"
            fontSize="xl"
            color="primary.blue.dark.main"
            fontWeight="semibold"
          >
            College
          </Heading>
          <MultipleSelectDropdown
            selected={selectedColleges}
            setSelected={setSelectedColleges}
            options={colleges}
            placeholder={"Select Colleges"}
          />

          <Heading
            as="h2"
            fontSize="xl"
            color="primary.blue.dark.main"
            fontWeight="semibold"
          >
            Semester
          </Heading>
          <>
            <Grid templateColumns="repeat(2, 1fr)" gap={3} marginY="10px">
              <Checkbox
                isChecked={selectedSemesters.includes("Fall")}
                onChange={() => handleCheckboxChange("Fall")}
                sx={{
                  "& .chakra-checkbox__control": {
                    borderRadius: "md",
                    borderWidth: "1px",
                    borderColor: "neutral.300",
                    _checked: {
                      bg: "primary.blue.dark.main",
                      borderColor: "primary.blue.dark.main",
                      color: "primary.blue.dark.main",
                      "& svg": {
                        display: "none",
                      },
                    },
                  },
                }}
              >
                Fall
              </Checkbox>

              <Checkbox
                isChecked={selectedSemesters.includes("Spring")}
                onChange={() => handleCheckboxChange("Spring")}
                sx={{
                  "& .chakra-checkbox__control": {
                    borderRadius: "md",
                    borderWidth: "1px",
                    borderColor: "neutral.300",
                    _checked: {
                      bg: "primary.blue.dark.main",
                      borderColor: "primary.blue.dark.main",
                      color: "primary.blue.dark.main",
                      "& svg": {
                        display: "none", // Hide the checkmark
                      },
                    },
                  },
                }}
              >
                Spring
              </Checkbox>

              <Checkbox
                isChecked={selectedSemesters.includes("Summer I")}
                onChange={() => handleCheckboxChange("Summer I")}
                sx={{
                  "& .chakra-checkbox__control": {
                    borderRadius: "md",
                    borderWidth: "1px",
                    borderColor: "neutral.300",
                    _checked: {
                      bg: "primary.blue.dark.main",
                      borderColor: "primary.blue.dark.main",
                      color: "primary.blue.dark.main",
                      "& svg": {
                        display: "none", // Hide the checkmark
                      },
                    },
                  },
                }}
              >
                Summer I
              </Checkbox>

              <Checkbox
                isChecked={selectedSemesters.includes("Summer II")}
                onChange={() => handleCheckboxChange("Summer II")}
                sx={{
                  "& .chakra-checkbox__control": {
                    borderRadius: "md",
                    borderWidth: "1px",
                    borderColor: "neutral.300",
                    _checked: {
                      bg: "primary.blue.dark.main",
                      borderColor: "primary.blue.dark.main",
                      color: "primary.blue.dark.main",
                      "& svg": {
                        display: "none", // Hide the checkmark
                      },
                    },
                  },
                }}
              >
                Summer II
              </Checkbox>
            </Grid>
          </>
          <Heading
            as="h2"
            fontSize="xl"
            color="primary.blue.dark.main"
            fontWeight="semibold"
          >
            Major
          </Heading>
          <MultipleSelectDropdown
            selected={selectedMajors}
            setSelected={setSelectedMajors}
            options={majors}
            placeholder={"Select Majors"}
          />

          <Heading
            as="h2"
            fontSize="xl"
            color="primary.blue.dark.main"
            fontWeight="semibold"
          >
            Course
          </Heading>
          <MultipleSelectDropdown
            selected={selectedCourses}
            setSelected={setSelectedCourses}
            options={
              courses?.map(
                (course) =>
                  course.subject + " " + course.classId + " - " + course.name
              ) ?? []
            }
            placeholder={"Select Courses"}
          />

          <Button
            variant="solid"
            borderRadius="md"
            width="300px"
            colorScheme="red"
          >
            Apply Filters
          </Button>
        </Flex>
      </Box>
    </DashboardSidebarContainer>
  );
};

export const NoPlanSidebar: React.FC = () => {
  return <SidebarContainer title="No Plan Selected" />;
};

// We need to manually set the display name like this because
// of how we're using memo above.
DashboardSidebar.displayName = "DashboardSidebar";

export { DashboardSidebar };
