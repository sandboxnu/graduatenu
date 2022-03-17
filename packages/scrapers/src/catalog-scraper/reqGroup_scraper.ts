import {
  IMajorRequirementGroup,
  ANDSection,
  RANGESection,
  ORSection,
  Requirement,
  ICourseRange,
  ISubjectRange,
} from "@graduate/common";
import { SectionType, CreditsRange, SubSectionType } from "../models/types";
import {
  ORTagMap,
  RANGETagMap,
  RANGECourseSet,
  SubheaderTagSet,
  IgnoreTags,
  ANDSectionHeader,
} from "./scraper_constants";
import {
  processHoursText,
  findReqGroupName,
  containsSubHeaders,
  isOrRow,
  isRequirement,
  createIOrCourse,
} from "../utils/scraper_utils";
import { parseSubHeaderRequirement } from "./subHeader_scraper";
import { parseRowAsRequirement, parseSubjectRangeRow } from "./row_scraper";

/**
 * Interprets a given list of rows and converts them to a valid major requirement group.
 * @param $ the Cheeriostatic selector function used to query the DOM.
 * @param rows the given list of rows within this major requirement group
 */
export function createRequirementGroup(
  $: CheerioStatic,
  rows: CheerioElement[],
  current_header: string
): IMajorRequirementGroup | undefined {
  //default section type set to AND.
  let sectionType: SectionType = SectionType.AND;
  let minCredits: number = 0;
  let maxCredits: number = 0;
  let subheader: boolean = false;

  //do a pass through the rows to figure out what type of requirment group they represent.
  for (let i = 0; i < rows.length; i++) {
    let row: CheerioElement = rows[i];
    let currentRow: Cheerio = $(row);
    let commentSpan: Cheerio = currentRow.find("span.courselistcomment");
    let classTD: Cheerio = currentRow.find("td.codecol");
    // a courselistcomment is present in this row
    if (commentSpan.length > 0) {
      // If it is a section where subheaders are parsed as seperate
      // subcategories (otherwise subheaders will just be ignored)
      if (SubheaderTagSet.includes(commentSpan.text())) {
        subheader = true;
      }
      if (ANDSectionHeader.includes(commentSpan.text())) {
        sectionType = SectionType.AND;
        break;
      } else if (ORTagMap.hasOwnProperty(commentSpan.text())) {
        //detected OR Tag; change section type to OR
        sectionType = SectionType.OR;
        if (currentRow.find("td.hourscol").text().length !== 0) {
          let credsRange: CreditsRange = processHoursText(
            currentRow.find("td.hourscol").text()
          );

          minCredits = credsRange.numCreditsMin;
          maxCredits = credsRange.numCreditsMax;
        } else {
          let cred = ORTagMap[commentSpan.text()];
          minCredits = cred;
          maxCredits = cred;
        }
      } else if (
        sectionType === SectionType.OR &&
        currentRow.find("span.courselistcomment.commentindent").length > 0
      ) {
        if (
          currentRow
            .find("span.courselistcomment.commentindent")
            .text()
            .includes("to") ||
          currentRow
            .find("span.courselistcomment.commentindent")
            .text()
            .includes("or higher")
        ) {
          sectionType = SectionType.RANGE;
        }
        break;
      } else if (RANGETagMap.hasOwnProperty(commentSpan.text())) {
        //detected Range Tag; change section type to Range
        sectionType = SectionType.RANGE;
        if (currentRow.find("td.hourscol").text().length !== 0) {
          let credsRange: CreditsRange = processHoursText(
            currentRow.find("td.hourscol").text()
          );
          minCredits = credsRange.numCreditsMin;
          maxCredits = credsRange.numCreditsMax;
        } else {
          let cred = RANGETagMap[commentSpan.text()];
          minCredits = cred;
          maxCredits = cred;
        }
        break;
      } else if (
        RANGECourseSet.some((item) =>
          commentSpan.text().split(String.fromCharCode(32)).includes(item)
        )
      ) {
        //detected a subject that has a boundless Range (no specified min or max course number) within the comment
        sectionType = SectionType.RANGE;
        let credsRange: CreditsRange = processHoursText(
          currentRow.find("td.hourscol").text()
        );
        minCredits = credsRange.numCreditsMin;
        maxCredits = credsRange.numCreditsMax;
        break;
      } else if (IgnoreTags.includes(commentSpan.text())) {
        return undefined;
      }
    } else if (sectionType === SectionType.OR && classTD.length > 0) {
      // If it's a class and the current row is a class, check if there's an indent (only classes with indents are OR Sections)
      let div = classTD.find("div");
      if (div.length == 0) {
        sectionType = SectionType.AND;
      }
      break;
    } else if (classTD.length > 0) {
      break;
    }
  }

  // convert the sectionType to a number.
  let returnVal = undefined;
  switch (+sectionType) {
    case SectionType.AND:
      returnVal = processAndSection($, rows, subheader);
      break;
    case SectionType.OR:
      returnVal = processOrSection($, rows, minCredits, maxCredits, subheader);
      break;
    case SectionType.RANGE:
      returnVal = processRangeSection($, rows, minCredits, maxCredits);
      break;
    default:
      break;
  }
  if (returnVal && returnVal.name == "") {
    returnVal.name = current_header;
  }
  return returnVal;
}

