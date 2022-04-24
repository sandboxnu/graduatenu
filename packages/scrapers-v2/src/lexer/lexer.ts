import { assertUnreachable } from "@graduate/common";
import { appendPath, loadHTML } from "../utils";
import {
  COURSE_REGEX,
  HEADER_REGEX,
  RANGE_BOUNDED,
  RANGE_LOWER_BOUNDED_MAYBE_EXCEPTIONS_1,
  RANGE_LOWER_BOUNDED_MAYBE_EXCEPTIONS_2,
  RANGE_LOWER_BOUNDED_PARSE,
  RANGE_UNBOUNDED,
  SUBJECT_REGEX,
} from "./constants";
import {
  CourseRow,
  HDocument,
  HRow,
  HRowType,
  HSection,
  MultiCourseRow,
  RangeBoundedRow,
  RangeLowerBoundedRow,
  RangeUnboundedRow,
  TextRow,
  WithExceptions,
} from "./types";

export const scrapeMajorDataFromCatalog = async (
  url: string
): Promise<HDocument> => {
  try {
    const $ = await loadHTML(url);
    // step 1: Transform scraped table into intermediate representation (IR)
    return transformMajorDataFromCatalog($);
  } catch (error) {
    throw error;
  }
};

const transformMajorDataFromCatalog = async (
  $: CheerioStatic
): Promise<HDocument> => {
  const majorName: string = parseText($("#site-title").find("h1"));
  const catalogYear: string = parseText($("#edition")).split(" ")[0];
  const yearVersion: number = parseInt(catalogYear.split("-")[0]);

  const requirementsContainer = $("#programrequirementstextcontainer");
  const courseLists = combineAllCourseListTables($, requirementsContainer);

  const prgramRequiredHeading = requirementsContainer
    .find("h2")
    .filter(
      (_idx: number, element: CheerioElement) =>
        parseText($(element)).includes("Program") &&
        parseText($(element)).includes("Requirement")
    );
  const prgramRequiredHours =
    Number(parseText(prgramRequiredHeading.next()).split(/[\s\xa0]+/)[0]) || 0;

  return {
    programRequiredHours: prgramRequiredHours,
    yearVersion,
    majorName,
    sections: await courseLists,
  };
};

const combineAllCourseListTables = async (
  $: CheerioStatic,
  requirementsContainer: Cheerio
): Promise<HSection[]> => {
  // use a stack to keep track of the course list title and description
  const descriptions: string[] = [];
  const courseList: HSection[] = [];

  for (const element of requirementsContainer.children().toArray()) {
    if (HEADER_REGEX.test(element.name)) {
      descriptions.push(parseText($(element)));
    } else if (
      element.name === "table" &&
      element.attribs["class"] === "sc_courselist"
    ) {
      const tableDesc = descriptions.pop() || "";
      const courseTable = {
        description: tableDesc,
        entries: transformCourseListTable($, element),
      };
      courseList.push(courseTable);
    } else if (
      // only necessary for business concentrations
      element.name === "ul" &&
      parseText($(element).prev()).includes("concentration")
    ) {
      // parse all the business concentration links
      const links = constructNestedLinks($, element);
      const mapped = await Promise.all(links.map(loadHTML));
      const containerId = "#concentrationrequirementstextcontainer";
      const concentrations = await Promise.all(
        mapped.map((concentrationPage) =>
          combineAllCourseListTables(
            concentrationPage,
            concentrationPage(containerId)
          )
        )
      );
      courseList.push(...concentrations.flat());
    }
  }

  return courseList;
};

const constructNestedLinks = ($: CheerioStatic, element: CheerioElement) => {
  // TODO: add support to non-current catalogs
  const base = "https://catalog.northeastern.edu";
  const concentrationsTag = "#concentrationrequirementstext";
  return $(element)
    .find("li > a")
    .toArray()
    .map((link) => $(link).attr("href"))
    .map((path) => appendPath(base, path, concentrationsTag));
};

const transformCourseListTable = (
  $: CheerioStatic,
  table: CheerioElement
): HRow[] => {
  const courseTable: HRow[] = [];

  for (const tr of $(table).find("tbody > tr").toArray()) {
    // different row type
    const type = getRowType($, tr);
    const courseListBodyRow = constructCourseListBodyRow($, tr, type);
    courseTable.push(courseListBodyRow);
  }

  return courseTable;
};

