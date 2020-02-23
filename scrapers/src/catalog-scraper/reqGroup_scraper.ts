import {
  Major,
  IMajorRequirementGroup,
  ANDSection,
  RANGESection,
  ORSection,
  Requirement,
  IOrCourse,
  IAndCourse,
  ICourseRange,
  IRequiredCourse,
  ISubjectRange,
} from "../../../frontend/src/models/types";
import { SectionType, CreditsRange, ScraperRequirement } from "../models/types";
import { ORTagMap, RANGETagMap } from "./catalog_scraper";
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
  rows: CheerioElement[]
): IMajorRequirementGroup | undefined {
  //default section type set to AND.
  let sectionType: SectionType = SectionType.AND;
  let minCredits: number = 0;
  let maxCredits: number = 0;

  //do a pass through the rows to figure out what type of requirment group they represent.
  for (let i = 0; i < rows.length; i++) {
    let row: CheerioElement = rows[i];
    let currentRow: Cheerio = $(row);
    let commentSpan: Cheerio = currentRow.find("span.courselistcomment");
    // a courselistcomment is present in this row
    if (commentSpan.length > 0) {
      if (ORTagMap.hasOwnProperty(commentSpan.text())) {
        //detected OR Tag; change section type to OR
        sectionType = SectionType.OR;
        let credsRange: CreditsRange = processHoursText(
          currentRow.find("td.hourscol").text()
        );
        minCredits = credsRange.numCreditsMin;
        maxCredits = credsRange.numCreditsMax;
        break;
      } else if (RANGETagMap.hasOwnProperty(commentSpan.text())) {
        //detected Range Tag; change section type to Range
        sectionType = SectionType.RANGE;
        let credsRange: CreditsRange = processHoursText(
          currentRow.find("td.hourscol").text()
        );
        minCredits = credsRange.numCreditsMin;
        maxCredits = credsRange.numCreditsMax;
        break;
      }
    }
  }

  // convert the sectionType to a number.
  switch (+sectionType) {
    case SectionType.AND:
      return processAndSection($, rows);
    case SectionType.OR:
      return processOrSection($, rows, minCredits, maxCredits);
    case SectionType.RANGE:
      return processRangeSection($, rows, minCredits, maxCredits);
    default:
      return undefined;
  }
}

/**
 * A function that takes in a list of rows, and converts them into an ANDSection representation.
 * @param $ the Cheeriostatic selector function used to query the DOM.
 * @param rows the rows to be processed.
 */
function processAndSection(
  $: CheerioStatic,
  rows: CheerioElement[]
): ANDSection | undefined {
  let andSection: ANDSection = {
    type: "AND",
    name: findReqGroupName($, rows),
    requirements: [],
  };
  let subHeaders: boolean = containsSubHeaders($, rows);
  //todo: probably won't actually show up anywhere, but if there's rows above the subheader, might not be processed correctly.
  if (subHeaders) {
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
    //can parse the rows as indivdual requirements
    let containsOrRow: boolean = false;
    let reqList: Requirement[] = [];
    rows.forEach((row: CheerioElement, index: number) => {
      if (isOrRow($, row)) {
        //if the row has an or prefix, set the contains flag.
        containsOrRow = true;
      }
      let requirement: ScraperRequirement | undefined = parseRowAsRequirement(
        $,
        row
      );
      if (requirement) {
        if (isRequirement(requirement)) {
          reqList.push(requirement);
        }
      }
    });

    if (containsOrRow) {
      //we need to do this because of the weird formatting for or classes, where part of the "or chain"
      //may appear on a separate row. eg: BSCS Advanced writing section.
      //Note: this may not be generalized enough.
      //todo: generalize.
      andSection.requirements.push(createIOrCourse(reqList));
    } else {
      andSection.requirements = reqList;
    }
  }

  if (andSection.requirements.length > 0) {
    return andSection;
  } else {
    return undefined;
  }
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
  maxCredits: number
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
  if (subHeaders) {
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
    let containsOrRow: boolean = false;
    let reqList: Requirement[] = [];
    rows.forEach((row: CheerioElement, index: number) => {
      if (isOrRow($, row)) {
        //if the row has an or prefix, set the contains flag.
        containsOrRow = true;
      }
      let requirement: ScraperRequirement | undefined = parseRowAsRequirement(
        $,
        row
      );
      if (requirement) {
        if (isRequirement(requirement)) {
          reqList.push(requirement);
        }
      }
    });

    if (containsOrRow) {
      //we need to do this because of the weird formatting for or classes, where part of the "or chain"
      //may appear on a separate row. eg: BSCS Advanced writing section.
      //Note: this may not be generalized enough.
      //todo: generalize.
      orSection.requirements.push(createIOrCourse(reqList));
    } else {
      orSection.requirements = reqList;
    }
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
  let courseRange: ICourseRange = {
    type: "RANGE",
    creditsRequired: minCredits,
    ranges: [],
  };

  let rangeSection: RANGESection = {
    type: "RANGE",
    name: findReqGroupName($, rows),
    numCreditsMin: minCredits,
    numCreditsMax: maxCredits,
    requirements: courseRange,
  };
  //Note: Assuming that a range section probably does not have any subheaders. If there ends up being one,
  //      adapt function to handle like parseAndSection.

  //loop through the rows and add them as a requirement to andCourse.courses
  for (let i = 0; i < rows.length; i++) {
    let row: CheerioElement = rows[i];
    //process row as an indivdual requirement and push to andCourse.courses
    let requirement: ISubjectRange | undefined = parseSubjectRangeRow($, row);
    if (requirement) {
      courseRange.ranges.push(requirement);
    }
  }

  if (courseRange.ranges.length > 0) {
    return rangeSection;
  } else {
    return undefined;
  }
}
