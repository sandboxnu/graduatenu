import {
  Button,
  Flex,
  Grid,
  GridItem,
  GridItemProps,
  Text,
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
}

export const ScheduleYear: React.FC<ScheduleYearProps> = ({
  scheduleYear,
  isCourseInCurrPlan,
  addClassesToTermInCurrPlan,
  isExpanded,
  toggleExpanded,
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
      />
      {isExpanded && (
        <Grid templateColumns="repeat(4, 1fr)" flex={1}>
          <ScheduleTerm
            scheduleTerm={scheduleYear.fall}
            isCourseInCurrPlan={isCourseInCurrPlan}
            addClassesToTermInCurrPlan={addClassesToTermInCurrPlan}
          />
          <ScheduleTerm
            scheduleTerm={scheduleYear.spring}
            isCourseInCurrPlan={isCourseInCurrPlan}
            addClassesToTermInCurrPlan={addClassesToTermInCurrPlan}
          />
          {/* TODO: support summer full term */}
          <ScheduleTerm
            scheduleTerm={scheduleYear.summer1}
            isCourseInCurrPlan={isCourseInCurrPlan}
            addClassesToTermInCurrPlan={addClassesToTermInCurrPlan}
          />
          <ScheduleTerm
            scheduleTerm={scheduleYear.summer2}
            isCourseInCurrPlan={isCourseInCurrPlan}
            addClassesToTermInCurrPlan={addClassesToTermInCurrPlan}
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
}

/** Displays the academic year, credits taken and hide/show button for the year. */
const YearHeader: React.FC<YearHeaderProps> = ({
  year,
  totalCreditsTaken,
  isExpanded,
  toggleExpanded,
}) => {
  const backgroundColor = isExpanded
    ? "primary.blue.dark"
    : "primary.blue.light";

  return (
    <Grid templateColumns="repeat(12, 1fr)" alignItems="center">
      <YearHeaderColumnContainer
        colSpan={1}
        justifyContent="center"
        mr="5xs"
        bg={`${backgroundColor}.main`}
      >
        <Text fontWeight="bold" color="white">
          Year {year.year}
        </Text>
      </YearHeaderColumnContainer>
      <YearHeaderColumnContainer
        colSpan={10}
        pl="md"
        bg={`${backgroundColor}.main`}
      >
        <Text color="white">{totalCreditsTaken} credits</Text>
      </YearHeaderColumnContainer>
      <YearHeaderColumnContainer colSpan={1} bg={`${backgroundColor}.700`}>
        <ToggleExpandedYearButton
          backgroundColor={backgroundColor}
          isExpanded={isExpanded}
          toggleExpanded={toggleExpanded}
        />
      </YearHeaderColumnContainer>
    </Grid>
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

interface ToggleExpandedYearButtonProps extends ToggleYearProps {
  backgroundColor: string;
}

const ToggleExpandedYearButton: React.FC<ToggleExpandedYearButtonProps> = ({
  backgroundColor,
  isExpanded,
  toggleExpanded,
}) => {
  return (
    <Button
      variant="unstyled"
      width="100%"
      textTransform="uppercase"
      color="neutral.main"
      onClick={toggleExpanded}
      _hover={{ bg: `${backgroundColor}.900` }}
      _active={{ bg: `${backgroundColor}.900` }}
    >
      {isExpanded ? "hide" : "show"}
    </Button>
  );
};
