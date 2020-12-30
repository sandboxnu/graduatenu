var cheerio = require("cheerio");
var fs = require("fs");
import {
  Major,
  IMajorRequirementGroup,
  Concentration,
} from "../../../common/types";
import { createRequirementGroup } from "./reqGroup_scraper";

const rp = require("request-promise");

export const ANDSectionHeader: string[] = [
  "Intermediate and Advanced Biology Electives",
  "History Electives",
  // "Sociology Electives",
];

export const SubheaderTagSet: string[] = [
  "Choose one of the two options.",
  "Complete two courses for one of the following science categories:",
  "Students are required to complete one of the following foci (two courses total):",
];

// Dictionary for ORSection keywords, maps from keyword/phrase -> number of credits
export const ORTagMap: { [key: string]: number } = {
  "Then complete one of the following:": 4,
  "Choose one of the following:": 4,
  "Complete one of the following:": 4,
  "Complete one of the following: ": 4,
  "Complete one course from the following:": 4,
  "Complete two of the following:": 8,
  "Complete three of the following:": 12,
  "Complete four of the following:": 16,
  "Complete six of the following:": 24,
  "Complete one of the following sequences:": 10,
  "Complete two courses for one of the following science categories:": 10,
  "Complete five courses from the following:": 20,
  "Complete two courses from the following lists:": 8,
  "Students are required to complete one of the following foci (two courses total):": 8,
  "Complete one of the following courses. This course may also be used to fulfill an additional English requirement below:": 4,
  "Complete at least two of the following:": 8,
  "Complete four economics electives with no more than two below 3000:": 16,
  "Complete one course from one of the following groups:": 4,
  "Take two courses, at least one of which is at the 4000 or 5000 level, from the following:": 8,
  "Complete one of the following courses not already taken:": 4,
  "Complete two of the following courses not already taken:": 8,
  "Complete two courses from the following:": 8,
  "Complete two biology courses (with corequisite labs if offered). Choose one of these two courses from the following list:": 8,
  "Complete one introductory course from the following:": 4,
  "Complete one capstone experience from the following:": 4,
  "Complete three courses from the following:": 12,
  "Complete either one computer science capstone or the physics capstone:": 4,
  "Complete one of the following lecture/lab pairs. PHYS 1145/PHYS 1146 is recommended:": 4,
  "Choose one:": 4,
  "Choose one": 4,
  "Complete four courses from the following:": 16,
  "Complete any six courses as long as prerequisites have been met. At least two must be a 3000-level course. ": 24,
  "Choose one of the two options.": 12,
  // TODO: Data-Science-Related Electives: "Complete six courses from categories A and B, at least three of which must be from B"
};

export const IgnoreTags: string[] = [
  "The following courses are used in other areas of the major:",
  "The following courses are fulfilled through the computer science requirement:",
  "Note: The following courses do not count toward this concentration:",
];

