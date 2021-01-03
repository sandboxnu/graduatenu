import {
  Requirement,
  IAndCourse,
  IOrCourse,
  ICourseRange,
  ISubjectRange,
} from "../../../common/types";
import { SubHeaderReqType, ScraperRequirement } from "../models/types";
import { ORTagMap, RANGETagMap } from "./scraper_constants";
import { processHoursText, isRequirement } from "../utils/scraper_utils";
import { parseRowAsRequirement, parseSubjectRangeRow } from "./row_scraper";

/**
 * Create a Requirement out of the rows that make up a subheader.
 * @param $ the selector function used to query the DOM.
 * @param subHeaderRows the rows that make up the subHeader.
 */
export function parseSubHeaderRequirement(
  $: CheerioStatic,
  subHeaderRows: CheerioElement[]
): Requirement | undefined {
  //Assume, IAndCourse as default sub header type.
  let subHeaderReqType: SubHeaderReqType = SubHeaderReqType.IAndCourse;
  //for course range.
  let numCredits: number = 0;

  //need to detect the type of requirement the subheader represents.
  for (let i = 0; i < subHeaderRows.length; i++) {
    let row: CheerioElement = subHeaderRows[i];
    let currentRow: Cheerio = $(row);
    let commentSpan: Cheerio = currentRow.find("span.courselistcomment");
    //get the class names for the comment span.
    let commentClasses: string | undefined = commentSpan.attr("class");
    if (commentClasses) {
      //Don't consider indent comments to determine subheadertype.
      if (!commentClasses.includes("commentindent")) {
        // a courselistcomment is present in one of the rows, that isn't an idented comment.
        if (ORTagMap.hasOwnProperty(commentSpan.text())) {
          //detected OR Tag; change section type to OR
          subHeaderReqType = SubHeaderReqType.IOrCourse;
          //break so the type is not overridden.
          break;
        } else if (RANGETagMap.hasOwnProperty(commentSpan.text())) {
          subHeaderReqType = SubHeaderReqType.ICourseRange;
          //break so the type is not overridden.
          numCredits = processHoursText(currentRow.find("td.hourscol").text())
            .numCreditsMin;
          parseInt(currentRow.find("td.hourscol").text());
          break;
        }
      }
    }
  }

  // convert the subHeaderReqType to a number.
  switch (+subHeaderReqType) {
    //dispatch rows to appriopriate functions.
    case SubHeaderReqType.IAndCourse:
      return parseAndCourseFromSubHeader($, subHeaderRows);
    case SubHeaderReqType.IOrCourse:
      return parseOrCourseFromSubHeader($, subHeaderRows);
    case SubHeaderReqType.ICourseRange:
      return parseCourseRangeFromSubHeader($, subHeaderRows, numCredits);
    default:
      return undefined;
  }
}

/**
 * Interprets the list of subheader rows as an IAndCourse Requirement.
 * @param $ the selector function used to query the DOM.
 * @param subHeaderRows the rows that make up the subHeader.
 */
function parseAndCourseFromSubHeader(
  $: CheerioStatic,
  subHeaderRows: CheerioElement[]
): IAndCourse | undefined {
  let andCourse: IAndCourse = {
    type: "AND",
    courses: [],
  };
  //does it contain a comment indent block?
  let containsCommentIdent: boolean = false;
  //only to be used if an indent block is detected.
  let indentBlockRows: CheerioElement[] = [];

  //loop through the rows and add them as a requirement to andCourse.courses
  for (let i = 0; i < subHeaderRows.length; i++) {
    let row: CheerioElement = subHeaderRows[i];
    let currentRow: Cheerio = $(row);
    let commentSpan: Cheerio = currentRow.find("span.commentindent");
    if (commentSpan.length > 0) {
      containsCommentIdent = true;
      if (indentBlockRows.length > 0) {
        //process the accumulated indentBlockRows as per their type.
        let requirement: Requirement | undefined = parseIndentBlockRequirement(
          $,
          indentBlockRows
        );
        if (requirement) {
          andCourse.courses.push(requirement);
        }
        //reset the indent block rows. Needs the commentspan row too, to dispatch to correct function.
        indentBlockRows = [row];
      } else {
        indentBlockRows.push(row);
      }
    } else {
      if (containsCommentIdent) {
        //push the row onto the indentBlockRows.
        indentBlockRows.push(row);
      } else {
        //process row as an indivdual requirement and push to andCourse.courses
        let requirement: ScraperRequirement | undefined = parseRowAsRequirement(
          $,
          row
        );
        if (requirement) {
          if (isRequirement(requirement)) {
            andCourse.courses.push(requirement);
          }
        }
      }
    }
  }

  //process the last indent block's rows.
  if (indentBlockRows.length > 0) {
    let requirement: Requirement | undefined = parseIndentBlockRequirement(
      $,
      indentBlockRows
    );
    if (requirement) {
      andCourse.courses.push(requirement);
    }
  }

  if (andCourse.courses.length > 0) {
    return andCourse;
  } else {
    return undefined;
  }
}

