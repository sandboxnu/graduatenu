var cheerio = require("cheerio");
import { Major, IMajorRequirementGroup, Concentrations } from "graduate-common";
import { createRequirementGroup } from "./reqGroup_scraper";

const rp = require("request-promise");

export const SubheaderTagSet: Array<string> = [
  "Complete two courses for one of the following science categories:",
  "Students are required to complete one of the following foci (two courses total):",
];

// Dictionary for ORSection keywords, maps from keyword/phrase -> number of credits
export const ORTagMap: { [key: string]: number } = {
  "Complete one of the following:": 4,
  "Then complete one of the following:": 4,
  "Complete one of the following sequences:": 10,
  "Complete two of the following:": 8,
  "Complete three of the following:": 12,
  "Complete two courses for one of the following science categories:": 10,
  "Complete five courses from the following:": 20,
  "Complete one course from the following:": 4,
  "Complete two courses from the following lists:": 8,
  "Students are required to complete one of the following foci (two courses total):": 8,
  "Complete one of the following courses. This course may also be used to fulfill an additional English requirement below:": 4,
  "Complete at least two of the following:": 8,
  "Complete four of the following:": 16,
  "Complete six of the following:": 24,
  "Complete four economics electives with no more than two below 3000:": 16,

  "Complete one course from one of the following groups:": 4,
  "Take two courses, at least one of which is at the 4000 or 5000 level, from the following:": 8,
  // TODO: Data-Science-Related Electives: "Complete six courses from categories A and B, at least three of which must be from B"
};

// Dictionary for RANGESection keywords, maps from keyword/phrase -> number of credits
export const RANGETagMap: { [key: string]: number } = {
  "Complete 4 credits of CS, IS, or DS classes that are not already required. Choose courses within the following ranges:": 4,
  "Complete 4 credits of CS, IS, or DS courses that are not already required. Choose courses within the following range:": 4,
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
  "Complete four courses in the following range:": 16,
  "Complete three courses in the following range:": 12,

  "Complete four ECON electives with at least two numbered at ECON 3000 or above.": 16,
};

// Set for RANGESections that only indicate the major in which they are allowed to take electives
export const RANGECourseSet: Array<string> = [
  "GAME",
  "CRIM",
  "ENGL",
  "ARTD",
  "ARTE",
  "ARTF",
  "ARTG",
  "ARTH",
  "ARTS",
  "JRNL",
  "PHIL",
];

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
      // concentrations: {
      //   minOptions: 0,
      //   maxOptions: 0,
      //   requirementGroupMap: [],
      // },
    };
    resolve(major);
  });
}

/**
 * A function that creates the Requirment group map for a Major.
 * @param $ the Cheeriostatic selector function used to query the DOM.
 */
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

module.exports = catalogToMajor;

/**
 * testing. move to test file.
 */
catalogToMajor(
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/economics-bs/#programrequirementstext"
).then((scrapedMajor: Major) => {
  //uncomment following lines to log output.
  //console.log("--------------------Parsed major object--------------------");
  //console.log(JSON.stringify(scrapedMajor));
});
