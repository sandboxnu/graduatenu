import { ScraperRequirement, RowType } from "../models/types";
import {
  IAndCourse,
  IRequiredCourse,
  IOrCourse,
  ISubjectRange,
  Requirement,
} from "graduate-common";
import { createRequiredCourse, isRequirement } from "../utils/scraper_utils";
import { RANGECourseSet } from "./catalog_scraper";

/**
 * A function that given a row, converts it into a Requirement type.
 * @param $ the selector function used to query the DOM.
 * @param row the row to be proccessed.
 */
export function parseRowAsRequirement(
  $: CheerioStatic,
  row: CheerioElement
): Requirement | undefined {
  let currentRow: Cheerio = $(row);
  if (currentRow.find("a").length === 0) {
    // the row doesn't have any course information to be parsed in most cases.
    // expections exist, for eg: some biochemistry courses appear as a comment.
    // todo: handle the expections.
    return undefined;
  }
  //default to assume that row is a base case Required Course
  let rowType: RowType = RowType.RequiredCourseRow;
  let codeColSpan = currentRow.find("td.codecol span");
  let rangeSpan = currentRow.find("span.courselistcomment");

  if (codeColSpan.length !== 0) {
    if (codeColSpan.text().includes("and")) {
      rowType = RowType.AndRow;
    } else if (codeColSpan.text().includes("or")) {
      rowType = RowType.OrRow;
    }
  } else {
    if (rangeSpan.length !== 0) {
      rowType = RowType.SubjectRangeRow;
    }
  }

  switch (+rowType) {
    case RowType.AndRow:
      return parseAndRow($, row);
    case RowType.OrRow:
      return parseOrRow($, row);
    case RowType.RequiredCourseRow:
      return parseRequiredRow($, row);
    default:
      return undefined;
  }
}

/**
 * A function that given a row, converts it into an IAndCourse Requirement type.
 * @param $ the selector function used to query the DOM.
 * @param row the row to be proccessed.
 */
function parseAndRow(
  $: CheerioStatic,
  row: CheerioElement
): IAndCourse | undefined {
  let andCourse: IAndCourse = {
    type: "AND",
    courses: [],
  };
  let currentRow: Cheerio = $(row);
  currentRow
    .find("td.codecol a")
    .each((index: number, anchor: CheerioElement) => {
      let currentAnchor: Cheerio = $(anchor);
      let course: String = currentAnchor.text();
      let splitArray: string[] = course.split(String.fromCharCode(160));
      let requiredCourse: IRequiredCourse = createRequiredCourse(
        splitArray[0],
        parseInt(splitArray[1])
      );
      andCourse.courses.push(requiredCourse);
    });

  if (andCourse.courses.length > 0) {
    return andCourse;
  } else {
    return undefined;
  }
}

/**
 * A function that given a row, converts it into an IOrCourse Requirement type.
 * @param $ the selector function used to query the DOM.
 * @param row the row to be proccessed.
 */
function parseOrRow(
  $: CheerioStatic,
  row: CheerioElement
): IOrCourse | undefined {
  let orCourse: IOrCourse = {
    type: "OR",
    courses: [],
  };
  let currentRow: Cheerio = $(row);
  currentRow
    .find("td.codecol a")
    .each((index: number, anchor: CheerioElement) => {
      let currentAnchor: Cheerio = $(anchor);
      let course: String = currentAnchor.text();
      let splitArray: string[] = course.split(String.fromCharCode(160));
      let requiredCourse: IRequiredCourse = createRequiredCourse(
        splitArray[0],
        parseInt(splitArray[1])
      );
      orCourse.courses.push(requiredCourse);
    });
  if (orCourse.courses.length > 0) {
    return orCourse;
  } else {
    return undefined;
  }
}

