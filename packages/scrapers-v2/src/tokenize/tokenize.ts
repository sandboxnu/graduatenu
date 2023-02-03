import { assertUnreachable } from "@graduate/common";
import {
  ensureLength,
  ensureLengthAtLeast,
  loadHTML,
  parseText,
} from "../utils";
import {
  COURSE_REGEX,
  RANGE_BOUNDED_MAYBE_EXCEPTIONS,
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
import { join } from "path";
import { BASE_URL } from "../constants";
import { categorizeTextRow } from "./textCategorize";

/**
 * Fetch html for page and convert into intermediate representation (IR)
 *
 * @param url The url of the page to tokenize
 */
export const fetchAndTokenizeHTML = async (url: URL): Promise<HDocument> => {
  return await tokenizeHTML(await loadHTML(url.href));
};

/**
 * Tokenize scraped html into intermediate representation (IR)
 *
 * @param $ The cheerio static for the page to tokenize
 */
export const tokenizeHTML = async ($: CheerioStatic): Promise<HDocument> => {
  const majorName: string = parseText($("#site-title").find("h1"));
  const catalogYear: string = parseText($("#edition")).split(" ")[0];
  const yearVersion: number = parseInt(catalogYear.split("-")[0]);

  const requirementsContainer = getRequirementsContainer($);
  const sections = await tokenizeSections($, requirementsContainer);

  const programRequiredHours = getProgramRequiredHours(
    $,
    requirementsContainer
  );

  // TODO: replace with actual categorization
  for (const s of sections) {
    for (const r of s.entries) {
      if (
        r.type === HRowType.HEADER ||
        r.type === HRowType.SUBHEADER ||
        r.type === HRowType.COMMENT
      ) {
        categorizeTextRow(r);
      }
    }
  }

  return {
    programRequiredHours,
    yearVersion,
    majorName,
    sections: sections,
  };
};

/**
 * Retrieves the cheerio container containing the degree requirements. If there
 * are no tabs, tries to look for ID ending in 'requirementstextcontainer',
 * otherwise tries to find second tab href.
 *
 * @param $
 */
const getRequirementsContainer = ($: CheerioStatic) => {
  const tabsContainer = $("#contentarea #tabs");
  if (tabsContainer.length === 0) {
    // had no tabs, so just look for id ending in "requirementstextcontainer"
    const container = $("[id$='requirementstextcontainer']");
    if (container.length === 1) {
      return container;
    }
    throw new Error(`unexpected # of matching ids: ${container.length}`);
  } else if (tabsContainer.length === 1) {
    const tabsArr = tabsContainer.find("ul > li > a").toArray().map($);
    const [, requirementsTab] = ensureLengthAtLeast(2, tabsArr);
    const containerId = requirementsTab.attr("href");
    return $(containerId);
  }
  throw new Error("unable to find a requirementstextcontainer");
};

/**
 * Retrieves the # of required course-hours for this degree. Looks for a heading
 * with text "program requirements" (ish), and then checks first and last line,
 * first and third word, if it matches a number. if so, returns that #, else 0.
 *
 * @param $
 * @param requirementsContainer
 */
const getProgramRequiredHours = (
  $: CheerioStatic,
  requirementsContainer: Cheerio
) => {
  const programRequiredHeading = requirementsContainer
    .find("h2")
    .filter((_, element) => {
      const text = parseText($(element)).toLowerCase();
      // "program requirement", "program requirements", or "program credit requirements"
      return /program (\w+ )?requirement(s?)/.test(text);
    });

  const nextAll = programRequiredHeading.nextAll().toArray().map($);
  if (nextAll.length >= 1) {
    for (const next of [nextAll[0], nextAll[nextAll.length - 1]]) {
      // keep if matches "minimum of <n>" or "<n>"
      // regex matches space characters (\x) and non-breaking space (\xa0)
      const parts = parseText(next).split(/[\s\xa0]+/);
      // regex matches digits (\d) groups of at least 1 (+)
      if (/\d+/.test(parts[0])) {
        return Number(parts[0]);
      } else if (/\d+/.test(parts[2])) {
        return Number(parts[2]);
      }
    }
  }

  return 0;
};

/**
 * Produces overall HSections for each HTML table in the page
 *
 * @param $
 * @param requirementsContainer
 */
const tokenizeSections = async (
  $: CheerioStatic,
  requirementsContainer: Cheerio
): Promise<HSection[]> => {
  // use a stack to keep track of the course list title and description
  const descriptions: string[] = [];
  const courseList: HSection[] = [];

  for (const element of requirementsContainer.children().toArray()) {
    if (element.name === "h2" || element.name === "h3") {
      // element is h2 or h3 means it's a header text
      descriptions.push(parseText($(element)));
    } else if (
      element.name === "table" &&
      element.attribs["class"] === "sc_courselist"
    ) {
      // class "sc_courselist" signifies that this table is a list of courses
      // => parse the table's rows
      const tableDesc = descriptions.pop() || "";
      const courseTable = {
        description: tableDesc,
        entries: tokenizeRows($, element),
      };
      courseList.push(courseTable);
    } else if (
      // only necessary for business concentrations
      element.name === "ul" &&
      parseText($(element).prev()).includes("concentration")
    ) {
      // if we encounter an unordered list and preceding element contains text "concentration",
      // assume the list is of links for business concentrations.
      // only applies to:
      // https://catalog.northeastern.edu/undergraduate/business/business-administration-bsba/#programrequirementstext
      const links = constructNestedLinks($, element);
      const pages = await Promise.all(links.map(loadHTML));
      const containerId = "#concentrationrequirementstextcontainer";
      const concentrations = await Promise.all(
        pages.map((concentrationPage) =>
          tokenizeSections(concentrationPage, concentrationPage(containerId))
        )
      );
      courseList.push(...concentrations.flat());
    }
  }

  return courseList;
};

/**
 * Finds and fetches nested links, for majors with concentration requirements on
 * separate pages.
 *
 * @param $
 * @param element
 */
const constructNestedLinks = ($: CheerioStatic, element: CheerioElement) => {
  // TODO: add support to non-current catalogs
  return $(element)
    .find("li > a")
    .toArray()
    .map((link) => $(link).attr("href"))
    .map((path) => join(BASE_URL, path));
};

/**
 * Converts tables rows into a list of HRows
 *
 * @param $
 * @param table
 */
const tokenizeRows = ($: CheerioStatic, table: CheerioElement): HRow[] => {
  const courseTable: HRow[] = [];

  for (const tr of $(table).find("tbody > tr").toArray()) {
    // different row type
    const tds = $(tr).find("td").toArray().map($);
    const type = getRowType($, tr, tds);
    const row = constructRow($, tds, type);
    courseTable.push(row);
  }

  return courseTable;
};

/**
 * Pre-parses the row to determine its type
 *
 * @param $
 * @param tr
 * @param tds
 */
const getRowType = ($: CheerioStatic, tr: CheerioElement, tds: Cheerio[]) => {
  const trClasses = new Set(tr.attribs["class"].split(" "));
  const td = tds[0];
  const tdClasses = new Set(td.attr("class")?.split(" "));

  if (tdClasses.size > 0) {
    if (tdClasses.has("codecol")) {
      if (trClasses.has("orclass") !== tdClasses.has("orclass")) {
        throw new Error("td and tr orclass were not consistent");
      }
      const hasMultipleCourses = td.find(".code").toArray().length > 1;
      if (tdClasses.has("orclass")) {
        if (hasMultipleCourses) {
          return HRowType.OR_OF_AND_COURSE;
        }
        return HRowType.OR_COURSE;
      } else if (hasMultipleCourses) {
        return HRowType.AND_COURSE;
      }
      return HRowType.PLAIN_COURSE;
    }
    throw Error(`td class was not "codecol": "${tdClasses}"`);
  }

  if (trClasses.has("subheader")) {
    return HRowType.SUBHEADER;
  } else if (trClasses.has("areaheader")) {
    return HRowType.HEADER;
  }

  const tdText = parseText(td);
  // Different range types
  if (
    RANGE_LOWER_BOUNDED_MAYBE_EXCEPTIONS_1.test(tdText) ||
    RANGE_LOWER_BOUNDED_MAYBE_EXCEPTIONS_2.test(tdText)
  ) {
    return HRowType.RANGE_LOWER_BOUNDED;
  } else if (RANGE_BOUNDED_MAYBE_EXCEPTIONS.test(tdText)) {
    return HRowType.RANGE_BOUNDED;
  } else if (RANGE_UNBOUNDED.test(tdText)) {
    return HRowType.RANGE_UNBOUNDED;
  }

  return HRowType.COMMENT;
};

/**
 * Converts a single row based on the passed-in type (determined by {@link getRowType}
 *
 * @param $
 * @param tds
 * @param type
 */
const constructRow = (
  $: CheerioStatic,
  tds: Cheerio[],
  type: HRowType
): HRow => {
  switch (type) {
    case HRowType.HEADER:
    case HRowType.SUBHEADER:
    case HRowType.COMMENT:
      return constructTextRow($, tds, type);
    case HRowType.OR_COURSE:
      return constructOrCourseRow($, tds);
    case HRowType.PLAIN_COURSE:
      return constructPlainCourseRow($, tds);
    case HRowType.AND_COURSE:
    case HRowType.OR_OF_AND_COURSE:
      return constructMultiCourseRow($, tds, type);
    case HRowType.RANGE_LOWER_BOUNDED:
    case HRowType.RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS:
      return constructRangeLowerBoundedMaybeExceptions($, tds);
    case HRowType.RANGE_BOUNDED:
    case HRowType.RANGE_BOUNDED_WITH_EXCEPTIONS:
      return constructRangeBoundedMaybeExceptions($, tds);
    case HRowType.RANGE_UNBOUNDED:
      return constructRangeUnbounded($, tds);
    case HRowType.COMMENT_COUNT:
      throw new Error("We don't support comment counts yet!")
    default:
      return assertUnreachable(type);
  }
};

const constructTextRow = <T>(
  $: CheerioStatic,
  tds: Cheerio[],
  type: T
): TextRow<T> => {
  if (tds.length !== 2) {
    throw new Error(tds.toString());
  }
  const [c1, c2] = ensureLength(2, tds);
  const description = parseText(c1);
  const hour = parseHour(c2);
  return { hour, description, type };
};

const constructPlainCourseRow = (
  $: CheerioStatic,
  tds: Cheerio[]
): CourseRow<HRowType.PLAIN_COURSE> => {
  const [code, desc, hourCol] = ensureLength(3, tds);
  const { subject, classId } = parseCourseTitle(parseText(code));
  const description = parseText(desc);
  const hour = parseHour(hourCol);
  return { hour, description, type: HRowType.PLAIN_COURSE, subject, classId };
};

const constructOrCourseRow = (
  $: CheerioStatic,
  tds: Cheerio[]
): CourseRow<HRowType.OR_COURSE> => {
  const [code, desc] = ensureLength(2, tds);
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
  tds: Cheerio[],
  type: HRowType.AND_COURSE | HRowType.OR_OF_AND_COURSE
):
  | MultiCourseRow<HRowType.AND_COURSE>
  | MultiCourseRow<HRowType.OR_OF_AND_COURSE> => {
  // some ORs of ANDs don't have a third cell for hour column
  const [code, desc, hourCol] = ensureLengthAtLeast(2, tds);
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
  const hour = hourCol ? parseHour(hourCol) : 0;
  return {
    hour,
    type,
    description: descriptions.join(" and "),
    courses,
  };
};

const constructRangeLowerBoundedMaybeExceptions = (
  $: CheerioStatic,
  tds: Cheerio[]
):
  | WithExceptions<
      RangeLowerBoundedRow<HRowType.RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS>
    >
  | RangeLowerBoundedRow<HRowType.RANGE_LOWER_BOUNDED> => {
  const [desc, hourCol] = ensureLength(2, tds);
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

const constructRangeBoundedMaybeExceptions = (
  $: CheerioStatic,
  tds: Cheerio[]
):
  | RangeBoundedRow<HRowType.RANGE_BOUNDED>
  | WithExceptions<RangeBoundedRow<HRowType.RANGE_BOUNDED_WITH_EXCEPTIONS>> => {
  const [desc, hourCol] = ensureLength(2, tds);
  const hour = parseHour(hourCol);
  // text should match the form:
  // 1. CS 1000 to CS 5999
  // 2. CS 1000-CS 5999
  const text = parseText(desc);
  // should match the form [["CS 9999", "CS", "9999"], [...]]
  const matches = Array.from(text.matchAll(COURSE_REGEX));
  const [[, subject, classIdStart], [, , classIdEnd], ...exceptions] =
    ensureLengthAtLeast(2, matches);
  const result = {
    hour,
    subject,
    classIdStart: Number(classIdStart),
    classIdEnd: Number(classIdEnd),
  };
  if (exceptions.length > 0) {
    return {
      ...result,
      type: HRowType.RANGE_BOUNDED_WITH_EXCEPTIONS,
      exceptions: exceptions.map(([, subject, id]) => ({
        subject,
        classId: Number(id),
      })),
    };
  }
  return {
    ...result,
    type: HRowType.RANGE_BOUNDED,
  };
};

const constructRangeUnbounded = (
  $: CheerioStatic,
  tds: Cheerio[]
): RangeUnboundedRow<HRowType.RANGE_UNBOUNDED> => {
  const [desc, hourCol] = ensureLength(2, tds);
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
const parseCourseTitle = (parsedCourse: string) => {
  const [subject, classId] = ensureLength(2, parsedCourse.split(" "));
  return {
    subject,
    classId: Number(classId),
  };
};