/**
 * Interprets the list of subheader rows as an IOrCourse Requirement.
 * @param $ the selector function used to query the DOM.
 * @param subHeaderRows the rows that make up the subHeader.
 */
function parseOrCourseFromSubHeader(
  $: CheerioStatic,
  subHeaderRows: CheerioElement[]
): IOrCourse | undefined {
  let orCourse: IOrCourse = {
    type: "OR",
    courses: [],
  };
  //does it contain a comment indent block?
  let containsCommentIdent: boolean = false;
  //only to be used if an indent block is detected.
  let indentBlockRows: CheerioElement[] = [];

  //loop through the rows and add them as a requirement to andCourse.courses
  for (let i = 0; i < subHeaderRows.length; i++) {
    let row: CheerioElement = subHeaderRows[i];
    let currentRow: Cheerio = $(row);
    let commentSpan: Cheerio = currentRow.find("span.commentindent");
    if (commentSpan.length > 0) {
      containsCommentIdent = true;
      if (indentBlockRows.length > 0) {
        //process the accumulated indentBlockRows as per their type.
        let requirement: Requirement | undefined = parseIndentBlockRequirement(
          $,
          indentBlockRows
        );
        if (requirement) {
          orCourse.courses.push(requirement);
        }
        //reset the indent block rows. Needs the commentspan row too, to dispatch to correct function.
        indentBlockRows = [row];
      } else {
        indentBlockRows.push(row);
      }
    } else {
      if (containsCommentIdent) {
        //push the row onto the indentBlockRows.
        indentBlockRows.push(row);
      } else {
        //process row as an indivdual requirement and push to andCourse.courses
        let requirement: ScraperRequirement | undefined = parseRowAsRequirement(
          $,
          row
        );
        if (requirement) {
          if (isRequirement(requirement)) {
            orCourse.courses.push(requirement);
          }
        }
      }
    }
  }

  //process the last indent block's rows.
  if (indentBlockRows.length > 0) {
    let requirement: Requirement | undefined = parseIndentBlockRequirement(
      $,
      indentBlockRows
    );
    if (requirement) {
      orCourse.courses.push(requirement);
    }
  }

  if (orCourse.courses.length > 0) {
    return orCourse;
  } else {
    return undefined;
  }
}

/**
 * Interprets the list of subheader rows as an ICourseRange Requirement.
 * @param $ the selector function used to query the DOM.
 * @param subHeaderRows the rows that make up the subHeader.
 */
function parseCourseRangeFromSubHeader(
  $: CheerioStatic,
  subHeaderRows: CheerioElement[],
  numCredits: number
): ICourseRange | undefined {
  let courseRange: ICourseRange = {
    type: "RANGE",
    creditsRequired: numCredits,
    ranges: [],
  };
  //Note: assuming that no indent blocks within a CourseRange subheader. If there ends up being one,
  //      adapt function to handle like parseAndCourseFromSubHeader

  //loop through the rows and add them as a requirement to andCourse.courses
  for (let i = 0; i < subHeaderRows.length; i++) {
    let row: CheerioElement = subHeaderRows[i];
    //process row as an indivdual requirement and push to andCourse.courses

    let requirements: Array<ISubjectRange> = parseSubjectRangeRow($, row);
    courseRange.ranges = courseRange.ranges.concat(requirements);
  }

  if (courseRange.ranges.length > 0) {
    return courseRange;
  } else {
    return undefined;
  }
}

/**
 * Interprets the list of indent block rows as a Requirement.
 * @param $ the selector function used to query the DOM.
 * @param indentBlockRows the rows that make up the subHeader.
 */