function parseAsFullRange(
  $: CheerioStatic,
  row: CheerioElement
): Array<ISubjectRange> {
  let currentRow: Cheerio = $(row);
  let anchors: Cheerio = currentRow.find(".courselistcomment");
  if (anchors.length == 0) {
    return [];
  }
  let ranges: Array<ISubjectRange> = [];
  let possibleKeys: Array<string> = anchors
    .text()
    .split(String.fromCharCode(32));
  RANGECourseSet.filter(value => possibleKeys.includes(value)).forEach(
    (subject: string) => {
      //Potentially add a check to ensure that the subject keywords are followed by "course" or "elective", but unsure
      let courseRange: ISubjectRange = {
        subject: subject,
        idRangeStart: 0,
        idRangeEnd: 9999,
      };
      ranges.push(courseRange);
    }
  );
  return ranges;
}

/**
 * A function that given a row, converts it into an ISubjectRange Requirement type.
 * @param $ the selector function used to query the DOM.
 * @param row the row to be proccessed.
 */
export function parseSubjectRangeRow(
  $: CheerioStatic,
  row: CheerioElement
): Array<ISubjectRange> {
  let currentRow: Cheerio = $(row);
  let anchors: Cheerio = currentRow.find(".courselistcomment.commentindent");

  if (anchors.length == 0) {
    return parseAsFullRange($, row);
  }

  //the length should be === 2.
  let anchorsArray: CheerioElement[] = anchors.toArray();
  let lowerAnchor: Cheerio = $(anchorsArray[0]);
  let splitByChar: string[] = lowerAnchor
    .text()
    .split(String.fromCharCode(160));
  let splitLowerAnchor: string[] = [];
  splitByChar.forEach(element => {
    splitLowerAnchor = splitLowerAnchor.concat(
      element.split(String.fromCharCode(32))
    );
  });

  //first item in the array is the subject
  let subject: string = splitLowerAnchor[0];

  //second item in array is the course number.
  let idRangeStart: number = parseInt(splitLowerAnchor[1]);

  //default to 9999, if upper bound does not exist.
  let idRangeEnd: number = 9999;
  if (
    !splitLowerAnchor.includes("higher") &&
    !splitLowerAnchor.includes("or")
  ) {
    // upper bound exists, get range end.
    //let upperAnchor: Cheerio = $(anchorsArray[1]);
    idRangeEnd = parseInt(splitLowerAnchor[4]);
  }
  let courseRange: ISubjectRange = {
    subject: subject,
    idRangeStart: idRangeStart,
    idRangeEnd: idRangeEnd,
  };

  return [courseRange];
}

/**
 * A function that given a row, converts it into an IRequiredCourse Requirement type.
 * @param $ the selector function used to query the DOM.
 * @param row the row to be proccessed.
 */
function parseRequiredRow(
  $: CheerioStatic,
  row: CheerioElement
): IRequiredCourse {
  let currentRow: Cheerio = $(row);
  let anchors: Cheerio = currentRow.find("td.codecol a");
  let anchorsArray: CheerioElement[] = anchors.toArray();

  //the length should be === 1.
  let loadedAnchor: Cheerio = $(anchorsArray[0]);

  // split the text by spaces and also char(160) if it is present
  let splitByChar: string[] = loadedAnchor
    .text()
    .split(String.fromCharCode(160));
  let splitAnchor: string[] = [];
  splitByChar.forEach(element => {
    splitAnchor = splitAnchor.concat(element.split(String.fromCharCode(32)));
  });

  //first item in the array is the subject
  //This is for the occasional edge case where a course is enlisted under two different subjects
  // Looks something like ENGL/JWSS 3686
  let subject: string = splitAnchor[0];
  if (subject.length > 4) {
    subject = subject.split(String.fromCharCode(47))[0];
  }

  //second item in array is the course number.
  let classId: number = parseInt(splitAnchor[1]);

  //construct the required course.
  let requiredCourse: IRequiredCourse = {
    type: "COURSE",
    classId: classId,
    subject: subject,
  };

  return requiredCourse;
}
