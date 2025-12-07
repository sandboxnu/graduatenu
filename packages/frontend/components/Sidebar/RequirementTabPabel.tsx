import React from "react";
import { TabPanel, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import SidebarSection from "./SidebarSection";
import { MajorValidationError } from "@graduate/common";

export type RequirementType = "major" | "minor";

/**
 * RequirementTabPanel
 *
 * Displays academic requirement details (major or minor) with navigation
 * controls for cycling through multiple requirements, section-based course
 * display, and validation status. Supports optional concentration sections for majors.
 */
interface RequirementTabPanelProps {
  requirement: {
    name: string;
    requirementSections: any[];
  };
  currentIndex: number;
  totalCount: number;
  onPrevious: () => void;
  onNext: () => void;
  courseData: any;
  dndIdPrefix: string;
  isCoursesLoading: boolean;
  coursesTaken: any[];
  validationStatus: any;
  getSectionError: (
    requirementType: RequirementType,
    sectionIndex: number,
    status: any
  ) => MajorValidationError | undefined;
  getSidebarValidationStatus: (error?: MajorValidationError) => any;
  requirementType: RequirementType;
  concentration?: any;
  concentrationValidationStatus?: any;
  isSharedPlan?: boolean;
}

export const RequirementTabPanel: React.FC<RequirementTabPanelProps> = ({
  requirement,
  currentIndex,
  totalCount,
  onPrevious,
  onNext,
  courseData,
  dndIdPrefix,
  isCoursesLoading,
  coursesTaken,
  validationStatus,
  getSectionError,
  getSidebarValidationStatus,
  requirementType,
  concentration,
  concentrationValidationStatus,
  isSharedPlan,
}) => {
  const label = requirementType === "major" ? "Major" : "Minor";

  return (
    <TabPanel width="100%" p={0} m={0}>
      <Flex
        align="center"
        justify="space-between"
        px={4}
        py={3}
        bg="blue.50"
        borderBottom="1px solid"
        borderColor="neutral.200"
      >
        <IconButton
          aria-label={`Previous ${label.toLowerCase()}`}
          icon={<ChevronLeftIcon />}
          size="sm"
          onClick={onPrevious}
          isDisabled={totalCount <= 1}
          variant="ghost"
          colorScheme="blue"
        />
        <Heading
          fontSize="md"
          fontWeight="semibold"
          color="primary.blue.dark.main"
          textAlign="center"
          flex="1"
        >
          {requirement.name}
          {totalCount > 1 && (
            <Text as="span" fontSize="sm" color="gray.600" ml={2}>
              ({currentIndex + 1}/{totalCount})
            </Text>
          )}
        </Heading>
        <IconButton
          aria-label={`Next ${label.toLowerCase()}`}
          icon={<ChevronRightIcon />}
          size="sm"
          onClick={onNext}
          isDisabled={totalCount <= 1}
          variant="ghost"
          colorScheme="blue"
        />
      </Flex>

      {requirementType === "minor" && (
        <Flex>
          <Heading color="primary.blue.dark.main" fontSize="md" py={4} px={4}>
            {label} Requirements
          </Heading>
        </Flex>
      )}

      {requirement.requirementSections.map((section, index) => {
        const sectionValidationError = getSectionError(
          requirementType,
          index,
          validationStatus
        );
        const sectionValidationStatus = getSidebarValidationStatus(
          sectionValidationError
        );

        return (
          <SidebarSection
            key={section.title || index}
            section={section}
            validationStatus={sectionValidationStatus}
            courseData={courseData}
            dndIdPrefix={`${dndIdPrefix}-${index}`}
            loading={isCoursesLoading}
            coursesTaken={coursesTaken}
          />
        );
      })}

      {concentration && (
        <SidebarSection
          validationStatus={concentrationValidationStatus}
          section={concentration}
          courseData={courseData}
          dndIdPrefix={`${dndIdPrefix}-concentration`}
          loading={isCoursesLoading}
          coursesTaken={coursesTaken}
        />
      )}
    </TabPanel>
  );
};
