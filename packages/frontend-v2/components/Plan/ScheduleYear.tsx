import {
  Button,
  Flex,
  Grid,
  GridItem,
  GridItemProps,
  Text,
} from "@chakra-ui/react";
import { ScheduleYear2 } from "@graduate/common";
import { ScheduleTerm } from "./ScheduleTerm";

interface ScheduleYearProps {
  scheduleYear: ScheduleYear2<string>;
}

export const ScheduleYear: React.FC<ScheduleYearProps> = ({ scheduleYear }) => {
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
    <Flex flexDirection="column" height="100%">
      <YearHeader
        year={scheduleYear}
        totalCreditsTaken={totalCreditsThisYear}
      />
      <Grid templateColumns="repeat(4, 1fr)" flex={1}>
        <ScheduleTerm scheduleTerm={scheduleYear.fall} />
        <ScheduleTerm scheduleTerm={scheduleYear.spring} />
        {/* TODO: support summer full term */}
        <ScheduleTerm scheduleTerm={scheduleYear.summer1} />
        <ScheduleTerm scheduleTerm={scheduleYear.summer2} isLastColumn />
      </Grid>
    </Flex>
  );
};

interface YearHeaderProps {
  year: ScheduleYear2<string>;
  totalCreditsTaken: number;
}

const YearHeader: React.FC<YearHeaderProps> = ({ year, totalCreditsTaken }) => {
  return (
    <Grid templateColumns="repeat(12, 1fr)" alignItems="center">
      <YearHeaderColumnContainer colSpan={1} justifyContent="center" mr="5xs">
        <Text fontWeight="bold" color="white">
          Year {year.year}
        </Text>
      </YearHeaderColumnContainer>
      <YearHeaderColumnContainer colSpan={10} pl="md">
        <Text color="white">{totalCreditsTaken} credits</Text>
      </YearHeaderColumnContainer>
      <YearHeaderColumnContainer colSpan={1} bg="primary.blue.dark.900">
        <Button
          variant="unstyled"
          width="100%"
          textTransform="uppercase"
          color="neutral.main"
        >
          hide
        </Button>
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
    <GridItem
      height="100%"
      bg="primary.blue.dark.main"
      display="flex"
      alignItems="center"
      {...rest}
    >
      {children}
    </GridItem>
  );
};