const getRowType = ($: CheerioStatic, tr: CheerioElement) => {
  const trClass = tr.attribs["class"];
  const td = $(tr.children[0]);
  const tdClass = $(tr).children()[0].attribs["class"];

  if (trClass.includes("subheader")) {
    return HRowType.SUBHEADER;
  } else if (trClass.includes("areaheader")) {
    return HRowType.HEADER;
  } else if (trClass.includes("orclass")) {
    return HRowType.OR_COURSE;
  } else if (tdClass) {
    if (tdClass !== "codecol") {
      throw Error(
        "Expected class to exist with value codecol. Please add this case to the compiler."
      );
    }
    if (td.find(".code").toArray().length > 1) {
      return HRowType.AND_COURSE;
    }
    return HRowType.PLAIN_COURSE;
  }

  const tdText = parseText(td);
  // Different range types
  if (
    RANGE_LOWER_BOUNDED_MAYBE_EXCEPTIONS_1.test(tdText) ||
    RANGE_LOWER_BOUNDED_MAYBE_EXCEPTIONS_2.test(tdText)
  ) {
    return HRowType.RANGE_LOWER_BOUNDED;
  } else if (RANGE_BOUNDED.test(tdText)) {
    return HRowType.RANGE_BOUNDED;
  } else if (RANGE_UNBOUNDED.test(tdText)) {
    return HRowType.RANGE_UNBOUNDED;
  }

  return HRowType.COMMENT;
};

/**
 * parse each type of table body row depending on what row type it is,
 * which is determined by the function `getRowType`
 */
const constructCourseListBodyRow = (
  $: CheerioStatic,
  tr: CheerioElement,
  type: HRowType
): HRow => {
  switch (type) {
    case HRowType.HEADER:
    case HRowType.SUBHEADER:
    case HRowType.COMMENT:
      return constructTextRow($, tr, type);
    case HRowType.OR_COURSE:
      return constructOrCourseRow($, tr);
    case HRowType.PLAIN_COURSE:
      return constructPlainCourseRow($, tr);
    case HRowType.AND_COURSE:
      return constructMultiCourseRow($, tr);
    case HRowType.RANGE_LOWER_BOUNDED:
      return constructRangeLowerBoundedMaybeExceptions($, tr);
    case HRowType.RANGE_BOUNDED:
      return constructRangeBounded($, tr);
    case HRowType.RANGE_UNBOUNDED:
      return constructRangeUnbounded($, tr);
    case HRowType.RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS:
      throw "should never get here";
    default:
      return assertUnreachable(type);
  }
};

const constructTextRow = <T>(
  $: CheerioStatic,
  tr: CheerioElement,
  type: T
): TextRow<T> => {
  const [c1, c2] = ensureLength(2, tr.children).map($);
  const description = parseText(c1);
  const hour = parseHour(c2);
  return { hour, description, type };
};

const constructPlainCourseRow = (
  $: CheerioStatic,
  tr: CheerioElement
): CourseRow<HRowType.PLAIN_COURSE> => {
  const [code, desc, hourCol] = ensureLength(3, tr.children).map($);
  const { subject, classId } = parseCourseTitle(parseText(code));
  const description = parseText(desc);
  const hour = parseHour(hourCol);
  return { hour, description, type: HRowType.PLAIN_COURSE, subject, classId };
};

const constructOrCourseRow = (
  $: CheerioStatic,
  tr: CheerioElement
): CourseRow<HRowType.OR_COURSE> => {
  const [code, desc] = ensureLength(2, tr.children).map($);
  // remove "or "
  const { subject, classId } = parseCourseTitle(
    parseText(code).substring(3).trim()
  );
  const description = parseText(desc);
  // there may be multiple courses in the OR, so we can't backtrack
  return { hour: 0, description, type: HRowType.OR_COURSE, subject, classId };
};

const constructMultiCourseRow = (
  $: CheerioStatic,
  tr: CheerioElement
): MultiCourseRow<HRowType.AND_COURSE> => {
  const [code, desc, hourCol] = ensureLength(3, tr.children).map($);
  const titles = code
    .find(".code")
    .toArray()
    .map($)
    .map(parseText)
    .map(parseCourseTitle);
  const firstDescription = parseText(desc.contents().first());
  const restDescriptions = desc
    .children(".blockindent")
    .toArray()
    // ignore the first four characters, "and "
    .map((c) => parseText($(c)).substring(4).trim());
  const descriptions = [firstDescription, ...restDescriptions];
  if (titles.length !== descriptions.length) {
    const msg = `found titles: ${titles.length} !== found descs: ${descriptions.length}`;
    throw new Error(msg + titles + descriptions);
  }
  const courses = titles.map(({ subject, classId }, i) => ({
    subject,
    classId,
    description: descriptions[i],
  }));
  const hour = parseHour(hourCol);
  return {
    hour,
    type: HRowType.AND_COURSE,
    description: descriptions.join(" and "),
    courses,
  };
};

