import { Major2 } from "@graduate/common";

const MAJORS: Record<string, Record<string, Major2>> = {};
const MAJOR_YEARS = new Set<string>();

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

// TODO: this code is quick and dirty but works. this should be replaced with some dry-er code later.
/**
 * Iterates over the ./majors directory, collecting majors and adding them to
 * the exported MAJORS and MAJOR_YEARS object/set respectively. It prioritizes
 * parsed.commit.json files over parsed.initial.json files because _.commit._
 * files have been human-reviewed and _.initial._ files are raw scraper output.
 */
async function collateMajors() {
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
}

collateMajors();

export { MAJORS, MAJOR_YEARS };
