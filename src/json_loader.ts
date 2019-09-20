/**
 * This file has functions that load the classmaps that json_parser.js requires in order to lookup course information.
 */

import { createWriteStream, existsSync, PathLike, readFile, unlink } from "fs";
import { get } from "https";
import { INEUClassMap, INEUParentMap } from "./types";

// the year
const YEAR: number = 2019;

// the possible seasons to choose from.
// note that "years" begin in the fall of the previous year.
// [Fall, Spring, SummerI, SummerFUll, SummerII]
const SEASONS: number[] = [10, 30, 40, 50, 60];

const SEASON_LINKS: string[] =
SEASONS.map((season) => "https://searchneu.com/data/v2/getTermDump/neu.edu/" + YEAR + season + ".json");

/**
 * Provides an array of the links to the classMap files for a specified year.
 * @param year The 4-digit year to retrieve links for
 * @returns The strings of the links for the five files.
 */
const getClassMapLinks = (year: number): string[] =>
SEASONS.map((season) => "https://searchneu.com/data/v2/getTermDump/neu.edu/" + year + season + ".json");

/**
 * Provides an array of filepath locations to the classMap files based on a provided year.
 * @param year The target year. expected as a string or number. in the form "2019".
 * @returns The names of the five files.
 */
const getClassMapFilePaths = (year: number): string[] => SEASONS.map((season) => "./" + year + season + ".json");

const SEASON_PATHS: string[] = SEASONS.map((season) => "./" + YEAR + season + ".json");

/**
 * Grabs a file as JSON text.
 * @param inputLocation The filepath of the input file to convert to JSON.
 * @returns The resulting promise, resolved with the parsed JSON.
 */
const getFileAsJson = (inputLocation: string | PathLike): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    readFile(inputLocation, (err, data) => {
      if (err) { reject(err); }
      try {
        const parsedJSON = JSON.parse(data.toString());
        resolve(parsedJSON);
      } catch (err) {
        reject(err);
      }
    });
  });
};

/**
 * Downloads a file from a specified link, to a specified filepath. Only downloads if file does not exist.
 * @param url The url to download from.
 * @param dest The destination file path.
 * @returns The resulting promise, resolved with "Found" or "Downloaded" upon completion.
 */
const download = (url: string, dest: string | PathLike): Promise<string> => new Promise<string>((resolve, reject) => {
  if (existsSync(dest)) {
    // console.log("File " + dest + " found, skipping download.");
    resolve("Found");
  } else {
    // console.log("File " + dest + " not found, downloading from " + url);

    const file = createWriteStream(dest);
    const request = get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close();  // close() is async
        resolve("Downloaded");
      });
    }).on("error", (err) => { // Handle errors
      unlink(dest, (err1) => {
        if (err) {
          throw err1;
        }
      }); // Delete the file async. (But we don't check the result)
      reject(err);
    });
  }
});

/**
 * Downloads all the files for a specified year, and attaches the produced JSONS to an object.
 * @param year the 4-digit year.
 * @param classMapParent The parent object to attach classMaps to, under property termId.
 * @returns Whether or not the operation succeeded. "success" or "failure"
 */
const addClassMapsOfYear = async (year: number, classMapParent: INEUParentMap): Promise<string> => {
  const links: string[] = getClassMapLinks(year);
  const paths: string[] = getClassMapFilePaths(year);

  // convert the above into an array of download calls.
  // assume they are the same length.
  const downloads: Array<Promise<string>> = [];
  for (let i = 0; i < links.length; i += 1) {
    downloads.push(download(links[i], paths[i]));
  }

  // attempt to download everything, and wait until they finish.
  const downloadsResult: string[] = await Promise.all(downloads);

  // if the download succeeds, then try and read everything as JSON
  const jsons: Array<Promise<any>> = paths.map((path) => getFileAsJson(path));
  const jsonsResult: any[] = await Promise.all(jsons);

  // if reading as JSON succeeds, then add all the JSONS to parent classMap.
  jsonsResult.forEach((item: any) => {
    const classMap: INEUClassMap = item;
    const termId: number = classMap.termId;
    classMapParent.classMapMap["" + termId] = classMap;
  });

  return "success";
};

/**
 * Produces the classMapParent object containing all classMap course information.
 * @returns A promise, resolved with the classMapParent object.
 */
export const loadClassMaps = async (): Promise<INEUParentMap> => {

  // the years to load classMaps for.
  const years: number[] = [2018, 2019];

  // declare classMapParent, and add the classMaps of the years.
  const classMapParent: INEUParentMap = {mostRecentSemester: 0, allTermIds: [], classMapMap: {}};
  const result: string[] = await Promise.all(years.map((year: number) => addClassMapsOfYear(year, classMapParent)));

  // adds the most recent semester's termId as a property to classMapParent.
  const maxYear = Math.max.apply(null, years);
  const maxSeason = Math.max.apply(null, SEASONS);
  classMapParent.mostRecentSemester = (maxYear * 100) + maxSeason;

  // adds all the termIds as a property (array form) to classMapParent, sorted.
  const allTermIds: number[] = [];
  years.forEach((year: number) => {
    SEASONS.forEach((season: number) => {
      const termId: number = (year * 100) + season;
      allTermIds.push(termId);
    });
  });

  // ensure that they are sorted greatest => least, and set the property in classMapParent.
  classMapParent.allTermIds.sort((a1: number, a2: number) => (a2 - a1));
  classMapParent.allTermIds = allTermIds;

  // success! now we're done.
  return classMapParent;
};