/**
 * A function that takes in a list of rows, and converts them into an ANDSection representation.
 * @param $ the Cheeriostatic selector function used to query the DOM.
 * @param rows the rows to be processed.
 */
function processAndSection(
  $: CheerioStatic,
  rows: CheerioElement[],
  is_subheader: boolean
): ANDSection | undefined {
  let andSection: ANDSection = {
    type: "AND",
    name: findReqGroupName($, rows),
    requirements: [],
  };
  let subHeaders: boolean = containsSubHeaders($, rows);
  //todo: probably won't actually show up anywhere, but if there's rows above the subheader, might not be processed correctly.
  if (subHeaders && is_subheader) {
    //Need to accumlate rows between the sub headers and process them as a single requirement.
    let subHeaderRows: CheerioElement[] = [];
    for (let i = 0; i < rows.length; i++) {
      let row: CheerioElement = rows[i];
      let currentRow: Cheerio = $(row);
      if (
        currentRow.find("span.areasubheader").length !== 0 &&
        subHeaderRows.length > 0
      ) {
        //process the accumulated subheader rows
        let requirement: Requirement | undefined = parseSubHeaderRequirement(
          $,
          subHeaderRows
        );
        if (requirement) {
          andSection.requirements.push(requirement);
        }
        subHeaderRows = [row];
      } else {
        subHeaderRows.push(row);
      }
    }

    //process last subheader
    if (subHeaderRows.length > 0) {
      //process the accumulated subheader rows
      let requirement: Requirement | undefined = parseSubHeaderRequirement(
        $,
        subHeaderRows
      );
      if (requirement) {
        andSection.requirements.push(requirement);
      }
    }
  } else {
    andSection.requirements = createAndReqList($, rows);
  }

  if (andSection.requirements.length > 0) {
    return andSection;
  } else {
    return undefined;
  }
}

function createAndReqList(
  $: CheerioStatic,
  rows: CheerioElement[]
): Requirement[] {
  let seperate_sections: Map<CheerioElement[], [SubSectionType, number]> =
    splitRows($, rows);
  let reqList: Requirement[] = [];
  Array.from(seperate_sections.entries()).forEach(
    ([sectionRows, [type, credits]]) => {
      let requirements = [];
      switch (+type) {
        case SubSectionType.COURSES:
          requirements = evaluateRows($, sectionRows);
          reqList = reqList.concat(requirements);
          break;
        case SubSectionType.CREDIT:
          requirements = evaluateRows($, sectionRows);
          if (requirements.length !== 0) {
            reqList.push({
              type: "CREDITS",
              minCredits: credits,
              maxCredits: credits,
              courses: requirements,
            });
          }
          break;
        case SubSectionType.RANGE:
          let range = processCourseRange($, sectionRows, credits);
          reqList.push(range);
          break;
        default:
          break;
      }
    }
  );
  return reqList;
}

function evaluateRows($: CheerioStatic, rows: CheerioElement[]) {
  let reqList: Requirement[] = [];
  rows.forEach((row: CheerioElement) => {
    let requirement: Requirement | undefined = parseRowAsRequirement($, row);

    if (requirement && isRequirement(requirement)) {
      if (isOrRow($, row)) {
        let orVal = reqList.pop();
        if (orVal) {
          requirement = createIOrCourse(requirement, orVal);
        }
      }
      reqList.push(requirement);
    }
  });
  return reqList;
}

