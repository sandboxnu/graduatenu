import { assertUnreachable } from "@graduate/common";
import axios from "axios";
import * as cheerio from "cheerio";
import {
  CourseRow,
  CourseRowType,
  HDocument,
  HRow,
  HRowType,
  HSection,
  MultiCourseRow,
  MultiCourseRowType,
  TextRow,
  TextRowType,
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
      return constructOrCourseRow($, tr, type);
    case HRowType.PLAIN_COURSE:
      return constructPlainCourseRow($, tr, type);
    case HRowType.AND_COURSE:
      return constructMultiCourseRow($, tr, type);
    default:
      return assertUnreachable(type);
  }
};

const constructTextRow = (
  $: CheerioStatic,
  tr: CheerioElement,
  type: TextRowType
): TextRow => {
  const [c1, c2] = ensureLength(2, tr.children).map($);
  const description = parseText(c1);
  const hour = parseHour(c2);
  return { hour, description, type };
};

const constructPlainCourseRow = (
  $: CheerioStatic,
  tr: CheerioElement,
  type: CourseRowType
): CourseRow => {
  const [code, desc, hourCol] = ensureLength(3, tr.children).map($);
  const title = parseText(code);
  const description = parseText(desc);
  const hour = parseHour(hourCol);
  return { hour, description, type, title: title };
};

const constructOrCourseRow = (
  $: CheerioStatic,
  tr: CheerioElement,
  type: CourseRowType
): CourseRow => {
  const [code, desc] = ensureLength(2, tr.children).map($);
  // remove "or "
  const title = parseText(code).substring(3).trim();
  const description = parseText(desc);
  // there may be multiple courses in the OR, so we can't backtrack
  return { hour: 0, description, type, title: title };
};

const constructMultiCourseRow = (
  $: CheerioStatic,
  tr: CheerioElement,
  type: MultiCourseRowType
): MultiCourseRow => {
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
  return { hour, type, description: descriptions.join(" and "), courses };
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
