import { Major2 } from "@graduate/common";

const TEMPLATES: Record<string, Record<string, Record<string, Major2>>> = {};
const TEMPLATE_YEARS = new Set<string>();

const rootDir = "./src/template/templates";

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

/**
 * Iterates over the ./templates directory, collecting templates and adding them
 * to the exported TEMPLATES and TEMPLATE_YEARS object/set respectively.
 */
async function collateTemplates() {
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
    TEMPLATE_YEARS.add(year);
    TEMPLATES[year] = {};
  });

  const done = await Promise.all(
    majors.map(async ({ year, college, major }) => {
      const basePath = path.join(rootDir, year, college, major);
      const plansFile = path.join(basePath, "plans.json");

      if (await fileExists(fs, plansFile)) {
        const plans = JSON.parse((await fs.readFile(plansFile)).toString());

        if (!TEMPLATES[year][college]) {
          TEMPLATES[year][college] = {};
        }
        TEMPLATES[year][college][major] = plans;
      }
    })
  );

  console.log(
    `Successfully loaded ${done.length} templates across ${TEMPLATE_YEARS.size} years!`
  );
}

collateTemplates();

export { TEMPLATES, TEMPLATE_YEARS };
