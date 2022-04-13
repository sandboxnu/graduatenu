import { assertUnreachable } from "@graduate/common";
import axios from "axios";
import * as cheerio from "cheerio";
import {
  CourseListBodyRowType,
  HTMLCatalog,
  HTMLCatalogCourseList,
  HTMLCatalogCourseListBodyRow,
} from "./types";

const loadCatalogHTML = async (url: string): Promise<CheerioStatic> => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    return $;
  } catch (error) {
    throw error;
  }
};

export const scrapeMajorDataFromCatalog = async (
  url: string
): Promise<HTMLCatalog> => {
  try {
    const $ = await loadCatalogHTML(url);
    // step 1: Transform scraped table into intermediate representation (IR)
    const transformedScrapedData = transformMajorDataFromCatalog($);

    return transformedScrapedData;
  } catch (error) {
    throw error;
  }
};

const transformMajorDataFromCatalog = async (
  $: CheerioStatic
): Promise<HTMLCatalog> => {
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
    prgramRequiredHours,
    yearVersion,
    majorName,
    courseLists: await courseLists,
  };
};

const transformCourseLists = async (
  $: CheerioStatic,
  requirementsContainer: Cheerio
): Promise<HTMLCatalogCourseList[]> => {
  // use a stack to keep track of the course list title and description
  const descriptions: string[] = [];
  const courseList: HTMLCatalogCourseList[] = [];

  const children = requirementsContainer.children();

  for (let i = 0; i < children.length; i += 1) {
    const element = children[i];
    if (element.name.includes("h")) {
      descriptions.push($(element).text());
    } else if (element.name === "table") {
      const tableDesc = descriptions.pop() || "";
      const courseTable = {
        description: tableDesc,
        courseBody: transformCourseListTable($, element),
      };
      courseList.push(courseTable);
    }
    // TODO: scrape all concentrations for business. only applicable to business
    else if (
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

const transformCourseListTable = (
  $: CheerioStatic,
  table: CheerioElement
): HTMLCatalogCourseListBodyRow[] => {
  const courseTable: HTMLCatalogCourseListBodyRow[] = [];

  $(table)
    .find("tbody > tr")
    .each((_idx: number, tr: CheerioElement) => {
      // different row type
      const trClass = tr.attribs["class"];
      const tdClass = $(tr).children()[0].attribs["class"];

      // const isCodeCol = Boolean($(tr).children()[0].attribs["class"]);

      let courseListBodyRowType: CourseListBodyRowType;
      if (trClass.includes("subheader")) {
        courseListBodyRowType = CourseListBodyRowType.SUBHEADER;
      } else if (trClass.includes("areaheader")) {
        courseListBodyRowType = CourseListBodyRowType.HEADER;
      } else if (trClass.includes("orclass")) {
        courseListBodyRowType = CourseListBodyRowType.OR_COURSE;
      } else if (tdClass) {
        if (tdClass !== "codecol") {
          throw Error(
            "Expected class to exist with value codecol. Please add this case to the compiler."
          );
        }

        courseListBodyRowType = CourseListBodyRowType.PLAIN_COURSE;
        if ($(tdClass).text().includes("and")) {
          courseListBodyRowType = CourseListBodyRowType.AND_COURSE;
        }
      } else {
        courseListBodyRowType = CourseListBodyRowType.COMMENT;
      }

      const courseListBodyRow = constructCourseListBodyRow(
        $,
        tr,
        courseListBodyRowType
      );
      courseTable.push(courseListBodyRow);
    });

  return courseTable;
};

const constructCourseListBodyRow = (
  $: CheerioStatic,
  tr: CheerioElement,
  type: CourseListBodyRowType
): HTMLCatalogCourseListBodyRow => {
  switch (type) {
    case CourseListBodyRowType.HEADER:
    case CourseListBodyRowType.SUBHEADER:
    case CourseListBodyRowType.COMMENT:
      return { ...constructCourseListBodyRowText($, tr), type };
    case CourseListBodyRowType.OR_COURSE:
    case CourseListBodyRowType.PLAIN_COURSE:
      return { ...constructCourseListBodyRowSingle($, tr), type };
    case CourseListBodyRowType.AND_COURSE:
      return { ...constructCourseListBodyRowMany($, tr), type };
    default:
      return assertUnreachable(type);
    // $(tr)
    //   .children()
    //   .each((_idx: number, td: CheerioElement) => {
    //     const tdClass = td.attribs["class"];

    //         description = $(td).text();
    //         break
    //       case CourseListBodyRowType.OR_COURSE:
    //         const hourCol = $(tr).prev().children().last().text();
    //         hour = parseInt(hourCol.split('-')[0]) || 0;
    //         courseTitle = String($(td).text()).replaceAll(" ", " ");
    //         break
    //       case CourseListBodyRowType.PLAIN_COURSE:
    //         courseTitle = String($(td).text()).replaceAll(" ", " ");
    //         break
    //       case CourseListBodyRowType.AND_COURSE:
    //         courseTitle = String($(td).text()).replaceAll(" ", " ");
  }
  // if (tdClass != null) {
  //   if (tdClass.includes("codecol")) {
  //     if (courseListBodyRowType === CourseListBodyRowType.OR_COURSE) {
  //       const hourCol = $(tr).prev().children().last().text();
  //       hour = parseInt(hourCol.split('-')[0]) || 0;
  //     } else if (courseListBodyRowType === CourseListBodyRowType.AND_COURSE) {
  //       $(tdClass).text()
  //     }

  //     courseTitle = String($(td).text()).replaceAll(" ", " ");
  //     courseListRow["courseTitle"] = courseTitle;
  //   }

  //   if (tdClass.includes("hourscol")) {
  //     hour = parseInt($(td).text()) || 0;
  //   }
  // } else {
  //   description = $(td).text();
  // }
};

const constructNestedLinks = ($: CheerioStatic, element: CheerioElement) => {
  const base = "https://catalog.northeastern.edu";
  const concentrationsTag = "#concentrationrequirementstext";
  return Array.from($(element).find("li > a"))
    .map((link) => $(link).attr("href"))
    .map((link) => {
      const url = new URL(link, base);
      url.hash = concentrationsTag;
      return url.toString();
    });
};
