import { load } from "cheerio";
import {
  Schedule,
  ScheduleYear,
  ScheduleCourse,
  ScheduleTerm,
  Season,
  Status,
} from "../../common/types";
import { fetchCourse } from "../../frontend/src/api";
import { SeasonEnum, StatusEnum } from "../../frontend/src/models/types";
import { SSL_OP_EPHEMERAL_RSA } from "constants";
import { resolve } from "dns";

const rp = require("request-promise");

// the year to use as the first year of the schedule.
const BASE_YEAR: number = 1000;

/**
 * Produces the {@interface Schedule}s for a given plan of study for a major.
 * @param link the link to the plan of study to download.
 */
export async function planOfStudyToSchedule(
  planofstudy: string
): Promise<Schedule[]> {
  const $ = load(planofstudy);

  // the list of found schedules.
  const schedules: Promise<Schedule>[] = [];

  // for each of the plans, produce a schedule.
  $(".sc_plangrid tbody").each((planIndex, table) => {
    const schedule = buildSchedule($, table);
    schedules.push(schedule);
  });
  return await Promise.all(schedules);
}

//every time we set a plan: look up all the courses and set in schedule
//in the parser, make the API call.
//while parsing, after the course is don eit should get the name of teh course

/**
 * Builds a schedule from the table information.
 * @param $ the page
 * @param table the table of stuff to build the schedule from
 */
