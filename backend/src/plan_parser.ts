import { load } from "cheerio";
import {
  Schedule,
  ScheduleYear,
  ScheduleCourse,
  ScheduleTerm,
  Season,
  Status,
} from "./types";

/**
 * Produces the {@interface Schedule}s for a given plan of study for a major.
 * @param link the link to the plan of study to download.
 */
export function planOfStudyToSchedule(planofstudy: string): Schedule[] {
  const $ = load(planofstudy);

  // the list of found schedules.
  const schedules: Schedule[] = [];

  // for each of the plans, produce a schedule.
  $(".sc_plangrid tbody").each((planIndex, table) => {
    schedules.push(buildSchedule($, table));
  });

  return schedules;
}

/**
 * Builds a schedule from the table information.
 * @param $ the page
 * @param table the table of stuff to build the schedule from
 */
function buildSchedule($: CheerioStatic, table: CheerioElement): Schedule {
  // what year we're on
  const years: ScheduleYear[] = [];

  // information for the current year we're parsing
  const fall: ScheduleCourse[] | Status.COOP | Status.INACTIVE = [];
  const spring: ScheduleCourse[] | Status.COOP | Status.INACTIVE = [];
  const summer1: ScheduleCourse[] | Status.COOP | Status.INACTIVE = [];
  const summer2: ScheduleCourse[] | Status.COOP | Status.INACTIVE = [];

  let totalCredits = "";

  // table elements
  const tableRows: CheerioElement[] = [];
  $(table)
    .find("tr")
    .each((index, tableRow) => {
      // track the table number.
      const rowClassName = $(tableRow).attr("class");

      // todo: for some reason there are also row elements that aren't even/odd/plangridsum/term/year? figure it out.
      if (/^odd/.test(rowClassName) || /^even/.test(rowClassName)) {
        // iterate through the values of the row.
        const tableCells: CheerioElement[] = [];
        $(tableRow)
          .find("td")
          .each((index, el) => {
            tableCells.push(el);
          });

        // is a mutator
        addCourses($, tableCells, fall, spring, summer1, summer2);
      } else if (/^plangridsum/.test(rowClassName)) {
        // make a new year with the existing data
        years.push(
          buildYear(tableRow.childNodes, fall, spring, summer1, summer2)
        );
      } else if (/^plangridtotal/.test(rowClassName)) {
        totalCredits = $(tableRow)
          .find("td")
          .text();
      }
    });

  // for each of the rows, do something.
  for (const tableRow of tableRows) {
  }

  // build the schedule, and return.
  return buildScheduleFromYears(years, totalCredits);
}

/**
 *
 * @param years
 * @param totalCredits
 */
function buildScheduleFromYears(
  years: ScheduleYear[],
  totalCredits: string
): Schedule {
  const schedule: Schedule = {
    years: [],
    yearMap: {},
    id: 0,
  };

  // add each of the years to schedule
  for (const year of years) {
    schedule.years.push(year.year);
    schedule.yearMap[year.year] = year;
  }

  return schedule;
}

/**
 *
 * @param nodes
 */
function addCourses(
  $: CheerioStatic,
  nodes: CheerioElement[],
  fall: ScheduleCourse[] | Status.COOP | Status.INACTIVE,
  spring: ScheduleCourse[] | Status.COOP | Status.INACTIVE,
  summer1: ScheduleCourse[] | Status.COOP | Status.INACTIVE,
  summer2: ScheduleCourse[] | Status.COOP | Status.INACTIVE
): void {
  // invariant: there will be exactly 4 codecol and 4 hourscol elements.
  let cellIndex = 0;
  let code = "";
  let hours = "";

  console.log(nodes.length);
  for (const tableCell of nodes) {
    //console.log($(tableCell))

    if (tableCell.type !== "tag") {
      continue;
    }

    const tableCellName = $(tableCell).attr("class");
    if (/codecol/.test(tableCellName)) {
      code = $(tableCell).text()
        ? $(tableCell)
            .find("a")
            .text()
        : $(tableCell).text();
    } else if (/hourscol/.test(tableCellName)) {
      hours = $(tableCell).text(); // could be undefined.
    }
  }
}

/**
 * Adds a row's data to the provided arrays.
 * @param nodes the course information for the provided row
 * @param fall the fall data
 * @param spring the spring data
 * @param summer1 summer1 data
 * @param summer2 summer2 data
 */
function addCourse(nodes: CheerioElement[]): ScheduleCourse {
  // invariant: length of nodes is 8.
  // pattern is codecol, hourscol, codecol, hourscol...

  for (const el of nodes) {
  }

  return {
    classId: 2500,
    subject: "CS",
    numCreditsMax: 4,
    numCreditsMin: 4,
  };
}

/**
 * Builds a {@interface ScheduleYear} if data exists, and pushes the it to completed.
 * @param nodes the childnodes containing the credit information
 * @param fall the fall data
 * @param spring the spring data
 * @param summer1 the summer1 data
 * @param summer2 the summer2 data
 */
function buildYear(
  nodes: CheerioElement[],
  fall: ScheduleCourse[] | Status.COOP | Status.INACTIVE,
  spring: ScheduleCourse[] | Status.COOP | Status.INACTIVE,
  summer1: ScheduleCourse[] | Status.COOP | Status.INACTIVE,
  summer2: ScheduleCourse[] | Status.COOP | Status.INACTIVE
): ScheduleYear {
  const year: ScheduleYear = {
    fall: {
      season: Season.FL,
      termId: 9999,
      year: 0,
      id: 0,
      status: Status.CLASSES,
      classes: [],
    },
    spring: {
      season: Season.SP,
      termId: 9999,
      year: 0,
      id: 0,
      status: Status.CLASSES,
      classes: [],
    },
    summer1: {
      season: Season.S1,
      termId: 9999,
      year: 0,
      id: 0,
      status: Status.CLASSES,
      classes: [],
    },
    summer2: {
      season: Season.S2,
      termId: 9999,
      year: 0,
      id: 0,
      status: Status.CLASSES,
      classes: [],
    },
    year: 0,
    isSummerFull: false,
  };

  if (fall === Status.COOP || fall === Status.INACTIVE) {
    year.fall.status = fall;
  } else {
    year.fall.classes = fall;
  }

  if (spring === Status.COOP || spring === Status.INACTIVE) {
    year.spring.status = spring;
  } else {
    year.spring.classes = spring;
  }

  if (summer1 === Status.COOP || summer1 === Status.INACTIVE) {
    year.summer1.status = summer1;
  } else {
    year.summer1.classes = summer1;
  }

  if (summer2 === Status.COOP || summer2 === Status.INACTIVE) {
    year.summer2.status = summer2;
  } else {
    year.summer2.classes = summer2;
  }

  return year;
}
