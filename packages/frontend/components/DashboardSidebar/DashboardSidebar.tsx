import {
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import {
  MajorValidationError,
  MajorValidationResult,
  PlanModel,
  ScheduleCourse2,
} from "@graduate/common";
import { memo, useEffect, useRef, useState } from "react";
import {
  getAllCoursesFromPlan,
  getSectionError,
  getAllCoursesInMajor,
  getAllCoursesInMinor,
  UNDECIDED_CONCENTRATION,
  UNDECIDED_STRING,
} from "../../utils";
import {
  handleApiClientError,
  SIDEBAR_DND_ID_PREFIX,
  totalCreditsInSchedule,
} from "../../utils";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import {
  WorkerMessage,
  WorkerMessageType,
  WorkerPostInfo,
} from "../../validation-worker/worker-messages";
import { useFetchCourses, useMajor, useMinor } from "../../hooks";
import { NUPathEnum } from "@graduate/common";
import SidebarContainer from "../Sidebar/SidebarContainer";
import GenericSection from "../Sidebar/GenericSection";
import NUPathSection from "../Sidebar/NUPathSection";
import DashboardSidebarContainer from "./DashboardSidebarContainer";

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

const DashboardSidebar: React.FC = memo(() => {
  const router = useRouter();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleCheckboxChange = (value: string) => {
    setSelectedFilters((prev) =>
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
                isChecked={selectedFilters.includes("Fall")}
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
                isChecked={selectedFilters.includes("Spring")}
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
                isChecked={selectedFilters.includes("Summer I")}
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
                isChecked={selectedFilters.includes("Summer II")}
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
          <Heading
            as="h2"
            fontSize="xl"
            color="primary.blue.dark.main"
            fontWeight="semibold"
          >
            Course
          </Heading>
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
});

export const NoPlanSidebar: React.FC = () => {
  return <SidebarContainer title="No Plan Selected" />;
};

// We need to manually set the display name like this because
// of how we're using memo above.
DashboardSidebar.displayName = "DashboardSidebar";

export { DashboardSidebar };
