import { load } from "cheerio";
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
  IRequiredCourse,
}

//todo: might want to only pass down rows after the comment.

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
      //write the parse major data to database?
      let parsedMajorObject = parseMajorData(scrapedMajor);
      console.log(
        "--------------------Parsed major object--------------------"
      );
      console.log(JSON.stringify(parsedMajorObject));
    })
    .catch(function(err) {
      console.log(err);
    });
}

function scrapeMajorDataFromCatalog($: CheerioStatic): Promise<Major> {
  return new Promise<Major>((resolve, reject) => {
    $("#programrequirementstextcontainer table.sc_courselist").each(
      (index: number, table: CheerioElement) => {
        //this may need to be an accumulator outside because there could be more than one table.
        // the results would need to be merged.
        let requirementGroupMap: {
          [key: string]: IMajorRequirementGroup;
        } = createRequirementGroupMap($, table);
      }
    );
  });
}

//maybe move the code in here upto the previous function.
function createRequirementGroupMap(
  $: CheerioStatic,
  table: CheerioElement
): { [key: string]: IMajorRequirementGroup } {
  let requirementGroupMap: { [key: string]: IMajorRequirementGroup } = {};
  let rows: CheerioElement[] = [];
  $(table)
    .find("tr")
    .each((index: number, tableRow: CheerioElement) => {
      let currentRow: Cheerio = $(tableRow);
      if (currentRow.find("span.areaheader").length !== 0 && rows.length > 0) {
        let requirementGroup: IMajorRequirementGroup = createRequirementGroup(
          $,
          rows
        );
        rows = [];
        requirementGroupMap[requirementGroup.name] = requirementGroup;
      } else {
        rows.push(tableRow);
      }
    });
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

  //do a pass through the rows to figure out what type of requirment group they represent.
  rows.forEach((row: CheerioElement, index: number) => {
    let currentRow: Cheerio = $(row);
    let commentSpan: Cheerio = currentRow.find("span.courselistcomment");
    // a courselistcomment is present in this row
    if (commentSpan.length > 0) {
      if (ORTagMap.hasOwnProperty(commentSpan.text())) {
        //detected OR Tag; change section type to OR
        sectionType = SectionType.OR;
      } else if (RANGETagMap.hasOwnProperty(commentSpan.text())) {
        sectionType = SectionType.RANGE;
      }
    }
  });

  // convert the sectionType to a number.
  switch (+sectionType) {
    case SectionType.AND:
      return processAndSection($, rows);
    case SectionType.OR:
      return processOrSection($, rows);
    case SectionType.RANGE:
      return processRangeSection($, rows);
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
): ANDSection {
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
    rows.forEach((row: CheerioElement, index: number) => {
      let currentRow: Cheerio = $(row);
      if (
        currentRow.find("span.areasubheader").length !== 0 &&
        rows.length > 0
      ) {
        //process the accumulated subheader rows
        let requirement: Requirement | undefined = parseSubHeaderRequirement(
          $,
          subHeaderRows
        );
        if (requirement) {
          andSection.requirements.push(requirement);
        }
        subHeaderRows = [];
      } else {
        //todo: probably only want to process the rows after the subheader row itself.
        subHeaderRows.push(row);
      }
    });
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
  return andSection;
}

function processOrSection(
  $: CheerioStatic,
  rows: CheerioElement[]
): ORSection {}

function processRangeSection(
  $: CheerioStatic,
  rows: CheerioElement[]
): RANGESection {}

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

  //need to detect the type of requirement the subheader represents.
  subHeaderRows.forEach((row: CheerioElement, index: number) => {
    let currentRow: Cheerio = $(row);
    let commentSpan: Cheerio = currentRow.find("span.courselistcomment");
    //get the class names for the comment span.
    let commentClasses: string | undefined = commentSpan.attr("class");
    if (commentClasses) {
      let isCommentIndented: boolean = commentClasses.includes("commentindent");
      if (!isCommentIndented) {
        // a courselistcomment is present in one of the rows, that isn't an idented comment.
        if (ORTagMap.hasOwnProperty(commentSpan.text())) {
          //detected OR Tag; change section type to OR
          subHeaderReqType = SubHeaderReqType.IOrCourse;
        } else if (RANGETagMap.hasOwnProperty(commentSpan.text())) {
          subHeaderReqType = SubHeaderReqType.ICourseRange;
        }
      }
    }
  });

  // convert the subHeaderReqType to a number.
  switch (+subHeaderReqType) {
    case SubHeaderReqType.IAndCourse:
      return parseAndCourseFromSubHeader($, subHeaderRows);
    case SubHeaderReqType.IOrCourse:
      return parseOrCourseFromSubHeader($, subHeaderRows);
    case SubHeaderReqType.ICourseRange:
      return parseCourseRangeFromSubHeader($, subHeaderRows);
    case SubHeaderReqType.IRequiredCourse:
      return parseRequiredCourseFromSubHeader($, subHeaderRows);
    default:
      return undefined;
  }
}