// Dictionary for RANGESection keywords, maps from keyword/phrase -> number of credits
export const RANGETagMap: { [key: string]: number } = {
  "Complete 4 credits of CS, IS, or DS classes that are not already required. Choose courses within the following ranges:": 4,
  "Complete 4 credits of CS, IS, or DS courses that are not already required. Choose courses within the following range:": 4,
  "Complete four credits of CS, IS, or DS classes that are not already required. Choose courses within the following ranges:": 4,
  "Complete 8 credits of CS, IS or DS classes that are not already required. Choose courses within the following ranges:": 8,
  "Complete 8 credits of CS, IS or, DS classes that are not already required. Choose courses within the following ranges:": 8,
  "Complete 8 credits of CS, IS, or DS classes that are not already required. Choose courses within the following ranges:": 8,
  "Complete 8 credits of upper-division CS, IS, or DS classes that are not already required. Choose courses within the following ranges:": 8,
  "Complete eight credits of CS, IS or, DS classes that are not already required. Choose courses within the following ranges:": 8,
  "Complete eight credits of CS, IS or DS classes that are not already required. Choose courses within the following ranges:": 8,
  "Complete 12 credits of CS, IS or, DS classes that are not already required. Choose courses within the following ranges:": 12,
  "Complete 12 credits of CS, IS, or DS classes that are not already required. Choose courses within the following ranges:": 12,
  "Complete 12 credits of upper-division CS, IS, and DS courses that are not already required. Choose courses within the following ranges:": 12,
  "Complete twelve credits of CS, IS or DS classes that are not already required. Choose courses within the following ranges:": 12,
  "Complete 16 credits of CS, IS, or DS classes that are not already required. Choose courses within the following ranges:": 16,
  "Complete 16 credits of upper-division CS, IS, or DS courses that are not already required. Choose courses within the following ranges:": 16,

  "Complete one of the following, not taken to fulfill previous requirements:": 4,
  "Complete one from the following:": 4,
  "Complete four credits from the following:": 16,
  "Complete four courses in the following range:": 16,
  "Complete three courses in the following range:": 12,

  "Complete four ECON electives with at least two numbered at ECON 3000 or above.": 16,

  "Choose the second elective from the following list:": 4,
  "Complete three intermediate/advanced-level courses:": 12,
  "Intermediate/Advanced History Cluster ": 12,
  "Complete one advanced-level course:": 4,
  // "Complete one sociology elective in each of the following ranges:": 4,

  "Complete four credits of CS, CY, DS, or IS classes that are not already required. Choose courses within the following ranges:": 4,
  "Complete 4 credits of CS, CY, DS, or IS classes that are not already required. Choose courses within the following ranges:": 4,
  "Complete 4 credits of CS, CY, DS, or IS courses that are not already required. Choose courses within the following range:": 4,
  "Complete 8 credits of CS, CY, DS, or IS classes that are not already required. Choose courses within the following ranges:": 8,
  "Complete 8 credits of CS, CY, DS or IS classes that are not already required. Choose courses within the following ranges:": 8,
  "Complete 8 credits of upper-division CS, CY, DS, or IS classes that are not already required. Choose courses within the following ranges:": 8,
  "Complete eight credits of CS, CY, DS, or IS classes that are not already required. Choose courses within the following ranges:": 8,
  "Complete twelve credits of CS, CY, DS, or IS classes that are not already required. Choose courses within the following ranges:": 12,
  "Complete 12 credits of CS, CY, DS, or IS classes that are not already required. Choose courses within the following ranges:": 12,
  "Complete 12 credits of upper-division CS, CY, DS, or IS courses that are not already required. Choose courses within the following ranges:": 12,
  "Complete 12 credits of upper-division CS, CY, DS, or IS classes that are not already required. Choose courses within the following ranges:": 12,
  "Comment: Complete 12 credits of CS, CY, DS, or IS classes that are not already required. Choose courses within the following ranges:": 12,
  "Complete 16 credits of upper-division CS, CY, DS, or IS courses that are not already required. Choose courses within the following ranges:": 16,
  "Complete one course from the following": 4,
  "Complete four credits from the following list, not taken to fulfill previous requirements:": 4,
  "Complete 4 Economics elective courses from the following ranges with no more than 2 at the ECON 1200 – ECON 1999 range:": 4,
  "Complete 4 ECON electives that are found in the following ranges, with at least two numbered at ECON 3000 or above:": 16,
  "Complete two courses in the following range:": 8,

  "Complete four credits of CS,CY, DS, or IS classes that are not already required. Choose courses within the following ranges:": 16,
  "Complete one course not already required in the following range:": 4,
  "Complete 4 credits of CS, CY, DS, or IS classes that are not already required. Choose courses within the following ranges:	": 4,
  "Complete four credits of CS, CY, DS, or IS classes that are not already required. Choose courses within the following ranges:	": 4,
};

// Set for RANGESections that only indicate the major in which they are allowed to take electives
export const RANGECourseSet: Array<string> = [
  "ARTD",
  "ARTE",
  "ARTF",
  "ARTG",
  "ARTH",
  "ARTS",
  "CRIM",
  "ENGL",
  "GAME",
  "HIST",
  "JRNL",
  "PHIL",
];

export const ValidSubjects: string[] = [
  "ARTD",
  "ARTE",
  "ARTF",
  "ARTG",
  "ARTH",
  "ARTS",
  "BIOL",
  "CHEM",
  "COMM",
  "CRIM",
  "CS",
  "CY",
  "DS",
  "ECON",
  "EECE",
  "EEMB",
  "ENGL",
  "ENVR",
  "GAME",
  "HSCI",
  "IS",
  "JRNL",
  "MATH",
  "PHIL",
  "PHIL",
  "PHTH",
  "PHYS",
  "POLS",
  "PSYC",
  "SOCL",
];

const OPTIONAL_CONCENTRATION = ["Computer Science and Political Science, BS"];

/**
 * Scrapes the major data from the given course catalog URL.
 * @param link the URL string of the course catalog page to be parsed
 */
function catalogToMajor(link: string): Promise<Major> {
  return new Promise<Major>((resolve, reject) => {
    var options = {
      uri: link,
      transform: function(body: string) {
        return cheerio.load(body);
      },
    };

    rp(options)
      .then(($: CheerioStatic) => scrapeMajorDataFromCatalog($))
      .then((scrapedMajor: Major) => {
        resolve(scrapedMajor);
      })
      .catch(function(err: string) {
        console.log(err);
      });
  });
}

/**
 * Produce a major object from the loaded up cheerio DOM.
 * @param $ the Cheeriostatic selector function used to query the DOM.
 */