const constructRangeLowerBoundedMaybeExceptions = (
  $: CheerioStatic,
  tr: CheerioElement
):
  | WithExceptions<
      RangeLowerBoundedRow<HRowType.RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS>
    >
  | RangeLowerBoundedRow<HRowType.RANGE_LOWER_BOUNDED> => {
  const [desc, hourCol] = ensureLength(2, tr.children).map($);
  const hour = parseHour(hourCol);
  // text should match one of the following:
  // - CS 9999 or higher[, except CS 9999, CS 9999, CS 3999,... <etc>]
  // - Select from any HIST course numbered 3000 or above.
  // - Complete three HIST courses numbered 2303 or above. Cluster is subject to Department approval.
  const text = parseText(desc);
  // should match the form [["CS 9999", "CS", "9999"], [...]]
  const matches = Array.from(text.matchAll(RANGE_LOWER_BOUNDED_PARSE));
  const [[, subject, , , , id], ...exceptions] = ensureLengthAtLeast(
    1,
    matches
  );
  if (exceptions.length > 0) {
    return {
      type: HRowType.RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS,
      hour,
      subject,
      classIdStart: Number(id),
      exceptions: exceptions.map(([, subject, , , , id]) => ({
        subject,
        classId: Number(id),
      })),
    };
  }
  return {
    type: HRowType.RANGE_LOWER_BOUNDED,
    hour,
    subject,
    classIdStart: Number(id),
  };
};

const constructRangeBounded = (
  $: CheerioStatic,
  tr: CheerioElement
): RangeBoundedRow<HRowType.RANGE_BOUNDED> => {
  const [desc, hourCol] = ensureLength(2, tr.children).map($);
  const hour = parseHour(hourCol);
  // text should match the form:
  // 1. CS 1000 to CS 5999
  // 2. CS 1000-CS 5999
  const text = parseText(desc);
  // should match the form [["CS 9999", "CS", "9999"], [...]]
  const matches = Array.from(text.matchAll(COURSE_REGEX));
  const [[, subject, classIdStart], [, , classIdEnd]] = ensureLength(
    2,
    matches
  );
  return {
    type: HRowType.RANGE_BOUNDED,
    hour,
    subject,
    classIdStart: Number(classIdStart),
    classIdEnd: Number(classIdEnd),
  };
};

const constructRangeUnbounded = (
  $: CheerioStatic,
  tr: CheerioElement
): RangeUnboundedRow<HRowType.RANGE_UNBOUNDED> => {
  const [desc, hourCol] = ensureLength(2, tr.children).map($);
  const hour = parseHour(hourCol);
  // text should match one of the following:
  // - Any course in ARTD, ARTE, ARTF, ARTG, ARTH, and GAME subject areas as long as prerequisites have been met.
  // - BIOE, CHME, CIVE, EECE, ME, IE, MEIE, and ENGR to Department approval.
  const text = parseText(desc);
  const matches = Array.from(text.match(SUBJECT_REGEX) ?? []);
  const subjects = ensureLengthAtLeast(3, matches);
  return {
    type: HRowType.RANGE_UNBOUNDED,
    hour,
    subjects,
  };
};

const parseHour = (td: Cheerio) => {
  const hourText = td.text();
  return parseInt(hourText.split("-")[0]) || 0;
};
const parseText = (td: Cheerio) => {
  // replace &NBSP with space
  return td.text().replaceAll("\xa0", " ").trim();
};
const parseCourseTitle = (parsedCourse: string) => {
  const [subject, classId] = ensureLength(2, parsedCourse.split(" "));
  return {
    subject,
    classId: Number(classId),
  };
};
const ensureLength = <T>(n: number, l: T[]) => {
  const length = l.length;
  if (length !== n) {
    const msg = `expected text row to contain exactly ${n} cells, found ${length}`;
    throw new Error(msg);
  }
  return l;
};
const ensureLengthAtLeast = <T>(n: number, l: T[]) => {
  const length = l.length;
  if (length < n) {
    const msg = `expected text row to contain at least ${n} cells, found ${length}`;
    throw new Error(msg);
  }
  return l;
};
