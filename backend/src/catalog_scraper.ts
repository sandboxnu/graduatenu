var cheerio = require("cheerio");
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
} from "../../frontend/src/models/types";
import { number } from "prop-types";

const rp = require("request-promise");

enum SectionType {
  AND,
  OR,
  RANGE,
}

enum RowType {
  AndRow,
  OrRow,
  SubjectRangeRow,
  RequiredCourseRow,
}

enum SubHeaderReqType {
  IAndCourse,
  IOrCourse,
  ICourseRange,
}

interface CreditsRange {
  numCreditsMin: number;
  numCreditsMax: number;
}

//todo: might want to only pass down rows after the comment.
//todo: go through code and figure out where to break;

// Dictionary for ORSection keywords, maps from keyword/phrase -> number of credits
let ORTagMap: { [key: string]: number } = {
  "Complete one of the following:": 4,
  "Then complete one of the following:": 4,
  "Complete one of the following sequences:": 10,
  "Complete two of the following:": 8,
  "Complete three of the following:": 12,
  "Complete two courses for one of the following science categories:": 10,
  "Complete five courses from the following:": 20,
  // TODO: Data-Science-Related Electives: "Complete six courses from categories A and B, at least three of which must be from B"
};

// Dictionary for RANGESection keywords, maps from keyword/phrase -> number of credits
let RANGETagMap: { [key: string]: number } = {
  "Complete 8 credits of CS, IS or DS classes that are not already required. Choose courses within the following ranges:": 8,
};

/**
 * Scrapes the major data from the given course catalog URL.
 * @param link the URL string of the course catalog page to be parsed
 */
function catalogToMajor(link: string) {
  var options = {
    uri: link,
    transform: function(body: string) {
      return cheerio.load(body);
    },
  };

  rp(options)
    .then(($: CheerioStatic) => scrapeMajorDataFromCatalog($))
    .then((scrapedMajor: Major) => {
      console.log(
        "--------------------Parsed major object--------------------"
      );
      console.log(JSON.stringify(scrapedMajor));
    })
    .catch(function(err: string) {
      console.log(err);
    });
}

function scrapeMajorDataFromCatalog($: CheerioStatic): Promise<Major> {
  return new Promise<Major>((resolve, reject) => {
    let name: string = $("#content .page-title").text();
    let catalogYear: string = $("#edition")
      .text()
      .split(" ")[0];
    let yearVersion: number = parseInt(catalogYear.split("-")[0]);
    let requirementGroupMap: {
      [key: string]: IMajorRequirementGroup;
    } = createRequirementGroupMap($);
    let requirementGroups: string[] = Object.keys(requirementGroupMap);
    let major: Major = {
      name: name,
      requirementGroups: requirementGroups,
      requirementGroupMap: requirementGroupMap,
      yearVersion: yearVersion,
      isLanguageRequired: false,
      nupaths: [],
      totalCreditsRequired: 0,
    };
    resolve(major);
  });
}

function createRequirementGroupMap(
  $: CheerioStatic
): { [key: string]: IMajorRequirementGroup } {
  let requirementGroupMap: { [key: string]: IMajorRequirementGroup } = {};
  $("#programrequirementstextcontainer table.sc_courselist").each(
    (index: number, table: CheerioElement) => {
      let rows: CheerioElement[] = [];
      $(table)
        .find("tr")
        .each((index: number, tableRow: CheerioElement) => {
          let currentRow: Cheerio = $(tableRow);
          if (
            currentRow.find("span.areaheader").length !== 0 &&
            rows.length > 0
          ) {
            let requirementGroup:
              | IMajorRequirementGroup
              | undefined = createRequirementGroup($, rows);
            rows = [tableRow];
            if (requirementGroup) {
              requirementGroupMap[requirementGroup.name] = requirementGroup;
            }
          } else {
            rows.push(tableRow);
          }
        });
      //process last requirement group for the table
      if (rows.length > 0) {
        let requirementGroup:
          | IMajorRequirementGroup
          | undefined = createRequirementGroup($, rows);
        if (requirementGroup) {
          if (requirementGroup.requirements)
            requirementGroupMap[requirementGroup.name] = requirementGroup;
        }
      }
    }
  );
  return requirementGroupMap;
}

/**
 * Interprets a given list of rows and converts them to a valid major requirement group.
 * @param $ the Cheeriostatic selector function used to query the DOM.
 * @param rows the given list of rows within this major requirement group
 */
