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

const transformMajorDataFromCatalog = ($: CheerioStatic): HTMLCatalog => {
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
    courseLists,
  };
};

const transformCourseLists = (
  $: CheerioStatic,
  requirementsContainer: Cheerio
): HTMLCatalogCourseList[] => {
  // use a stack to keep track of the course list title and description
  let descriptions: string[] = [];
  let courseList: HTMLCatalogCourseList[] = [];

  requirementsContainer
    .children()
    .each((_idx: number, element: CheerioElement) => {
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
      // TODO: scrap all concentrations for business. only applicable to business
      // else if (element.name === 'ul' && $(element).prev().text().includes("concentration")) {
      //   const link = $(element).find("li > a").attr('href');
      // }
    });
  return courseList;
};

const transformCourseListTable = (
  $: CheerioStatic,
  table: CheerioElement
): HTMLCatalogCourseListBodyRow[] => {
  let courseTable: HTMLCatalogCourseListBodyRow[] = [];

  $(table)
    .find("tbody > tr")
    .each((_idx: number, tr: CheerioElement) => {
      // different row type
      const trClass = tr.attribs["class"];
      const firstTdClass = $(tr).children()[0].attribs["class"];

      let courseListBodyRowType: CourseListBodyRowType;
      if (trClass.includes("subheader")) {
        courseListBodyRowType = CourseListBodyRowType.SUBHEADER;
      } else if (trClass.includes("areaheader")) {
        courseListBodyRowType = CourseListBodyRowType.HEADER;
      } else if (trClass.includes("orclass")) {
        courseListBodyRowType = CourseListBodyRowType.OR_COURSE;
      } else if (firstTdClass != null) {
        courseListBodyRowType = CourseListBodyRowType.PLAIN_COURSE;
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
  courseListBodyRowType: CourseListBodyRowType
): HTMLCatalogCourseListBodyRow => {
  let hour: number = 0;
  let description: string = "";
  let courseTitle: string = "";
  const courseListRow: {
    [key in keyof HTMLCatalogCourseListBodyRow]: HTMLCatalogCourseListBodyRow[key];
  } = {
    type: courseListBodyRowType,
    hour,
    description,
  };
  $(tr)
    .children()
    .each((_idx: number, td: CheerioElement) => {
      const tdClass = td.attribs["class"];
      if (tdClass != null) {
        if (tdClass.includes("codecol")) {
          if (tdClass.includes("orclass")) {
            hour = parseInt($(tr).prev().children().last().text()) || 0;
          }
          courseTitle = $(td).text();
          courseListRow["courseTitle"] = courseTitle;
        }

        if (tdClass.includes("hourscol")) {
          hour = parseInt($(td).text()) || 0;
        }
      } else {
        description = $(td).text();
      }
    });
  courseListRow["hour"] = hour;
  courseListRow["description"] = description;

  return courseListRow;
};
