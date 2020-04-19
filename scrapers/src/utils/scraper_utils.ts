import { CreditsRange, ScraperRequirement } from "../models/types";
import {
  Requirement,
  ISubjectRange,
  IRequiredCourse,
  IOrCourse,
} from "../../../frontend/src/models/types";

/**
 * Helper function that processes the hours text into a CreditRange
 * @param text the hours text
 */
export function processHoursText(text: string): CreditsRange {
  //split by hyphen to get the range.
  let split: string[] = text.split("-");

  let range: CreditsRange = {
    numCreditsMin: parseInt(split[0]),
    numCreditsMax: parseInt(split[0]),
  };

  if (split.length > 1) {
    //max credits is present
    range.numCreditsMax = parseInt(split[1]);
  }

  return range;
}

/**
 * a predicate for Requirement.
 * @param scraperReq the ScraperRequirement
 */
export function isRequirement(
  scraperReq: ScraperRequirement
): scraperReq is Requirement {
  return (scraperReq as Requirement).type !== undefined;
}

/**
 * a predicate for ISubjectRange.
 * @param scraperReq the ScraperRequirement
 */
export function isSubjectRange(
  scraperReq: ScraperRequirement
): scraperReq is ISubjectRange {
  return (scraperReq as ISubjectRange).idRangeStart !== undefined;
}

/**
 * a predicate for IOrCourse.
 * @param scraperReq the ScraperRequirement
 */
export function isIOrCourse(req: Requirement): req is IOrCourse {
  return (req as IOrCourse).courses !== undefined;
}

/**
 * Create an IRequiredCourse type for a course.
 * @param subject the subject tag
 * @param classId the course number
 */
export function createRequiredCourse(
  subject: string,
  classId: number
): IRequiredCourse {
  let requiredCourse: IRequiredCourse = {
    type: "COURSE",
    classId: classId,
    subject: subject,
  };
  return requiredCourse;
}

/**
 * A function that given a list of rows in a Requirement group, finds its name.
 * @param $ the selector function used to query the DOM.
 * @param rows the list of rows.
 */
export function findReqGroupName(
  $: CheerioStatic,
  rows: CheerioElement[]
): string {
  for (let i = 0; i < rows.length; i++) {
    let row: CheerioElement = rows[i];
    let currentRow: Cheerio = $(row);
    let nameSpan: Cheerio = currentRow.find("span.areaheader");
    if (nameSpan.length !== 0) {
      return nameSpan.text();
    }
  }
  return "";
}

/**
 * A function that given a list of rows, tests whether or not it contains any element with the 'areasubheader'
 * class attribute.
 * @param $ the selector function used to query the DOM.
 * @param rows the list of rows.
 */
export function containsSubHeaders(
  $: CheerioStatic,
  rows: CheerioElement[]
): boolean {
  //Do a pass first pass through to see if there are any subheaders.
  for (let i = 0; i < rows.length; i++) {
    let row: CheerioElement = rows[i];
    let currentRow: Cheerio = $(row);
    //check if an areasubheader row exists
    let subHeaderSpan: Cheerio = currentRow.find("span.areasubheader");
    if (subHeaderSpan.length !== 0) {
      return true;
    }
  }
  return false;
}

/**
 * A function that tests to see if a row has "orclass" as a class name attribute.
 * @param $ the selector function used to query the DOM.
 * @param row the row being tested.
 */
export function isOrRow($: CheerioStatic, row: CheerioElement): boolean {
  let currentRow: Cheerio = $(row);
  let classNameStr: string | undefined = currentRow.attr("class");
  if (classNameStr) {
    return classNameStr.includes("orclass");
  }
  return false;
}

/**
 * Create a basic IOrCourse with courses set to reqlist.
 * @param reqList the list of requirements that are or constrained.
 */
export function createIOrCourse(
  join: Requirement,
  curReq: Requirement
): IOrCourse {
  if (isIOrCourse(curReq)) {
    curReq.courses.push(join);
    return curReq;
  } else {
    return {
      type: "OR",
      courses: [curReq, join],
    };
  }
}