function scrapeMajorDataFromCatalog($: CheerioStatic): Promise<Major> {
  return new Promise<Major>((resolve, reject) => {
    let name: string = $("#content .page-title").text();
    let catalogYear: string = $("#edition")
      .text()
      .split(" ")[0];
    let yearVersion: number = parseInt(catalogYear.split("-")[0]);
    let resultArray = createRequirementGroupMap($);
    const [
      requirementGroupMap,
      concentrationOptions,
      totalCreditsRequired,
    ] = resultArray;
    let requirementGroups: string[] = Object.keys(requirementGroupMap);
    let major: Major = {
      name,
      requirementGroups,
      requirementGroupMap,
      yearVersion,
      isLanguageRequired: false,
      nupaths: [],
      totalCreditsRequired,
      concentrations: {
        minOptions:
          concentrationOptions.length > 0 &&
          !OPTIONAL_CONCENTRATION.includes(name)
            ? 1
            : 0,
        maxOptions: concentrationOptions.length > 0 ? 1 : 0,
        concentrationOptions,
      },
    };
    resolve(major);
  });
}

/**
 * A function that creates the Requirment group map and concentrations for a Major.
 * @param $ the Cheeriostatic selector function used to query the DOM.
 */
function createRequirementGroupMap(
  $: CheerioStatic
): [{ [key: string]: IMajorRequirementGroup }, Concentration[], number] {
  let requirementGroupMap: { [key: string]: IMajorRequirementGroup } = {};
  let is_concentration = false;
  let is_credits = false;
  let ignore_tables = false;
  let credits: number = 0;
  let current_header = "";
  let current_concentration = "";
  let concentrations: Concentration[] = [];
  $("#programrequirementstextcontainer")
    .children()
    .each((index: number, element: CheerioElement) => {
      if (element.name == "h2") {
        const elementText = $(element).text();
        // Determines if the major has concentrations based on if the header name includes Concentrations or Options
        is_concentration =
          elementText.includes("Concentration") ||
          elementText.includes("Options");
        is_credits =
          elementText.includes("Program") &&
          elementText.includes("Requirement");
        ignore_tables = elementText.includes("GPA Requirement");
        current_header = $(element).text();
      }
      if (element.name == "h3") {
        // Determines the name of the current concentration based on the subheader
        const elementText = $(element).text();
        if (elementText.includes("Concentration")) is_concentration = true;
        current_concentration = elementText;
        current_concentration = current_concentration.replace(
          "Concentration in ",
          ""
        );
        current_concentration = current_concentration.replace(
          "Concentration: ",
          ""
        );
      }
      if (element.name === "p" && is_credits) {
        // parse the credits value from the bottom of the page or 0 if it's not there
        credits =
          Number(
            $(element)
              .text()
              .split(/[\s\xa0]+/)[0]
          ) || 0;
        is_credits = false;
      }
      // Parsing as a normal req group
      if (
        !ignore_tables &&
        element.name == "table" &&
        element.attribs["class"] == "sc_courselist"
      ) {
        if (!is_concentration) {
          requirementGroupMap = tableToReqGroup(
            $,
            element,
            current_header,
            requirementGroupMap
          );
        } else {
          // Parsing as a concentration
          let groups = tableToReqGroup($, element, current_header);
          concentrations.push({
            name:
              current_concentration.length > 0
                ? current_concentration
                : Object.keys(groups)[0],
            requirementGroups: Object.keys(groups),
            requirementGroupMap: groups,
          });
        }
      }
    });
  return [requirementGroupMap, concentrations, credits];
}

function tableToReqGroup(
  $: CheerioStatic,
  table: CheerioElement,
  current_header: string,
  requirementGroupMap: { [key: string]: IMajorRequirementGroup } = {}
): { [key: string]: IMajorRequirementGroup } {
  let rows: CheerioElement[] = [];
  $(table)
    .find("tr")
    .each((index: number, tableRow: CheerioElement) => {
      let currentRow: Cheerio = $(tableRow);
      if (currentRow.find("span.areaheader").length !== 0 && rows.length > 0) {
        let requirementGroup:
          | IMajorRequirementGroup
          | undefined = createRequirementGroup($, rows, current_header);
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
      | undefined = createRequirementGroup($, rows, current_header);
    if (requirementGroup) {
      if (requirementGroup.requirements)
        requirementGroupMap[requirementGroup.name] = requirementGroup;
    }
  }
  return requirementGroupMap;
}

module.exports = catalogToMajor;

/**
 * testing. move to test file.
 */
catalogToMajor("").then((scrapedMajor: Major) => {
  //uncomment following lines to log output.

  console.log("--------------------Parsed major object--------------------");
  console.log(JSON.stringify(scrapedMajor));
});