function parseIndentBlockRequirement(
  $: CheerioStatic,
  indentBlockRows: CheerioElement[]
): Requirement | undefined {
  //Assume, IAndCourse as default indent block type.
  let indentBlockReqType: SubHeaderReqType = SubHeaderReqType.IAndCourse;
  //for course range.
  let numCredits: number = 0;

  //need to detect the type of requirement the subheader represents.
  for (let i = 0; i < indentBlockRows.length; i++) {
    let row: CheerioElement = indentBlockRows[i];
    let currentRow: Cheerio = $(row);
    let commentSpan: Cheerio = currentRow.find("span.courselistcomment");
    //get the class names for the comment span.
    let commentClasses: string | undefined = commentSpan.attr("class");
    if (commentClasses) {
      // a courselistcomment is present in one of the rows, that isn't an idented comment.
      if (ORTagMap.hasOwnProperty(commentSpan.text())) {
        //detected OR Tag; change req type to OR
        indentBlockReqType = SubHeaderReqType.IOrCourse;
        //break so the type is not overridden.
        break;
      } else if (RANGETagMap.hasOwnProperty(commentSpan.text())) {
        //detected Range Tag; change req type to Range
        indentBlockReqType = SubHeaderReqType.ICourseRange;
        //break so the type is not overridden.
        numCredits = processHoursText(currentRow.find("td.hourscol").text())
          .numCreditsMin;
        parseInt(currentRow.find("td.hourscol").text());
        break;
      }
    }
  }

  // convert the subHeaderReqType to a number.
  switch (+indentBlockReqType) {
    //dispatch rows to appriopriate functions.
    case SubHeaderReqType.IAndCourse:
      return parseAndCourseFromIndentBlock($, indentBlockRows);
    case SubHeaderReqType.IOrCourse:
      return parseOrCourseFromIndentBlock($, indentBlockRows);
    case SubHeaderReqType.ICourseRange:
      return parseCourseRangeFromIndentBlock($, indentBlockRows, numCredits);
    default:
      return undefined;
  }
}

/**
 * Interprets the list of indent block rows as an IAndCourse Requirement.
 * @param $ the selector function used to query the DOM.
 * @param indentBlockRows the rows that make up the subHeader.
 */
function parseAndCourseFromIndentBlock(
  $: CheerioStatic,
  subHeaderRows: CheerioElement[]
): IAndCourse {
  let andCourse: IAndCourse = {
    type: "AND",
    courses: [],
  };

  //loop through the rows and add them as a requirement to andCourse.courses
  for (let i = 0; i < subHeaderRows.length; i++) {
    let row: CheerioElement = subHeaderRows[i];
    //process row as an indivdual requirement and push to andCourse.courses
    let requirement: ScraperRequirement | undefined = parseRowAsRequirement(
      $,
      row
    );
    if (requirement) {
      if (isRequirement(requirement)) {
        andCourse.courses.push(requirement);
      }
    }
  }
  return andCourse;
}

/**
 * Interprets the list of indent block rows as an IOrCourse Requirement.
 * @param $ the selector function used to query the DOM.
 * @param indentBlockRows the rows that make up the subHeader.
 */
function parseOrCourseFromIndentBlock(
  $: CheerioStatic,
  subHeaderRows: CheerioElement[]
): IOrCourse {
  let orCourse: IOrCourse = {
    type: "OR",
    courses: [],
  };
  //loop through the rows and add them as a requirement to andCourse.courses
  for (let i = 0; i < subHeaderRows.length; i++) {
    let row: CheerioElement = subHeaderRows[i];
    //process row as an indivdual requirement and push to andCourse.courses
    let requirement: ScraperRequirement | undefined = parseRowAsRequirement(
      $,
      row
    );
    if (requirement) {
      if (isRequirement(requirement)) {
        orCourse.courses.push(requirement);
      }
    }
  }
  return orCourse;
}

/**
 * Interprets the list of indent block rows as an IRangeCourse Requirement.
 * @param $ the selector function used to query the DOM.
 * @param indentBlockRows the rows that make up the subHeader.
 */
function parseCourseRangeFromIndentBlock(
  $: CheerioStatic,
  subHeaderRows: CheerioElement[],
  numCredits: number
): ICourseRange {
  let courseRange: ICourseRange = {
    type: "RANGE",
    creditsRequired: numCredits,
    ranges: [],
  };

  //loop through the rows and add them as a requirement to andCourse.courses
  for (let i = 0; i < subHeaderRows.length; i++) {
    let row: CheerioElement = subHeaderRows[i];
    //process row as an indivdual requirement and push to andCourse.courses
    let requirements: Array<ISubjectRange> = parseSubjectRangeRow($, row);
    courseRange.ranges = courseRange.ranges.concat(requirements);
  }

  return courseRange;
}