async function buildSchedule(
  $: CheerioStatic,
  table: CheerioElement
): Promise<Schedule> {
  // what year we're on
  const yearPromises: Promise<ScheduleYear>[] = [];

  // information for the current year we're parsing
  let rows: Promise<(string | ScheduleCourse)[]>[] = [];
  let totalCredits = "";

  // table elements
  const tableRows: CheerioElement[] = [];

  await $(table)
    .find("tr")
    .each((index, tableRow) => {
      // track the table number.
      const rowClassName = $(tableRow).attr("class");
      if (!!rowClassName) {
        if (/^odd/.test(rowClassName) || /^even/.test(rowClassName)) {
          // is not always length 4, depends on how many semesters we have.
          const courses = addCourses($, tableRow);
          rows.push(courses);
        } else if (/^plangridsum/.test(rowClassName)) {
          // make a new year with the existing data

          const processRows = async (rows: any) => {
            const courseRowsParsed: Array<any> = await Promise.all(rows);
            const flipped = courseRowsParsed[0].map((col: any, i: any) =>
              courseRowsParsed.map(row => row[i])
            );
            return await buildYear($, flipped);
          };
          yearPromises.push(processRows(rows));

          rows = [];
        } else if (/^plangridtotal/.test(rowClassName)) {
          totalCredits = $(tableRow)
            .find("td")
            .text();
        }
      } else {
        // should never get here. If we do, error.
        throw 'attribute "class" was not found tableRow.';
      }
    });

  // build the schedule, and return.
  const years = await Promise.all(yearPromises);
  const y = buildScheduleFromYears(years, totalCredits);
  return y;
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
  };

  // all of the years of each year should be zero.
  // all the termIds (of the seasons) should be 10, 30, 40, 60
  years = years.map(function(year: ScheduleYear, index: number): ScheduleYear {
    for (const term of [year.fall, year.spring, year.summer1, year.summer2]) {
      // set this one first, is year shifted two digits left, plus existing termId (one of 10, 30, 40, 60).
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
async function addCourses(
  $: CheerioStatic,
  tableRow: CheerioElement
): Promise<Array<ScheduleCourse | string>> {
  // invariant: each codecol is always followed by an hourscol. also can have colspan, if no class is present.
  let produced: Array<ScheduleCourse | string> = [];

  const cells: Array<{ class: string; text: string }> = [];

  // iterate through each of the cells.
  $(tableRow)
    .find("td")
    .each((index, tableCell) => {
      let tableCellClass = $(tableCell).attr("class");
      // get rid of whitespace.
      if (tableCellClass) {
        tableCellClass = tableCellClass.replace(/\s\s+/g, "");
      }

      let tableCellText = $(tableCell).text();
      // get rid of whitespace.
      if (tableCellText) {
        tableCellText = tableCellText.replace(/\s\s+/g, "");
      }

      // push item.
      cells.push({
        // if class is undefined, then we had a colspan. mark as accordingly.
        class: !!tableCellClass ? tableCellClass : "colspan",
        text: tableCellText,
      });
    });

  // regular expressions for course types.
  const coopMatch: RegExp = new RegExp(/Co-op/);
  const vacationMatch: RegExp = new RegExp(/Vacation/);
  const electiveMatch: RegExp = new RegExp(/(e|E)lective/);
  const multiCourseMatch: RegExp = new RegExp(
    /([A-Z]{2,})\s(\d{4})(and)\s([A-Z]{2,})\s(\d{4})/
  );

  // parse each of the cells
  let i = 0;
  let credits = 0;
  while (i < cells.length) {
    const cell = cells[i];

    switch (cell.class) {
      case "codecol":
        if (coopMatch.test(cell.text)) {
          produced.push("Co-op");
          i += 1;
          break;
        } else if (vacationMatch.test(cell.text)) {
          produced.push("Vacation");
          i += 1;
          break;
        } else if (electiveMatch.test(cell.text)) {
          credits = parseInt(cells[i + 1].text);
          produced.push({
            classId: String(9999),
            subject: "XXXX",
            numCreditsMin: !isNaN(credits) ? credits : 9999,
            numCreditsMax: !isNaN(credits) ? credits : 9999,
            name: "",
          });

          i += 1;
          break;
        } else if ("" === cell.text) {
          // There are sometimes random codecols that are blank.
          produced.push("");
          // Assume that an hourscol follows, get rid of it too.
          i += 1;
          break;
        } else if (multiCourseMatch.test(cell.text)) {
          // if we have a multicourse, like "CS 1800 and CS 1802"
          const split = cell.text.split(/and\s|\s/);
          credits = parseInt(cells[i + 1].text);
          // second course unfortunately has to have 0 credits.
          produced.push({
            classId: split[1],
            subject: "" + split,
            numCreditsMin: !isNaN(credits) ? credits : 9999,
            numCreditsMax: !isNaN(credits) ? credits : 9999,
            name: "",
          });
          i += 1;
        } else {
          // either course, or random elective.
          // if second word is a number, with exactly 2 sections, then we have a course.
          const split = cell.text.split(/\s/);
          credits = parseInt(cells[i + 1].text);
          if (!isNaN(parseInt(split[1])) && split.length == 2) {
            produced.push({
              classId: split[1],
              subject: split[0],
              numCreditsMin: !isNaN(credits) ? credits : 9999,
              numCreditsMax: !isNaN(credits) ? credits : 9999,
              name: (await fetchCourse(split[0], split[1]))?.name || "",
            });
            i += 1;
          } else {
            // we have a random elective.

            produced.push({
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: !isNaN(credits) ? credits : 9999,
              numCreditsMax: !isNaN(credits) ? credits : 9999,
              name: cell.text,
            });
            i += 1;
          }
        }
        break;
      case "colspan":
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
async function buildYear(
  $: CheerioStatic,
  seasons: Array<Array<ScheduleCourse | string>>
): Promise<ScheduleYear> {
  // seasons array is not always 4! could be 3 (no summer 2), or 5 (including summer full, as 5th).

  const seasonEnums: Season[] = [
    SeasonEnum.FL,
    SeasonEnum.SP,
    SeasonEnum.S1,
    SeasonEnum.S2,
    SeasonEnum.SM,
  ];
  const seasonTermIds: number[] = [10, 30, 40, 60, 50];
  const terms: ScheduleTerm[] = [];

  // iterate over each of the seasons, building up terms.
  for (let i = 0; i < 5; i += 1) {
    if (seasons[i]) {
      seasons[i] = seasons[i].filter(item => item !== "");

      let status: Status;
      // change status depending on what the first string is (invariant).
      if (seasons[i][0] === "Co-op") {
        status = StatusEnum.COOP;
      } else if (seasons[i][0] === "Vacation") {
        status = StatusEnum.INACTIVE;
      } else if (seasons[i].length > 0) {
        status = StatusEnum.CLASSES;
      } else {
        // we didn't have anything, so our status is inactive.
        status = StatusEnum.INACTIVE;
      }

      let classes: Promise<ScheduleCourse>[] = seasons[i].reduce(function(
        accumulator: Promise<ScheduleCourse>[],
        item: ScheduleCourse | string,
        index: number
      ): Promise<ScheduleCourse>[] {
        if (typeof item !== "string") {
          const parsedMultiCourseMatch: RegExp = new RegExp(
            /[A-Z]{2,},\d{4},[A-Z]{2,},\d{4}/
          );

          if (parsedMultiCourseMatch.test(item.subject)) {
            const split = item.subject.split(",");

            const createCourse = async (
              index: number
            ): Promise<ScheduleCourse> => {
              return {
                classId: split[index + 1],
                subject: split[index],
                numCreditsMin: item.numCreditsMin,
                numCreditsMax: item.numCreditsMax,
                name:
                  (await fetchCourse(split[index], split[index + 1]))?.name ||
                  "",
              };
            };

            accumulator.push(createCourse(0));
            accumulator.push(createCourse(2));
          } else {
            accumulator.push(new Promise((resolve, reject) => resolve(item)));
          }
        }
        return accumulator;
      },
      []);

      // add term to the list of terms.
      terms.push({
        season: seasonEnums[i],
        termId: seasonTermIds[i],
        year: 0,
        status: status,
        classes: await Promise.all(classes),
      });
    } else {
      // the season did not exist. we don't have a season!
      terms.push({
        season: seasonEnums[i],
        termId: seasonTermIds[i],
        year: 0,
        status: StatusEnum.INACTIVE,
        classes: [],
      });
    }
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

  // if we aren't inactive for summerfull, then we ARE summerfull.
  if (terms[4].status !== StatusEnum.INACTIVE) {
    year.summer1.classes = terms[4].classes;
    year.summer2.classes = terms[4].classes;

    year.summer1.status = terms[4].status;
    year.summer2.status = terms[4].status;

    year.isSummerFull = true;
  }

  return year;
}

function convertSeasonEnumToText(season: Season): string {
  if (season === "SP") {
    return "spring";
  }
  if (season == "FL") {
    return "fall";
  }
  if (season == "S1") {
    return "summer1";
  }
  if (season == "S2") {
    return "summer2";
  }
  return "";
}

async function runParser() {
  /**
   * testing. move to test file.
   */
  let x = await planOfStudyToSchedule(
    await rp(
      "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-science/bscs/#planofstudytext"
    )
  );

  console.log("--------------------Parsed schedule object--------------------");

  console.log(JSON.stringify(x));
}

runParser();
