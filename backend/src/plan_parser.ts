import { load } from "cheerio";
import {
  Schedule,
  ScheduleYear,
  ScheduleCourse,
  ScheduleTerm,
  Season,
  Status,
} from "./types";

// the year to use as the first year of the schedule.
const BASE_YEAR: number = 1000;

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
    const schedule = buildSchedule($, table);
    schedule.id = planIndex;
    schedules.push(schedule);
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
  let rows: Array<Array<string | ScheduleCourse>> = [];
  let totalCredits = "";

  // table elements
  const tableRows: CheerioElement[] = [];
  $(table)
    .find("tr")
    .each((index, tableRow) => {
      // track the table number.
      const rowClassName = $(tableRow).attr("class");

      if (/^odd/.test(rowClassName) || /^even/.test(rowClassName)) {
        // should be always length 4.
        const courses = addCourses($, tableRow);
        rows.push(courses);
      } else if (/^plangridsum/.test(rowClassName)) {
        // make a new year with the existing data
        const flipped = rows[0].map((col, i) => rows.map(row => row[i]));
        years.push(buildYear($, flipped));
        rows = [];
      } else if (/^plangridtotal/.test(rowClassName)) {
        totalCredits = $(tableRow)
          .find("td")
          .text();
      }
    });

  // build the schedule, and return.
  return buildScheduleFromYears(years, totalCredits);
}

/**
 * Constructs a schedule from a list of {@interface ScheduleYear}s.
 * @param years the list of years
 * @param totalCredits the total credits of the schedule
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

  // all of the years of each year should be zero.
  // all the termIds (of the seasons) should be 10, 30, 40, 60
  years = years.map(function(year: ScheduleYear, index: number): ScheduleYear {
    for (const term of [year.fall, year.spring, year.summer1, year.summer2]) {
      // set this one first, uses termId (two digits).
      term.id = BASE_YEAR + term.termId + index;
      // set this one second, is year shifted two digits left, plus existing termId (one of 10, 30, 40, 60).
      term.termId = (BASE_YEAR + index) * 100 + term.termId;
      // the year is base year plus the index of the year.
      term.year = BASE_YEAR + index;
    }
    year.year = BASE_YEAR + index;
    return year;
  });

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
  tableRow: CheerioElement
): Array<ScheduleCourse | string> {
  // invariant: each codecol is always followed by an hourscol. also can have colspan, if no class is present.
  let produced: Array<ScheduleCourse | string> = [];

  const cells: Array<{ class: string; text: string }> = [];

  // iterate through each of the cells.
  $(tableRow)
    .find("td")
    .each((index, tableCell) => {
      let tableCellClass = $(tableCell).attr("class");
      if (tableCellClass) {
        tableCellClass = tableCellClass.replace(/\s\s+/g, "");
      }

      let tableCellText = $(tableCell).text();
      if (tableCellText) {
        tableCellText = tableCellText.replace(/\s\s+/g, "");
      }

      // push item.
      cells.push({
        class: tableCellClass,
        text: tableCellText,
      });
    });

  // parse each of the cells
  let i = 0;
  while (i < cells.length) {
    const cell = cells[i];

    switch (cell.class) {
      case "codecol":
        switch (cell.text) {
          case "Co-op":
            produced.push("Co-op");
            i += 1;
            break;
          case "Vacation":
            produced.push("Vacation");
            i += 1;
            break;
          case "Elective":
            produced.push({
              classId: 9999,
              subject: "Elective",
              numCreditsMin: parseInt(cells[i + 1].text),
              numCreditsMax: parseInt(cells[i + 1].text),
            });
            i += 1;
            break;
          default:
            // either course, or random elective.
            // if second word is a number, then we have a course.
            if (!isNaN(parseInt(cell.text.split(/\s/)[1]))) {
              produced.push({
                classId: parseInt(cell.text.split(/\s/)[1]),
                subject: cell.text.split(/\s/)[0],
                numCreditsMin: parseInt(cells[i + 1].text),
                numCreditsMax: parseInt(cells[i + 1].text),
              });
              i += 1;
            } else {
              // we have a random elective.
              produced.push({
                classId: 9999,
                subject: cell.text,
                numCreditsMin: parseInt(cells[i + 1].text),
                numCreditsMax: parseInt(cells[i + 1].text),
              });
              i += 1;
            }
        }
        break;
      case undefined:
        // we had a colspan. empty.
        produced.push("");
        break;
      case "hourscol":
        throw "Has an hourscol. Should never occur.";
      default:
        throw "Reached default case. Should never occur.";
    }

    i += 1;
  }

  return produced;
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
  $: CheerioStatic,
  seasons: Array<Array<ScheduleCourse | string>>
): ScheduleYear {
  // invariant: seasons array is length 4.
  if (seasons.length !== 4) {
    throw "Expected seasons to be length 4, was " +
      JSON.stringify(seasons, null, 2);
  }

  const seasonEnums: Season[] = [Season.FL, Season.SP, Season.S1, Season.S2];
  const seasonTermIds: number[] = [10, 30, 40, 60];
  const terms: ScheduleTerm[] = [];

  // iterate over each of the seasons, building up terms.
  for (let i = 0; i < 4; i += 1) {
    let status: Status;
    // change status depending on what the first string is (invariant).
    if (seasons[i][0] === "Co-op") {
      status = Status.COOP;
    } else if (seasons[i][0] === "Vacation" || seasons[i][0] === "") {
      status = Status.INACTIVE;
    } else if (seasons[i].length > 1) {
      status = Status.CLASSES;
    } else {
      throw "List of classes was not coop, vacation, or length > 1.";
    }

    let classes: ScheduleCourse[] = seasons[i].reduce(function(
      accumulator: ScheduleCourse[],
      item: ScheduleCourse | string
    ): ScheduleCourse[] {
      if (typeof item !== "string") {
        accumulator.push(item);
      }
      return accumulator;
    },
    []);

    // add term to the list of terms.
    terms.push({
      season: seasonEnums[i],
      termId: seasonTermIds[i],
      year: 0,
      id: i,
      status: status,
      classes: classes,
    });
  }

  // declare the year.
  const year: ScheduleYear = {
    fall: terms[0],
    spring: terms[1],
    summer1: terms[2],
    summer2: terms[3],
    year: 0,
    isSummerFull: false,
  };

  return year;
}
