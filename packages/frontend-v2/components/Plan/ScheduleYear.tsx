import { DeleteIcon } from "@chakra-ui/icons";
import {
  Flex,
  Grid,
  GridItem,
  GridItemProps,
  IconButton,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { ScheduleCourse2, ScheduleYear2, SeasonEnum } from "@graduate/common";
import { ScheduleTerm } from "./ScheduleTerm";

interface ToggleYearProps {
  isExpanded: boolean;
  toggleExpanded: () => void;
}

interface ScheduleYearProps extends ToggleYearProps {
  scheduleYear: ScheduleYear2<string>;

  /** Function to check if the given cousrs exists in the plan being displayed. */
  isCourseInCurrPlan: (course: ScheduleCourse2<unknown>) => boolean;

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
}

export const ScheduleYear: React.FC<ScheduleYearProps> = ({
  scheduleYear,
  isCourseInCurrPlan,
  addClassesToTermInCurrPlan,
  removeCourseFromTermInCurrPlan,
  isExpanded,
  toggleExpanded,
  removeYearFromCurrPlan,
}) => {
  // sum all credits over all the courses over each semester
  const totalCreditsThisYear = [
    scheduleYear.fall,
    scheduleYear.spring,
    scheduleYear.summer1,
    scheduleYear.summer2,
  ].reduce((totalCreditsForYear, term) => {
    // sum all credits over all courses
    const totalCreditsThisTerm = term.classes.reduce(
      (totalCreditsForTerm, course) => {
        return totalCreditsForTerm + course.numCreditsMin;
      },
      0
    );

    return totalCreditsForYear + totalCreditsThisTerm;
  }, 0);

  return (
    <Flex flexDirection="column" height="100%" minHeight="inherit">
      <YearHeader
        year={scheduleYear}
        totalCreditsTaken={totalCreditsThisYear}
        isExpanded={isExpanded}
        toggleExpanded={toggleExpanded}
        removeYearFromCurrPlan={removeYearFromCurrPlan}
      />
      {isExpanded && (
        <Grid templateColumns="repeat(4, 1fr)" flex={1}>
          <ScheduleTerm
            scheduleTerm={scheduleYear.fall}
            isCourseInCurrPlan={isCourseInCurrPlan}
            addClassesToTermInCurrPlan={addClassesToTermInCurrPlan}
            removeCourseFromTermInCurrPlan={removeCourseFromTermInCurrPlan}
          />
          <ScheduleTerm
            scheduleTerm={scheduleYear.spring}
            isCourseInCurrPlan={isCourseInCurrPlan}
            addClassesToTermInCurrPlan={addClassesToTermInCurrPlan}
            removeCourseFromTermInCurrPlan={removeCourseFromTermInCurrPlan}
          />
          {/* TODO: support summer full term */}
          <ScheduleTerm
            scheduleTerm={scheduleYear.summer1}
            isCourseInCurrPlan={isCourseInCurrPlan}
            addClassesToTermInCurrPlan={addClassesToTermInCurrPlan}
            removeCourseFromTermInCurrPlan={removeCourseFromTermInCurrPlan}
          />
          <ScheduleTerm
            scheduleTerm={scheduleYear.summer2}
            isCourseInCurrPlan={isCourseInCurrPlan}
            addClassesToTermInCurrPlan={addClassesToTermInCurrPlan}
            removeCourseFromTermInCurrPlan={removeCourseFromTermInCurrPlan}
            isLastColumn
          />
        </Grid>
      )}
    </Flex>
  );
};

interface YearHeaderProps extends ToggleYearProps {
  year: ScheduleYear2<string>;
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
}) => {
  const backgroundColor = isExpanded
    ? "primary.blue.dark"
    : "primary.blue.light";

  const hoverBackgrounColor = isExpanded
    ? "primary.blue.dark.700"
    : "primary.blue.light.700";

  return (
    <Flex
      alignItems="center"
      backgroundColor={backgroundColor + ".main"}
      paddingTop="sm"
      paddingBottom="sm"
    >
      <Flex flexDirection="column" marginLeft="md">
        <Text color="white">Year {year.year}</Text>
        <Text color="white" fontWeight="bold">
          {totalCreditsTaken} credits
        </Text>
      </Flex>
      {/* <YearHeaderColumnContainer
        colSpan={1}
        justifyContent="center"
        mr="5xs"
        bg={`${backgroundColor}.main`}
        _groupHover={{ backgroundColor: hoverBackgrounColor }}
      >
        
      </YearHeaderColumnContainer> */}
      <YearHeaderColumnContainer
        colSpan={10}
        pl="md"
        bg={`${backgroundColor}.main`}
        _groupHover={{ backgroundColor: hoverBackgrounColor }}
      >
        <Text color="white">{totalCreditsTaken} credits</Text>
      </YearHeaderColumnContainer>
      <YearHeaderColumnContainer
        colSpan={1}
        justifyContent="right"
        bg={`${backgroundColor}.main`}
        _groupHover={{ backgroundColor: hoverBackgrounColor }}
      >
        <Tooltip label={`Delete year ${year.year}?`} fontSize="md">
          <IconButton
            aria-label="Delete course"
            variant="ghost"
            color="primary.red.main"
            icon={<DeleteIcon />}
            _hover={{ bg: `${backgroundColor}.900` }}
            _active={{ bg: `${backgroundColor}.900` }}
            onClick={(e) => {
              // important to prevent the click from propogating upwards and triggering the toggle
              e.stopPropagation();
              removeYearFromCurrPlan();
            }}
          />
        </Tooltip>
      </YearHeaderColumnContainer>
    </Flex>
  );
};

/** A GridItem container for the columns in a year header */
const YearHeaderColumnContainer: React.FC<GridItemProps> = ({
  children,
  ...rest
}) => {
  return (
    <GridItem height="100%" display="flex" alignItems="center" {...rest}>
      {children}
    </GridItem>
  );
};
