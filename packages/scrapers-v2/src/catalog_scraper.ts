import { assertUnreachable, unimpl } from "@graduate/common";
import axios from "axios";
import * as cheerio from "cheerio";
import {
  COURSE_REGEX,
  RANGE_1_REGEX,
  RANGE_2_REGEX_TYPE_1,
  RANGE_2_REGEX_TYPE_2,
} from "./constants";
import {
  CourseRow,
  HDocument,
  HRow,
  HRowType,
  HSection,
  MultiCourseRow,
  RangeRow,
  TextRow,
} from "./types";

const loadCatalogHTML = async (url: string): Promise<CheerioStatic> => {
  try {
    const { data } = await axios.get(url);
    return cheerio.load(data);
  } catch (error) {
    throw error;
  }
};

export const scrapeMajorDataFromCatalog = async (
  url: string
): Promise<HDocument> => {
  try {
    const $ = await loadCatalogHTML(url);
    // step 1: Transform scraped table into intermediate representation (IR)
    return transformMajorDataFromCatalog($);
  } catch (error) {
    throw error;
  }
};

const transformMajorDataFromCatalog = async (
  $: CheerioStatic
): Promise<HDocument> => {
  const majorName: string = $("#site-title").find("h1").text().trim();
  const catalogYear: string = $("#edition").text().split(" ")[0];
  const yearVersion: number = parseInt(catalogYear.split("-")[0]);

  const requirementsContainer = $("#programrequirementstextcontainer");
  const courseLists = transformCourseLists($, requirementsContainer);

  const prgramRequiredHeading = requirementsContainer
    .find("h2")
    .filter(
      (_idx: number, element: CheerioElement) =>
        $(element).text().includes("Program") &&
        $(element).text().includes("Requirement")
    );
  const prgramRequiredHours =
    Number(
      prgramRequiredHeading
        .next()
        .text()
        .split(/[\s\xa0]+/)[0]
    ) || 0;

  return {
    programRequiredHours: prgramRequiredHours,
    yearVersion,
    majorName,
    sections: await courseLists,
  };
};

const transformCourseLists = async (
  $: CheerioStatic,
  requirementsContainer: Cheerio
): Promise<HSection[]> => {
  // use a stack to keep track of the course list title and description
  const descriptions: string[] = [];
  const courseList: HSection[] = [];

  for (const element of requirementsContainer.children().toArray()) {
    if (element.name.includes("h")) {
      descriptions.push(parseText($(element)));
    } else if (element.name === "table") {
      const tableDesc = descriptions.pop() || "";
      const courseTable = {
        description: tableDesc,
        entries: transformCourseListTable($, element),
      };
      courseList.push(courseTable);
    } else if (
      element.name === "ul" &&
      $(element).prev().text().includes("concentration")
    ) {
      const links = constructNestedLinks($, element);
      const mapped = await Promise.all(links.map(loadCatalogHTML));
      const containerId = "#concentrationrequirementstextcontainer";
      const concentrations = await Promise.all(
        mapped.map((concentrationPage) =>
          transformCourseLists(
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
  const base = "https://catalog.northeastern.edu";
  const concentrationsTag = "#concentrationrequirementstext";
  return $(element)
    .find("li > a")
    .toArray()
    .map((link) => $(link).attr("href"))
    .map((link) => {
      const url = new URL(link, base);
      url.hash = concentrationsTag;
      return url.toString();
    });
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

  const tdText = td.text();
  if (RANGE_1_REGEX.test(tdText)) {
    return HRowType.RANGE_1;
  } else if (
    RANGE_2_REGEX_TYPE_1.test(tdText) ||
    RANGE_2_REGEX_TYPE_2.test(tdText)
  ) {
    return HRowType.RANGE_2;
  }

  return HRowType.COMMENT;
};

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
    case HRowType.RANGE_1:
      return constructRange1Row($, tr);
    case HRowType.RANGE_2:
      return constructRange2Row($, tr);
    case HRowType.RANGE_3:
      return unimpl();
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
  const title = parseText(code);
  const description = parseText(desc);
  const hour = parseHour(hourCol);
  return { hour, description, type: HRowType.PLAIN_COURSE, title: title };
};

const constructOrCourseRow = (
  $: CheerioStatic,
  tr: CheerioElement
): CourseRow<HRowType.OR_COURSE> => {
  const [code, desc] = ensureLength(2, tr.children).map($);
  // remove "or "
  const title = parseText(code).substring(3).trim();
  const description = parseText(desc);
  // there may be multiple courses in the OR, so we can't backtrack
  return { hour: 0, description, type: HRowType.OR_COURSE, title: title };
};

const constructMultiCourseRow = (
  $: CheerioStatic,
  tr: CheerioElement
): MultiCourseRow<HRowType.AND_COURSE> => {
  const [code, desc, hourCol] = ensureLength(3, tr.children).map($);
  const titles = code.find(".code").toArray().map($).map(parseText);
  const firstDescription = desc.contents().first().text();
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
  const courses = titles.map((title, i) => ({
    title,
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

const constructRange1Row = (
  $: CheerioStatic,
  tr: CheerioElement
): RangeRow<HRowType.RANGE_1> => {
  const [desc, hourCol] = ensureLength(2, tr.children).map($);
  const hour = parseHour(hourCol);
  // text should match the form:
  // CS 9999 or higher, except CS 9999, CS 9999, CS 3999,... <etc>
  const text = desc.text();
  // should match the form [["CS 9999", "CS", "9999"], [...]]
  const matches = Array.from(text.matchAll(COURSE_REGEX));
  const [[, subject, id], ...exceptions] = ensureLengthAtLeast(1, matches);
  return {
    type: HRowType.RANGE_1,
    hour,
    subjects: [{ subject, classIdStart: Number(id), classIdEnd: 9999 }],
    exceptions: exceptions.map(([, subject, id]) => ({
      subject,
      classId: Number(id),
    })),
  };
};

const constructRange2Row = (
  $: CheerioStatic,
  tr: CheerioElement
): RangeRow<HRowType.RANGE_2> => {
  const [desc, hourCol] = ensureLength(2, tr.children).map($);
  const hour = parseHour(hourCol);
  // text should match the form:
  // 1. CS 1000 to CS 5999
  // 2. CS 1000-CS 5999
  const text = desc.text();
  // should match the form [["CS 9999", "CS", "9999"], [...]]
  const matches = Array.from(text.matchAll(COURSE_REGEX));
  const [[, subject, classIdStart], [, , classIdEnd], ..._rest] =
    ensureLengthAtLeast(2, matches);
  return {
    type: HRowType.RANGE_2,
    hour,
    subjects: [
      {
        subject,
        classIdStart: Number(classIdStart),
        classIdEnd: Number(classIdEnd),
      },
    ],
    exceptions: [],
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
