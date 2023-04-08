import { DeleteIcon, WarningIcon } from "@chakra-ui/icons";
import { Flex, Grid, IconButton, Text, Tooltip } from "@chakra-ui/react";
import {
  ScheduleCourse2,
  ScheduleYear2,
  SeasonEnum,
  YearError,
} from "@graduate/common";
import { ScheduleTerm } from "./ScheduleTerm";
import { useState, useEffect } from "react";
import { GraduateToolTip } from "../GraduateTooltip";
import { totalCreditsInYear } from "../../utils";

interface ToggleYearProps {
  isExpanded: boolean;
  toggleExpanded: () => void;
}

interface ScheduleYearProps extends ToggleYearProps {
  scheduleYear: ScheduleYear2<string>;
  catalogYear: number;
  yearCoReqError?: YearError;
  yearPreReqError?: YearError;

  /** Function to add classes to a given term in the plan being displayed. */
  addClassesToTermInCurrPlan: (
    classes: ScheduleCourse2<null>[],
    termYear: number,
    termSeason: SeasonEnum
  ) => void;

  /** Function to remove a course from a given term in the plan being displayed. */
  removeCourseFromTermInCurrPlan: (
    course: ScheduleCourse2<unknown>,
    termYear: number,
    termSeason: SeasonEnum
  ) => void;

  /** Function to remove the curr year from the plan */
  removeYearFromCurrPlan: () => void;
  setIsRemove?: (val: boolean) => void;
}

export const ScheduleYear: React.FC<ScheduleYearProps> = ({
  scheduleYear,
  catalogYear,
  addClassesToTermInCurrPlan,
  removeCourseFromTermInCurrPlan,
  isExpanded,
  toggleExpanded,
  removeYearFromCurrPlan,
  setIsRemove,
  yearCoReqError = undefined,
  yearPreReqError = undefined,
}) => {
  const totalCreditsThisYear = totalCreditsInYear(scheduleYear);
  const [displayReqErrors, setDisplayReqErrors] = useState(false);

  useEffect(() => {
    const classes = [];
    classes.push(...Object.values(yearPreReqError?.fall ?? {}));
    classes.push(...Object.values(yearPreReqError?.spring ?? {}));
    classes.push(...Object.values(yearPreReqError?.summer1 ?? {}));
    classes.push(...Object.values(yearPreReqError?.summer2 ?? {}));
    classes.push(...Object.values(yearCoReqError?.fall ?? {}));
    classes.push(...Object.values(yearCoReqError?.spring ?? {}));
    classes.push(...Object.values(yearCoReqError?.summer1 ?? {}));
    classes.push(...Object.values(yearCoReqError?.summer2 ?? {}));
    setDisplayReqErrors(classes.filter((c) => c != undefined).length > 0);
  }, [yearCoReqError, yearPreReqError]);

  return (
    <Flex flexDirection="column">
      <YearHeader
        year={scheduleYear}
        totalCreditsTaken={totalCreditsThisYear}
        isExpanded={isExpanded}
        toggleExpanded={toggleExpanded}
        removeYearFromCurrPlan={removeYearFromCurrPlan}
        displayReqErrors={displayReqErrors}
      />
      {isExpanded && (
        <Grid templateColumns="repeat(4, 1fr)" minHeight="220px">
          <ScheduleTerm
            yearNum={scheduleYear.year}
            catalogYear={catalogYear}
            termCoReqErr={yearCoReqError?.fall}
            termPreReqErr={yearPreReqError?.fall}
            scheduleTerm={scheduleYear.fall}
            addClassesToTermInCurrPlan={addClassesToTermInCurrPlan}
            removeCourseFromTermInCurrPlan={removeCourseFromTermInCurrPlan}
            setIsRemove={setIsRemove}
          />
          <ScheduleTerm
            yearNum={scheduleYear.year}
            catalogYear={catalogYear}
            termCoReqErr={yearCoReqError?.spring}
            termPreReqErr={yearPreReqError?.spring}
            scheduleTerm={scheduleYear.spring}
            addClassesToTermInCurrPlan={addClassesToTermInCurrPlan}
            removeCourseFromTermInCurrPlan={removeCourseFromTermInCurrPlan}
            setIsRemove={setIsRemove}
          />
          {/* TODO: support summer full term */}
          <ScheduleTerm
            catalogYear={catalogYear}
            yearNum={scheduleYear.year}
            termCoReqErr={yearCoReqError?.summer1}
            termPreReqErr={yearPreReqError?.summer1}
            scheduleTerm={scheduleYear.summer1}
            addClassesToTermInCurrPlan={addClassesToTermInCurrPlan}
            removeCourseFromTermInCurrPlan={removeCourseFromTermInCurrPlan}
            setIsRemove={setIsRemove}
          />
          <ScheduleTerm
            catalogYear={catalogYear}
            yearNum={scheduleYear.year}
            termCoReqErr={yearCoReqError?.summer2}
            termPreReqErr={yearPreReqError?.summer2}
            scheduleTerm={scheduleYear.summer2}
            addClassesToTermInCurrPlan={addClassesToTermInCurrPlan}
            removeCourseFromTermInCurrPlan={removeCourseFromTermInCurrPlan}
            setIsRemove={setIsRemove}
            isLastColumn
          />
        </Grid>
      )}
    </Flex>
  );
};

interface YearHeaderProps extends ToggleYearProps {
  year: ScheduleYear2<string>;
  displayReqErrors: boolean;
  totalCreditsTaken: number;
  removeYearFromCurrPlan: () => void;
}

/** Displays the academic year, credits taken and hide/show button for the year. */
const YearHeader: React.FC<YearHeaderProps> = ({
  year,
  totalCreditsTaken,
  isExpanded,
  toggleExpanded,
  removeYearFromCurrPlan,
  displayReqErrors,
}) => {
  const backgroundColor = isExpanded
    ? "primary.blue.dark"
    : "primary.blue.light";

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      backgroundColor={backgroundColor + ".main"}
      _hover={{
        backgroundColor: "primary.blue.light.600",
      }}
      transition="background-color 0.15s ease"
      paddingTop="sm"
      paddingBottom="sm"
      onClick={toggleExpanded}
      cursor="pointer"
      userSelect="none"
    >
      <Flex flexDirection="column" marginLeft="md">
        <Text color="white">Year {year.year}</Text>
        <Text color="white" fontWeight="bold">
          {totalCreditsTaken} credits
        </Text>
      </Flex>
      <Flex>
        {displayReqErrors && (
          <Tooltip label={`There are coreq and/or prereq errors`} fontSize="md">
            <IconButton
              aria-label="There are coreq and/or prereq errors!"
              variant="ghost"
              color="primary.red.main"
              icon={<WarningIcon />}
              _hover={{ bg: `white` }}
              _active={{}}
            />
          </Tooltip>
        )}
        <GraduateToolTip label={`Delete year ${year.year}?`}>
          <IconButton
            aria-label="Delete course"
            variant="ghost"
            color="white"
            icon={<DeleteIcon />}
            marginLeft="auto"
            marginRight="sm"
            _hover={{ bg: "white", color: "primary.red.main" }}
            _active={{ bg: `${backgroundColor}.900` }}
            onClick={(e) => {
              // important to prevent the click from propogating upwards and triggering the toggle
              e.stopPropagation();
              removeYearFromCurrPlan();
            }}
          />
        </GraduateToolTip>
      </Flex>
    </Flex>
  );
};