function splitRows(
  $: CheerioStatic,
  rows: CheerioElement[]
): Map<CheerioElement[], [SubSectionType, number]> {
  let split = new Map<CheerioElement[], [SubSectionType, number]>();
  let sectionType = SubSectionType.COURSES;
  let credits = 0;
  let rowCollection: CheerioElement[] = [];
  rows.forEach((row: CheerioElement) => {
    let comment = $(row).find("span.courselistcomment").text();
    if (comment.length > 0) {
      if (ORTagMap.hasOwnProperty(comment)) {
        if (rowCollection.length !== 0) {
          split.set(rowCollection, [sectionType, credits]);
          rowCollection = [];
        }
        credits = processHoursText(
          $(row).find("td.hourscol").text(),
          ORTagMap[comment]
        ).numCreditsMin;
        sectionType = SubSectionType.CREDIT;
      } else if (RANGETagMap.hasOwnProperty(comment)) {
        if (rowCollection.length !== 0) {
          split.set(rowCollection, [sectionType, credits]);
          rowCollection = [];
        }
        credits = processHoursText(
          $(row).find("td.hourscol").text(),
          RANGETagMap[comment]
        ).numCreditsMin;
        sectionType = SubSectionType.RANGE;
      } else {
        rowCollection.push(row);
      }
    } else {
      if (
        sectionType == SubSectionType.CREDIT &&
        $(row).find("div.blockindent").length == 0
      ) {
        sectionType = SubSectionType.COURSES;
      }
      rowCollection.push(row);
    }
  });
  split.set(rowCollection, [sectionType, credits]);
  return split;
}

/**
 * A function that takes in a list of rows, and converts them into an ORSection representation.
 * @param $ the Cheeriostatic selector function used to query the DOM.
 * @param rows the rows to be processed.
 */
function processOrSection(
  $: CheerioStatic,
  rows: CheerioElement[],
  minCredits: number,
  maxCredits: number,
  is_subheader: boolean
): ORSection | undefined {
  let orSection: ORSection = {
    type: "OR",
    name: findReqGroupName($, rows),
    numCreditsMin: minCredits,
    numCreditsMax: maxCredits,
    requirements: [],
  };
  let subHeaders: boolean = containsSubHeaders($, rows);
  //todo: probably won't actually show up anywhere, but if there's rows above the subheader, might not be processed correctly.
  if (subHeaders && is_subheader) {
    //Need to accumlate rows between the sub headers and process them as a single requirement.
    let subHeaderRows: CheerioElement[] = [];
    for (let i = 0; i < rows.length; i++) {
      let row: CheerioElement = rows[i];
      let currentRow: Cheerio = $(row);
      if (
        currentRow.find("span.areasubheader").length !== 0 &&
        subHeaderRows.length > 0
      ) {
        //process the accumulated subheader rows
        let requirement: Requirement | undefined = parseSubHeaderRequirement(
          $,
          subHeaderRows
        );
        if (requirement) {
          orSection.requirements.push(requirement);
        }
        subHeaderRows = [row];
      } else {
        subHeaderRows.push(row);
      }
    }

    //process last subheader
    if (subHeaderRows.length > 0) {
      //process the accumulated subheader rows
      let requirement: Requirement | undefined = parseSubHeaderRequirement(
        $,
        subHeaderRows
      );
      if (requirement) {
        orSection.requirements.push(requirement);
      }
    }
  } else {
    //can parse the rows as indivdual requirements
    let reqList: Requirement[] = [];
    rows.forEach((row: CheerioElement) => {
      let requirement: Requirement | undefined = parseRowAsRequirement($, row);

      if (requirement && isRequirement(requirement)) {
        if (isOrRow($, row)) {
          let orVal = reqList.pop();
          if (orVal) {
            requirement = createIOrCourse(requirement, orVal);
          }
        }
        reqList.push(requirement);
      }
    });

    orSection.requirements = reqList;
  }
  if (orSection.requirements.length > 0) {
    return orSection;
  } else {
    return undefined;
  }
}

/**
 * A function that takes in a list of rows, and converts them into an RANGESection representation.
 * @param $ the Cheeriostatic selector function used to query the DOM.
 * @param rows the rows to be processed.
 */
function processRangeSection(
  $: CheerioStatic,
  rows: CheerioElement[],
  minCredits: number,
  maxCredits: number
): RANGESection | undefined {
  let courseRange: ICourseRange = processCourseRange($, rows, minCredits);

  let rangeSection: RANGESection = {
    type: "RANGE",
    name: findReqGroupName($, rows),
    numCreditsMin: minCredits,
    numCreditsMax: maxCredits,
    requirements: courseRange,
  };
  if (courseRange.ranges.length > 0) {
    return rangeSection;
  } else {
    return undefined;
  }
}

function processCourseRange(
  $: CheerioStatic,
  rows: CheerioElement[],
  minCredits: number
) {
  let courseRange: ICourseRange = {
    type: "RANGE",
    creditsRequired: minCredits,
    ranges: [],
  };
  //loop through the rows and add them as a requirement to andCourse.courses
  for (let i = 0; i < rows.length; i++) {
    let row: CheerioElement = rows[i];
    //process row as an indivdual requirement and push to andCourse.courses
    let requirements: Array<ISubjectRange> = parseSubjectRangeRow($, row);
    courseRange.ranges = courseRange.ranges.concat(requirements);
  }
  return courseRange;
}