function parseAndCourseFromSubHeader(
  $: CheerioStatic,
  subHeaderRows: CheerioElement[]
): IAndCourse {
  let andCourse: IAndCourse = {
    type: "AND",
    courses: [],
  };
  //to be added to the andCourse if there is an indent comment that is an ORTag.
  let orIndentReq: IOrCourse = {
    type: "OR",
    courses: [],
  };
  //to be added to the andCourse if there is an indent comment that is an RangeTag.
  let rangeIndentReq: ICourseRange = {
    type: "RANGE",
    creditsRequired: 0,
    ranges: [],
  };

  // This enum type is only used if a "commentindent" is detected.
  // assume, IAndCourse as default sub header type.
  let indentBlockType: SubHeaderReqType = SubHeaderReqType.IAndCourse;
  let containsCommentIdent: boolean = false;

  //loop through the rows and add them as a requirement to andCourse.course
  subHeaderRows.forEach((row: CheerioElement, index: number) => {
    let currentRow: Cheerio = $(row);
    let commentSpan: Cheerio = currentRow.find("span.commentindent");
    if (commentSpan.length > 0) {
      containsCommentIdent = true;
      if (ORTagMap.hasOwnProperty(commentSpan.text())) {
        //detected OR Tag; parse subsequent rows as a IOrCourse
        indentBlockType = SubHeaderReqType.IOrCourse;
      } else if (RANGETagMap.hasOwnProperty(commentSpan.text())) {
        //detected Range Tag; parse subsequent rows as a ICourseRange
        indentBlockType = SubHeaderReqType.IOrCourse;
        //parse out the number of credits required.
        rangeIndentReq.creditsRequired = parseInt(
          currentRow.find("td.hourscol").text()
        );
      }
    } else {
      if (containsCommentIdent) {
        //comment indent was detected, process row as per the detected indentBlockType.
        switch (+indentBlockType) {
          case SubHeaderReqType.IOrCourse:
            //process row as an indivdual requirement and push to andCourse.courses
            let requirement: Requirement | undefined = parseRowAsRequirement(
              $,
              row
            );
            if (requirement) {
              orIndentReq.courses.push(requirement);
            }
            break;
          case SubHeaderReqType.ICourseRange:
            //process row as a subject range.
            let subjectRange: ISubjectRange | undefined = parseSubjectRangeRow(
              $,
              row
            );
            if (subjectRange) {
              rangeIndentReq.ranges.push(subjectRange);
            }
            break;
          default:
            //do nothing. technically shouldn't get here.
            break;
        }
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
  });
  //add in the IOrCourse or the ICourseRange if it is non-empty.
  if (orIndentReq.courses.length > 0) {
    andCourse.courses.push(orIndentReq);
  }
  if (rangeIndentReq.ranges.length > 0) {
    andCourse.courses.push(rangeIndentReq);
  }
  return andCourse;
}

function parseOrCourseFromSubHeader(
  $: CheerioStatic,
  subHeaderRows: CheerioElement[]
): IOrCourse {
  let orCourse: IOrCourse = {
    type: "OR",
    courses: [],
  };
  //to be added to the orCourse if there is an indent comment that is an ORTag.
  let andIndentReq: IAndCourse = {
    type: "AND",
    courses: [],
  };
  //to be added to the andCourse if there is an indent comment that is an RangeTag.
  let rangeIndentReq: ICourseRange = {
    type: "RANGE",
    creditsRequired: 0,
    ranges: [],
  };

  // This enum type is only used if a "commentindent" is detected.
  // assume, IAndCourse as default sub header type.
  let indentBlockType: SubHeaderReqType = SubHeaderReqType.IAndCourse;
  let containsCommentIdent: boolean = false;

  //loop through the rows and add them as a requirement to andCourse.course
  subHeaderRows.forEach((row: CheerioElement, index: number) => {
    let currentRow: Cheerio = $(row);
    let commentSpan: Cheerio = currentRow.find("span.commentindent");
    if (commentSpan.length > 0) {
      containsCommentIdent = true;
      if (ORTagMap.hasOwnProperty(commentSpan.text())) {
        //detected OR Tag; parse subsequent rows as a IOrCourse
        indentBlockType = SubHeaderReqType.IOrCourse;
      } else if (RANGETagMap.hasOwnProperty(commentSpan.text())) {
        //detected Range Tag; parse subsequent rows as a ICourseRange
        indentBlockType = SubHeaderReqType.IOrCourse;
        //parse out the number of credits required.
        rangeIndentReq.creditsRequired = parseInt(
          currentRow.find("td.hourscol").text()
        );
      }
    } else {
      if (containsCommentIdent) {
        //comment indent was detected, process row as per the detected indentBlockType.
        switch (+indentBlockType) {
          case SubHeaderReqType.IOrCourse:
            //process row as an indivdual requirement and push to andCourse.courses
            let requirement: Requirement | undefined = parseRowAsRequirement(
              $,
              row
            );
            if (requirement) {
              andIndentReq.courses.push(requirement);
            }
            break;
          case SubHeaderReqType.ICourseRange:
            //process row as a subject range.
            let subjectRange: ISubjectRange | undefined = parseSubjectRangeRow(
              $,
              row
            );
            if (subjectRange) {
              rangeIndentReq.ranges.push(subjectRange);
            }
            break;
          default:
            //do nothing. technically shouldn't get here.
            break;
        }
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
  });
  //add in the IOrCourse or the ICourseRange if it is non-empty.
  if (andIndentReq.courses.length > 0) {
    orCourse.courses.push(andIndentReq);
  }
  if (rangeIndentReq.ranges.length > 0) {
    orCourse.courses.push(rangeIndentReq);
  }
  return orCourse;
}

function parseCourseRangeFromSubHeader(
  $: CheerioStatic,
  subHeaderRows: CheerioElement[]
): ICourseRange {}

function parseRequiredCourseFromSubHeader(
  $: CheerioStatic,
  subHeaderRows: CheerioElement[]
): IRequiredCourse {}

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

function parseAndRow($: CheerioStatic, row: CheerioElement): IAndCourse {
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
  return andCourse;
}

function parseOrRow($: CheerioStatic, row: CheerioElement): IOrCourse {
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
  return orCourse;
}

function parseSubjectRangeRow(
  $: CheerioStatic,
  row: CheerioElement
): ISubjectRange {
  let currentRow: Cheerio = $(row);
  let anchors: Cheerio = currentRow.find("td.codecol a");

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
  rows.forEach((row: CheerioElement, index: number) => {
    let currentRow: Cheerio = $(row);
    let nameSpan: Cheerio = currentRow.find("span.areaheader");
    if (nameSpan.length !== 0) {
      return nameSpan.text();
    }
  });
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
  rows.forEach((row: CheerioElement, index: number) => {
    let currentRow: Cheerio = $(row);
    //check if an areasubheader row exists
    let subHeaderSpan: Cheerio = currentRow.find("span.areasubheader");
    if (subHeaderSpan.length !== 0) {
      return true;
    }
  });
  return false;
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

//old function. need to take out once everything is done.
function scrapeMajor1DataFromCatalog($: CheerioStatic) {
  return new Promise((resolve, reject) => {
    let major = [
      $("#content .page-title").text(),
      $("#edition")
        .text()
        .split(" ")[0],
    ];
    var sectionReq = [];
    var sectionIsOrReq = false;
    var sectionIsRange = false;
    var orRequirement = "";
    var hoursReq = "";
    $("#programrequirementstextcontainer table.sc_courselist tr").each(function(
      index: number,
      element: CheerioElement
    ) {
      element;
      var currentRow = $(element);
      if (
        currentRow.find("span.areaheader").length !== 0 ||
        currentRow.find("span.areasubheader").length !== 0
      ) {
        //if (currentRow.find("span.areaheader").length !== 0) {
        sectionIsRange = false;
        sectionIsOrReq = false;
        hoursReq = "";
        //add the previous orRequirement to the course data
        if (orRequirement !== "") {
          sectionReq.push(orRequirement);
          orRequirement = "";
        }
        if (sectionReq.length !== 0) {
          major.push(sectionReq);
          sectionReq = [];
        }
        let commentSpan = $(this);
        sectionReq.push(commentSpan.text());
      }
      if (currentRow.find("span.courselistcomment").length !== 0) {
        currentRow.find("span.courselistcomment").each(function() {
          let commentSpan = $(this);
          //should use regExp matching here
          if (
            commentSpan.text().includes("Complete") ||
            commentSpan
              .text()
              .includes(
                "Up to 4 semester hours may be research in a biology or chemistry faculty lab"
              )
          ) {
            sectionIsOrReq = true;
            hoursReq = currentRow.find("td.hourscol").text();
          }
          if (
            commentSpan
              .text()
              .includes(
                "Complete 8 credits of CS, IS or DS classes that are not already required. Choose courses within the following ranges"
              )
          ) {
            sectionIsRange = true;
            hoursReq = currentRow.find("td.hourscol").text();
          }
        });
      }
      if (sectionIsRange) {
        if (sectionReq.length === 1) {
          sectionReq.push("RANGE");
          sectionReq.push(hoursReq);
        }
        if (currentRow.find("span.courselistcomment").length !== 0) {
          let commentSpan = $(this);
          let range = [];
          commentSpan.find("a").each(function() {
            let currentAnchor = $(this);
            let courseNum = currentAnchor.text();
            range.push(courseNum);
          });
          if (range.length !== 0) {
            rangeString = range.join("-");
            sectionReq.push(rangeString);
          }
        }
      } else {
        if (currentRow.find("td.codecol a").length !== 0) {
          var andRequirement = "";
          currentRow.find("td.codecol a").each(function() {
            let currentAnchor = $(this);
            let courseNum = currentAnchor.text();
            if (andRequirement !== "") {
              courseNum = "%and%" + courseNum;
            }
            andRequirement += courseNum;
          });
          if (sectionIsOrReq) {
            if (sectionReq.length === 1) {
              sectionReq.push("OR");
              sectionReq.push(hoursReq);
            }
            if (orRequirement !== "") {
              orRequirement += "%or%" + andRequirement;
            } else {
              orRequirement = andRequirement;
            }
          } else {
            if (sectionReq.length === 1) {
              sectionReq.push("AND");
            }
            //if this class has an or prefix, append to the last class added to the sectionReq.
            if (currentRow.attr("class").includes("orclass")) {
              sectionReq[sectionReq.length - 1] += "%or%" + andRequirement;
            } else {
              sectionReq.push(andRequirement);
            }
          }
        }
      }
    });
    if (orRequirement !== "") {
      sectionReq.push(orRequirement);
    }
    if (sectionReq.length !== 0) {
      major.push(sectionReq);
      sectionReq = [];
    }
    console.log("--------------------Scraped major data--------------------");
    console.log(major);
    resolve(major);
  });
}
