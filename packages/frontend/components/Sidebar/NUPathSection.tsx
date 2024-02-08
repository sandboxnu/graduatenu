import { NUPathEnum, ScheduleCourse2 } from "@graduate/common";
import { SidebarValidationStatus } from "./Sidebar";
import { useState } from "react";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { HelperToolTip } from "../Help";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SmallCloseIcon,
} from "@chakra-ui/icons";

interface NUPathSectionProps {
  coursesTaken: ScheduleCourse2<unknown>[];
  dndIdPrefix: string;
  loading?: boolean;
}
const nuPathDisplayAndAbbr: [
  nupath: string,
  displayName: string,
  abbreviation: string
][] = [
  [NUPathEnum.ND, "Natural and Designed World", "ND"],
  [NUPathEnum.EI, "Creative Expression/Innovation", "EI"],
  [NUPathEnum.IC, "Interpreting Culture", "IC"],
  [NUPathEnum.FQ, "Formal and Quantitative Reasoning", "FQ"],
  [NUPathEnum.SI, "Societies and Institutions", "SI"],
  [NUPathEnum.AD, "Analyzing/Using Data", "AD"],
  [NUPathEnum.DD, "Difference and Diversity", "DD"],
  [NUPathEnum.ER, "Ethical Reasoning", "ER"],
  [NUPathEnum.WF, "First Year Writing", "WF"],
  [NUPathEnum.WD, "Advanced Writing in the Disciplines", "WD"],
  [NUPathEnum.WI, "Writing Intensive", "WI"],
  [NUPathEnum.EX, "Integration Experience", "EX"],
  [NUPathEnum.CE, "Capstone Experience", "CE"],
];
const grey = "neutral.400";
const green = "states.success.main";

const NUPathSection: React.FC<NUPathSectionProps> = ({
  coursesTaken,
  dndIdPrefix,
  loading,
}) => {
  const [opened, setOpened] = useState(false);

  let validationStatus = SidebarValidationStatus.Error;

  const nupathMap: Record<string, number> = {};

  for (const course of coursesTaken) {
    if (!course.nupaths) {
      continue;
    }

    for (const nupath of course.nupaths) {
      nupathMap[nupath] = (nupathMap[nupath] || 0) + 1;
    }
  }

  const wiCount = nupathMap[NUPathEnum.WI];

  if (loading) {
    validationStatus = SidebarValidationStatus.Loading;
  } else if (Object.keys(nupathMap).length === 13 && wiCount && wiCount >= 2) {
    // Sidebar is complete if all 13 nupaths have been fulfilled (including 2 writing intensives)
    validationStatus = SidebarValidationStatus.Complete;
  }

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
            transitionDelay="0.1s"
            alignItems="center"
            justifyContent="center"
            borderRadius="2xl"
            mt="4xs"
            p="xs"
          >
            {/*
              The following three icons appear and disappear based on opacity to allow for transitions (if they're conditionally rendered, then transitions can't occur).
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
          </Box>
          <Text color="primary.blue.dark.main" mt="0" fontSize="sm">
            NUpath Requirements
          </Text>
        </Flex>
        <Flex ml="xs" alignItems="center">
          {opened ? (
            <ChevronUpIcon boxSize="25px" color="primary.blue.dark.main" />
          ) : (
            <ChevronDownIcon boxSize="25px" color="primary.blue.dark.main" />
          )}
        </Flex>
      </Flex>
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
          <Box id={dndIdPrefix} pl="xs" pt="xs">
            <Text fontSize="sm" as="i">
              Complete the following NUpath requirements.
            </Text>
            <>
              {nuPathDisplayAndAbbr.map(
                ([nupath, displayName, abbreviation], idx) => {
                  const numTaken = nupathMap[nupath] || 0;
                  return (
                    <NUPathRequirement
                      key={idx}
                      nupath={nupath}
                      abbreviation={abbreviation}
                      displayName={displayName}
                      numTaken={numTaken}
                    />
                  );
                }
              )}
            </>
          </Box>
        )}
      </Box>
    </Box>
  );
};

interface NUPathRequirementProps {
  nupath: string;
  abbreviation: string;
  displayName: string;
  numTaken: number;
}

const NUPathRequirement: React.FC<NUPathRequirementProps> = ({
  nupath,
  abbreviation,
  displayName,
  numTaken,
}) => {
  const isWI = nupath === NUPathEnum.WI;
  const isSatisfied = (isWI && numTaken >= 2) || (!isWI && numTaken >= 1);

  return (
    <Flex my="xs" ml="xs" columnGap="xs">
      <Box
        bg={isSatisfied ? green : grey}
        borderColor={isSatisfied ? green : grey}
        color={isSatisfied ? grey : "white"}
        borderWidth="1px"
        width="18px"
        height="18px"
        display="flex"
        position="relative"
        transition="background 0.25s ease, color 0.25s ease, border 0.25s ease"
        transitionDelay="0.1s"
        alignItems="center"
        justifyContent="center"
        borderRadius="2xl"
        mt="4xs"
        p="xs"
      >
        <CheckIcon
          color="white"
          position="absolute"
          opacity={isSatisfied ? 1 : 0}
          transition="opacity 0.25s ease"
          transitionDelay="0.1s"
          boxSize="9px"
        />
        <SmallCloseIcon
          position="absolute"
          opacity={!isSatisfied ? 1 : 0}
          transition="opacity 0.25s ease"
          transitionDelay="0.1s"
          boxSize="13px"
        />
      </Box>
      <Flex alignItems="center" columnGap="3xs">
        <Text fontSize="sm" as="b">
          {abbreviation}
        </Text>
        <Text fontSize="sm" mr="4xs">
          {displayName}
        </Text>
        {isWI && <HelperToolTip label="Complete 2 Writing Intensive courses" />}
      </Flex>
    </Flex>
  );
};

export default NUPathSection;