function createRequirementGroup(
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
        //todo: probably only want to process the rows after the subheader row itself.
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
      let requirement: Requirement | undefined = parseRowAsRequirement($, row);
      if (requirement) {
        reqList.push(requirement);
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
        //todo: probably only want to process the rows after the subheader row itself.
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
      let requirement: Requirement | undefined = parseRowAsRequirement($, row);
      if (requirement) {
        reqList.push(requirement);
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

/**
 * Create a Requirement out of the rows that make up a subheader.
 * @param $ the selector function used to query the DOM.
 * @param subHeaderRows the rows that make up the subHeader.
 */
function parseSubHeaderRequirement(
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
        //todo: call parseIndentBlockRequirements
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
        let requirement: Requirement | undefined = parseRowAsRequirement(
          $,
          row
        );
        if (requirement) {
          andCourse.courses.push(requirement);
        }
      }
    }
  }

  //process the last indent block's rows.
  if (indentBlockRows.length > 0) {
    //todo: call parseIndentBlockRequirements
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
        let requirement: Requirement | undefined = parseRowAsRequirement(
          $,
          row
        );
        if (requirement) {
          orCourse.courses.push(requirement);
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
    let requirement: ISubjectRange | undefined = parseSubjectRangeRow($, row);
    if (requirement) {
      courseRange.ranges.push(requirement);
    }
  }

  if (courseRange.ranges.length > 0) {
    return courseRange;
  } else {
    return undefined;
  }
}

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
    let requirement: Requirement | undefined = parseRowAsRequirement($, row);
    if (requirement) {
      andCourse.courses.push(requirement);
    }
  }
  return andCourse;
}

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
    let requirement: Requirement | undefined = parseRowAsRequirement($, row);
    if (requirement) {
      orCourse.courses.push(requirement);
    }
  }
  return orCourse;
}

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
    let requirement: ISubjectRange | undefined = parseSubjectRangeRow($, row);
    if (requirement) {
      courseRange.ranges.push(requirement);
    }
  }

  return courseRange;
}

/**
 * A function that given a row, converts it into a Requirement type.
 * @param $ the selector function used to query the DOM.
 * @param row the row to be proccessed.
 */
function parseRowAsRequirement(
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
    case RowType.SubjectRangeRow:
      return parseSubjectRangeRow($, row);
    case RowType.RequiredCourseRow:
      return parseRequiredRow($, row);
    default:
      return undefined;
  }
}

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

function parseSubjectRangeRow(
  $: CheerioStatic,
  row: CheerioElement
): ISubjectRange | undefined {
  let currentRow: Cheerio = $(row);
  let anchors: Cheerio = currentRow.find("span.courselistcomment a");
  if (anchors.length == 0) {
    return;
  }

  //the length should be === 2.
  let anchorsArray: CheerioElement[] = anchors.toArray();
  let lowerAnchor: Cheerio = $(anchorsArray[0]);
  let splitLowerAnchor: string[] = lowerAnchor
    .text()
    .split(String.fromCharCode(160));

  //first item in the array is the subject
  let subject: string = splitLowerAnchor[0];

  //second item in array is the course number.
  let idRangeStart: number = parseInt(splitLowerAnchor[1]);

  //default to 9999, if upper bound does not exist.
  let idRangeEnd: number = 9999;
  if (
    !currentRow
      .find("span.courselistcomment")
      .text()
      .includes("or higher")
  ) {
    // upper bound exists, get range end.
    let upperAnchor: Cheerio = $(anchorsArray[1]);
    idRangeEnd = parseInt(
      upperAnchor.text().split(String.fromCharCode(160))[1]
    );
  }
  let courseRange: ISubjectRange = {
    type: "SubjectRange",
    subject: subject,
    idRangeStart: idRangeStart,
    idRangeEnd: idRangeEnd,
  };

  return courseRange;
}

function parseRequiredRow(
  $: CheerioStatic,
  row: CheerioElement
): IRequiredCourse {
  let currentRow: Cheerio = $(row);
  let anchors: Cheerio = currentRow.find("td.codecol a");
  let anchorsArray: CheerioElement[] = anchors.toArray();

  //the length should be === 1.
  let loadedAnchor: Cheerio = $(anchorsArray[0]);
  //length of this array === 2.
  let splitAnchor: string[] = loadedAnchor
    .text()
    .split(String.fromCharCode(160));

  //first item in the array is the subject
  let subject: string = splitAnchor[0];

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

function createRequiredCourse(
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
function findReqGroupName($: CheerioStatic, rows: CheerioElement[]): string {
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
function containsSubHeaders($: CheerioStatic, rows: CheerioElement[]): boolean {
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

function processHoursText(text: string): CreditsRange {
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
 * A function that tests to see if a row has "orclass" as a class name attribute.
 * @param $ the selector function used to query the DOM.
 * @param row the row being tested.
 */
function isOrRow($: CheerioStatic, row: CheerioElement): boolean {
  let currentRow: Cheerio = $(row);
  let classNameStr: string | undefined = currentRow.attr("class");
  if (classNameStr) {
    return classNameStr.includes("orclass");
  }
  return false;
}

/**
 *
 * @param reqList
 */
function createIOrCourse(reqList: Requirement[]): IOrCourse {
  return {
    type: "OR",
    courses: reqList,
  };
}

catalogToMajor(
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-science/bscs/#programrequirementstext"
);
