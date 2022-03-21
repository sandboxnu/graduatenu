import * as cheerio from "cheerio";
import { Major, IMajorRequirementGroup, Concentration } from "@graduate/common";
import { createRequirementGroup } from "./reqGroup_scraper";
import { OPTIONAL_CONCENTRATION } from "./scraper_constants";
import Axios from "axios";

/**
 * Scrapes the major data from the given course catalog URL.
 * @param link the URL string of the course catalog page to be parsed
 */
function catalogToMajor(link: string): Promise<Major> {
  return new Promise<Major>((resolve, reject) => {
    Axios.get(link)
      .then((r) => cheerio.load(r.data))
      .then(($) => scrapeMajorDataFromCatalog($))
      .then((scrapedMajor: Major) => {
        resolve(scrapedMajor);
      })
      .catch(function (err: string) {
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
    let catalogYear: string = $("#edition").text().split(" ")[0];
    let yearVersion: number = parseInt(catalogYear.split("-")[0]);
    let resultArray = createRequirementGroupMap($);
    const [requirementGroupMap, concentrationOptions, totalCreditsRequired] =
      resultArray;
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
        let requirementGroup: IMajorRequirementGroup | undefined =
          createRequirementGroup($, rows, current_header);
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
    let requirementGroup: IMajorRequirementGroup | undefined =
      createRequirementGroup($, rows, current_header);
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
// catalogToMajor("").then((scrapedMajor: Major) => {
//   //uncomment following lines to log output.
//   // console.log("--------------------Parsed major object--------------------");
//   // console.log(JSON.stringify(scrapedMajor));
// });
