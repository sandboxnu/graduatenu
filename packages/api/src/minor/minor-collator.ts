import { Minor } from "@graduate/common";
//                   year    minor  name    minor data
const MINORS: Record<string, Record<string, Minor>> = {};
const MINOR_YEARS = new Set<string>();

const rootDir = "./src/minor/minors";

interface YearData {
  year: string;
}

interface YearCollegeData {
  year: string;
  college: string;
}

interface YearCollegeMinorData {
  year: string;
  college: string;
  minor: string;
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
 * Iterates over the ./minors directory, collecting minors and adding them to
 * the exported MINORS and MINOR_YEARS object/set respectively. It prioritizes
 * parsed.commit.json files over parsed.initial.json files because _.commit._
 * files have been human-reviewed and _.initial._ files are raw scraper output.
 */
async function collateMinors() {
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

  const minors = (
    await Promise.all(
      colleges.map(async ({ year, college }) => {
        const minors = await fs.readdir(path.join(rootDir, year, college), {
          withFileTypes: true,
        });
        return minors
          .filter((dirent) => dirent.isDirectory())
          .map(
            (minor): YearCollegeMinorData => ({
              year: year,
              college: college,
              minor: minor.name,
            })
          );
      })
    )
  ).flat();

  years.forEach(({ year }) => {
    MINOR_YEARS.add(year);
    MINORS[year] = {};
  });

  const done = await Promise.all(
    minors.map(async ({ year, college, minor }) => {
      const basePath = path.join(rootDir, year, college, minor);
      const commitFile = path.join(basePath, "parsed.commit.json");
      const initialFile = path.join(basePath, "parsed.initial.json");

      if (await fileExists(fs, commitFile)) {
        const fileData = JSON.parse(
          (await fs.readFile(commitFile)).toString()
        ) as Minor;
        MINORS[year][fileData.name] = fileData;
      } else if (await fileExists(fs, initialFile)) {
        const fileData = JSON.parse(
          (await fs.readFile(initialFile)).toString()
        ) as Minor;
        if (MINORS[year]) MINORS[year][fileData.name] = fileData;
      }
    })
  );

  console.log(
    `Successfully loaded ${done.length} minors across ${MINOR_YEARS.size} years!`
  );
}

collateMinors();

export { MINORS, MINOR_YEARS };
