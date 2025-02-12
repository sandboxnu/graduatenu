/**
 * This script is used to scan the major JSON files used by the API for specific
 * information. The information that is scanned is logged to a file
 * 'major-scanner-output.json' in the API directory.
 */
import * as fs from "fs";
import { Major2, Requirement2 } from "@graduate/common";

const rootDir = "./src/major/majors";

interface YearData {
  year: string;
}

interface YearCollegeData {
  year: string;
  college: string;
}

interface YearCollegeMajorData {
  year: string;
  college: string;
  major: string;
}

async function fileExists(
  fs: typeof import("fs/promises"),
  path: string
): Promise<boolean> {
  return await fs.access(path, fs.constants.F_OK).then(
    () => true,
    () => false
  );
}

type MajorsStructure = Record<string, Record<string, Major2>>;
type MajorYearStructure = Set<string>;

// taken from major-collator.ts
/**
 * Iterates over the ./majors directory, collecting majors and adding them to
 * the exported MAJORS and MAJOR_YEARS object/set respectively. It prioritizes
 * parsed.commit.json files over parsed.initial.json files because _.commit._
 * files have been human-reviewed and _.initial._ files are raw scraper output.
 */
async function collateMajors(): Promise<[MajorsStructure, MajorYearStructure]> {
  const MAJORS: Record<string, Record<string, Major2>> = {};
  const MAJOR_YEARS = new Set<string>();
  // TODO: determine why these needed to be runtime imports (normal import statements didn't work here).
  const fs = await import("fs/promises");
  const path = await import("path");
  const years = (
    await fs.readdir(path.resolve(rootDir), {
      withFileTypes: true,
    })
  )
    .filter((dirent) => dirent.isDirectory())
    .map(
      (dirent): YearData => ({
        year: dirent.name,
      })
    );

  const colleges = (
    await Promise.all(
      years.map(async ({ year }) => {
        const colleges = await fs.readdir(path.join(rootDir, year), {
          withFileTypes: true,
        });
        return colleges
          .filter((dirent) => dirent.isDirectory())
          .map(
            (college): YearCollegeData => ({
              year: year,
              college: college.name,
            })
          );
      })
    )
  ).flat();

  const majors = (
    await Promise.all(
      colleges.map(async ({ year, college }) => {
        const majors = await fs.readdir(path.join(rootDir, year, college), {
          withFileTypes: true,
        });
        return majors
          .filter((dirent) => dirent.isDirectory())
          .map(
            (major): YearCollegeMajorData => ({
              year: year,
              college: college,
              major: major.name,
            })
          );
      })
    )
  ).flat();

  years.forEach(({ year }) => {
    MAJOR_YEARS.add(year);
    MAJORS[year] = {};
  });

  const done = await Promise.all(
    majors.map(async ({ year, college, major }) => {
      const basePath = path.join(rootDir, year, college, major);
      const commitFile = path.join(basePath, "parsed.commit.json");
      const initialFile = path.join(basePath, "parsed.initial.json");

      if (await fileExists(fs, commitFile)) {
        const fileData = JSON.parse(
          (await fs.readFile(commitFile)).toString()
        ) as Major2;
        MAJORS[year][fileData.name] = fileData;
      } else if (await fileExists(fs, initialFile)) {
        const fileData = JSON.parse(
          (await fs.readFile(initialFile)).toString()
        ) as Major2;
        if (MAJORS[year]) MAJORS[year][fileData.name] = fileData;
      }
    })
  );

  console.log(
    `Successfully loaded ${done.length} majors across ${MAJOR_YEARS.size} years!`
  );

  return [MAJORS, MAJOR_YEARS];
}

// a major predicate function has a name defining what the predicate scans for
// and the predicate function that should be used.
interface MajorPredicate {
  name: string;
  predicate: (major: Major2) => boolean;
}

type ScannedInformationMap = Record<string, string[]>;

/**
 * This function will run through the major JSON used by the API and return the
 * list of majors that fulfill the given criterion.
 */
async function scanMajorForInformation(
  majorPredicates: MajorPredicate[]
): Promise<ScannedInformationMap> {
  const [majors, majorYears] = await collateMajors();

  const scanningInformation: ScannedInformationMap = {};

  for (const majorPredicate of majorPredicates) {
    scanningInformation[majorPredicate.name] = [];
    for (const year of majorYears) {
      for (const major of Object.values(majors[year])) {
        if (majorPredicate.predicate(major)) {
          scanningInformation[majorPredicate.name].push(major.name);
        }
      }
    }
  }
  return scanningInformation;
}

// major predicate function that scans for majors with concentration names incorrectly
// there is a common error where the concentration names are not correctly scrapped
// and they usually become "Required Courses" or "Electives"
// example: Design, BFA in 2021
function hasConcentrationNameError(major: Major2): boolean {
  if (major.concentrations) {
    for (const concentration of major.concentrations.concentrationOptions) {
      if (
        concentration.title == "Required Courses" ||
        concentration.title == "Electives"
      ) {
        return true;
      }
    }
  }
  return false;
}

// major predicate function that will scan for majors with structure error
// there is a common error where the structure of the major is incorrect
// requiring the extractRequirements() function to be used in the getAllCoursesInMajor function
function hasStructureError(major: Major2): boolean {
  function hasRequirementIssue(requirement: Requirement2): boolean {
    if (requirement.type === "AND") {
      return requirement.courses.some(hasRequirementIssue);
    } else if (requirement.type === "OR") {
      return requirement.courses.some(hasRequirementIssue);
    } else if (requirement.type === "XOM") {
      return requirement.courses.some(hasRequirementIssue);
    } else if (Array.isArray(requirement)) {
      return true;
    } else {
      return false;
    }
  }

  for (const section of major.requirementSections) {
    for (const requirement of section.requirements) {
      if (hasRequirementIssue(requirement)) {
        return true;
      }
    }
  }
  return false;
}

scanMajorForInformation([
  { name: "Concentration Name Error", predicate: hasConcentrationNameError },
  { name: "Structure Error", predicate: hasStructureError },
]).then((scanningInformation) => {
  const logStream = fs.createWriteStream("major-scanner.log", { flags: "w" });
  logStream.write(JSON.stringify(scanningInformation, null, 2));
});
