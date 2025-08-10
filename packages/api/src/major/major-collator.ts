import { Major2, Template } from "@graduate/common";

const MAJORS: Record<string, Record<string, Major2>> = {};
const MAJOR_YEARS = new Set<string>();
const TEMPLATES: Record<string, Record<string, Template>> = {};

const reqRootDir = "./src/major/majors";
const templateRootDir = "./src/major/templates";

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

  console.log("Starting major collation...");

  const years = (
    await fs.readdir(path.resolve(reqRootDir), {
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
        const colleges = await fs.readdir(path.join(reqRootDir, year), {
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
        const majors = await fs.readdir(path.join(reqRootDir, year, college), {
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
    TEMPLATES[year] = {};
  });

  // Load majors and process templates
  console.log("Loading majors and processing templates...");
  await Promise.all(
    majors.map(async ({ year, college, major }) => {
      const basePath = path.join(reqRootDir, year, college, major);
      const templateBasePath = path.join(templateRootDir, year, college, major);
      const commitFile = path.join(basePath, "parsed.commit.json");
      const initialFile = path.join(basePath, "parsed.initial.json");
      const templateFile = path.join(templateBasePath, "template.json");

      try {
        // Step 1: Load major data
        let majorData: Major2 | null = null;
        let majorName: string | null = null;

        // Load major data from commit file (preferred) or initial file
        if (await fileExists(fs, commitFile)) {
          majorData = JSON.parse(
            (await fs.readFile(commitFile)).toString()
          ) as Major2;
          majorName = majorData.name;
          MAJORS[year][majorName] = majorData;
        } else if (await fileExists(fs, initialFile)) {
          majorData = JSON.parse(
            (await fs.readFile(initialFile)).toString()
          ) as Major2;
          majorName = majorData.name;
          if (MAJORS[year]) {
            MAJORS[year][majorName] = majorData;
          }
        }

        // Step 2: Check for and process template file
        if (await fileExists(fs, templateFile)) {
          //console.log(`Found template file for ${major} (${year})`);

          // Read and parse template
          const templateRawData = await fs.readFile(templateFile);
          const templateJson = JSON.parse(templateRawData.toString());

          if (!templateJson || Object.keys(templateJson).length === 0) {
            console.log(`Empty template for ${major} (${year})`);
            return;
          }

          // Get template name (the top-level key)
          const templateName = Object.keys(templateJson)[0];
          //console.log(`Processing template: ${templateName}`);

          // Create template object with raw template data (without enhancements)
          const template: Template = {
            name: templateName,
            yearVersion: parseInt(year),
            templateData: templateJson,
          };

          // Store the template
          if (!TEMPLATES[year]) {
            TEMPLATES[year] = {};
          }

          // First, store the template keyed by major directory name (fallback)
          const templateKey = major.replace(/_/g, " ");
          TEMPLATES[year][templateKey] = template;

          // If we have a major, associate the template with it
          if (majorName && MAJORS[year] && MAJORS[year][majorName]) {
            // Also store the template under the major name for consistent lookup
            TEMPLATES[year][majorName] = template;

            //console.log(
            //`Successfully associated template with ${majorName} (${year})`
            //);
          } else {
            console.log(
              `Stored template for ${templateKey} (${year}) but couldn't associate with a major`
            );
          }
        }
      } catch (error) {
        console.error(
          `Error processing major/template ${major} (${year}):`,
          error
        );
      }
    })
  );

  console.log(
    `Successfully loaded ${Object.values(MAJORS).reduce(
      (sum, yearMajors) => sum + Object.keys(yearMajors).length,
      0
    )} majors across ${MAJOR_YEARS.size} years!`
  );

  const templateCount = Object.values(TEMPLATES).reduce(
    (count, yearTemplates) => count + Object.keys(yearTemplates).length,
    0
  );
  console.log(`Loaded ${templateCount} templates for majors`);
}

collateMajors();

export { MAJORS, MAJOR_YEARS, TEMPLATES };
