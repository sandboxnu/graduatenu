var cheerio = require("cheerio");
import {
  Major,
  IMajorRequirementGroup,
} from "../../../frontend/src/models/types";
import { createRequirementGroup } from "./reqGroup_scraper";

const rp = require("request-promise");

// Dictionary for ORSection keywords, maps from keyword/phrase -> number of credits
export const ORTagMap: { [key: string]: number } = {
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
export const RANGETagMap: { [key: string]: number } = {
  "Complete 8 credits of CS, IS or DS classes that are not already required. Choose courses within the following ranges:": 8,
  "Complete 4 credits of CS, IS, or DS classes that are not already required. Choose courses within the following ranges:": 4,
  "Complete 8 credits of CS, IS or, DS classes that are not already required. Choose courses within the following ranges:": 8,
  "Complete eight credits of CS, IS or, DS classes that are not already required. Choose courses within the following ranges:": 8,
  "Complete 12 credits of CS, IS or, DS classes that are not already required. Choose courses within the following ranges:": 12,
  "Complete 12 credits of CS, IS, or DS classes that are not already required. Choose courses within the following ranges:": 12,
  "Complete 12 credits of upper-division CS, IS, and DS courses that are not already required. Choose courses within the following ranges:": 12,
  "Complete twelve credits of CS, IS or DS classes that are not already required. Choose courses within the following ranges:": 12,

  "Complete one from the following:": 4,
  "Complete four courses in the following range:": 16,
  "Complete three courses in the following range:": 12,
};

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
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-communication-studies-bs/#programrequirementstext"
).then((scrapedMajor: Major) => {
  //uncomment following lines to log output.
  console.log("--------------------Parsed major object--------------------");
  console.log(JSON.stringify(scrapedMajor));
});
