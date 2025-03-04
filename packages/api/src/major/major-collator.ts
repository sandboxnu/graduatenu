import {
  Major2,
  Template,
  IRequiredCourse,
  Requirement2,
} from "@graduate/common";

const MAJORS: Record<string, Record<string, Major2>> = {};
const MAJOR_YEARS = new Set<string>();
const TEMPLATES: Record<string, Record<string, Template>> = {};

// Store course information extracted from requirements
const COURSE_INFO: Record<
  string,
  Record<string, { name: string; description?: string }>
> = {};

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

/**
 * Recursively extracts course information from requirements
 *
 * @param requirement The requirement to extract course information from
 */
function extractCourseInfo(requirement: Requirement2) {
  try {
    // Simple validation check
    if (!requirement || !requirement.type) {
      return;
    }

    // Handle course type directly
    if (requirement.type === "COURSE") {
      const course = requirement as IRequiredCourse;
      const subject = course.subject;
      const classId = course.classId.toString();

      // Initialize subject in COURSE_INFO if it doesn't exist
      if (!COURSE_INFO[subject]) {
        COURSE_INFO[subject] = {};
      }

      // Store course info with description if available
      COURSE_INFO[subject][classId] = {
        name: `${subject} ${classId}`,
        description: course.description || undefined,
      };
      return;
    }

    // Handle section type
    if (requirement.type === "SECTION" && requirement.requirements) {
      requirement.requirements.forEach((req) => extractCourseInfo(req));
      return;
    }

    // Handle AND/OR/XOM types
    if (
      ["AND", "OR", "XOM"].includes(requirement.type) &&
      "courses" in requirement
    ) {
      (requirement.courses || []).forEach((course) =>
        extractCourseInfo(course)
      );
      return;
    }

    // Handle RANGE type
    if (requirement.type === "RANGE" && "exceptions" in requirement) {
      (requirement.exceptions || []).forEach((exception) => {
        if (!COURSE_INFO[exception.subject]) {
          COURSE_INFO[exception.subject] = {};
        }

        const classId = exception.classId.toString();
        COURSE_INFO[exception.subject][classId] = {
          name: `${exception.subject} ${classId}`,
          description: exception.description || undefined,
        };
      });
      return;
    }
  } catch (error) {
    console.error("Error extracting course info:", error);
  }
}

/**
 * Extract course information from tokens.initial.json files These files have
 * more consistent course descriptions
 *
 * @param tokensData The parsed tokens file data
 */
function extractCourseInfoFromTokens(tokensData: any): void {
  try {
    console.log(
      `Processing tokens file for: ${tokensData.majorName || "Unknown major"}`
    );

    // Initialize course count for this major
    let majorCourseCount = 0;

    // Process each section in the tokens file
    if (tokensData.sections && Array.isArray(tokensData.sections)) {
      tokensData.sections.forEach((section: any) => {
        // Process each entry in the section
        if (section.entries && Array.isArray(section.entries)) {
          section.entries.forEach((entry: any) => {
            try {
              // Process based on entry type
              switch (entry.type) {
                case "PLAIN_COURSE":
                case "OR_COURSE":
                  // Directly extract course info
                  if (entry.subject && entry.classId) {
                    if (
                      addCourseToInfo(
                        entry.subject,
                        entry.classId.toString(),
                        entry.description
                      )
                    ) {
                      majorCourseCount++;
                    }
                  }
                  break;

                case "AND_COURSE":
                  // Extract info from the courses array
                  if (entry.courses && Array.isArray(entry.courses)) {
                    entry.courses.forEach((course: any) => {
                      if (course.subject && course.classId) {
                        if (
                          addCourseToInfo(
                            course.subject,
                            course.classId.toString(),
                            course.description
                          )
                        ) {
                          majorCourseCount++;
                        }
                      }
                    });
                  }
                  break;

                case "X_OF_MANY":
                  // X_OF_MANY is usually a header, but we'll check the next entries
                  break;

                case "RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS":
                  // Check for exceptions which may have descriptions
                  if (entry.exceptions && Array.isArray(entry.exceptions)) {
                    entry.exceptions.forEach((exception: any) => {
                      if (exception.subject && exception.classId) {
                        if (
                          addCourseToInfo(
                            exception.subject,
                            exception.classId.toString(),
                            exception.description
                          )
                        ) {
                          majorCourseCount++;
                        }
                      }
                    });
                  }
                  break;
              }
            } catch (entryError) {
              console.error("Error processing tokens entry:", entryError);
            }
          });
        }

        // Look for any subheaders or smaller sections that may contain courses
        if (section.type === "CONCENTRATION") {
          // Process concentration sections which might contain more courses
          try {
            processConcentrationSection(section);
          } catch (concError) {
            console.error("Error processing concentration section:", concError);
          }
        }
      });
    }

    console.log(
      `Extracted ${majorCourseCount} courses from tokens for ${
        tokensData.majorName || "Unknown major"
      }`
    );
  } catch (error) {
    console.error("Error extracting course info from tokens:", error);
  }

  // Helper function to add a course to COURSE_INFO
  function addCourseToInfo(
    subject: string,
    classId: string,
    description?: string
  ): boolean {
    if (!subject || !classId) return false;

    // Initialize subject in COURSE_INFO if it doesn't exist
    if (!COURSE_INFO[subject]) {
      COURSE_INFO[subject] = {};
    }

    // Only add if it doesn't exist or if this has a description and existing one doesn't
    const existingCourse = COURSE_INFO[subject][classId];
    if (!existingCourse || (!existingCourse.description && description)) {
      COURSE_INFO[subject][classId] = {
        name: `${subject} ${classId}`,
        description: description || undefined,
      };
      return true;
    }
    return false;
  }

  // Process concentration sections which might be nested
  function processConcentrationSection(section: any) {
    if (section.entries && Array.isArray(section.entries)) {
      section.entries.forEach((entry: any) => {
        // Process nested course entries
        if (entry.type === "PLAIN_COURSE" || entry.type === "OR_COURSE") {
          if (entry.subject && entry.classId) {
            addCourseToInfo(
              entry.subject,
              entry.classId.toString(),
              entry.description
            );
          }
        } else if (
          entry.type === "AND_COURSE" &&
          entry.courses &&
          Array.isArray(entry.courses)
        ) {
          entry.courses.forEach((course: any) => {
            if (course.subject && course.classId) {
              addCourseToInfo(
                course.subject,
                course.classId.toString(),
                course.description
              );
            }
          });
        }

        // Check for nested sections (recursively)
        if (
          entry.type === "SECTION" &&
          entry.entries &&
          Array.isArray(entry.entries)
        ) {
          processConcentrationSection(entry);
        }
      });
    }
  }
}

/**
 * Gets course name from extracted course info
 *
 * @param   subject            Course subject code
 * @param   classId            Course number
 * @param   includeDescription Whether to include the description in the returned name
 * @returns                    Full course name if available, otherwise just
 *   subject and classId
 */
function getCourseName(
  subject: string,
  classId: string,
  includeDescription = true
): string {
  try {
    if (COURSE_INFO[subject] && COURSE_INFO[subject][classId]) {
      const courseInfo = COURSE_INFO[subject][classId];
      if (includeDescription && courseInfo.description) {
        return `${subject} ${classId}: ${courseInfo.description}`;
      } else {
        return `${subject} ${classId}`;
      }
    }
  } catch (error) {
    console.error(
      `Error getting course name for ${subject} ${classId}:`,
      error
    );
  }
  return `${subject} ${classId}`;
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
    TEMPLATES[year] = {};
  });

  // First pass: Load tokens files to extract course descriptions
  console.log("First pass: Loading tokens files for course descriptions...");
  await Promise.all(
    majors.map(async ({ year, college, major }) => {
      const basePath = path.join(rootDir, year, college, major);
      const tokensFile = path.join(basePath, "tokens.initial.json");

      try {
        if (await fileExists(fs, tokensFile)) {
          console.log(`Processing tokens file: ${tokensFile}`);
          const tokensData = JSON.parse(
            (await fs.readFile(tokensFile)).toString()
          );
          extractCourseInfoFromTokens(tokensData);
        } else {
          console.log(`No tokens file found at: ${tokensFile}`);
        }
      } catch (error) {
        console.error(
          `Error processing tokens file for ${major} (${year}):`,
          error
        );
      }
    })
  );

  // Log the number of courses found after tokens extraction
  let tokenCourseCount = 0;
  Object.keys(COURSE_INFO).forEach((subject) => {
    tokenCourseCount += Object.keys(COURSE_INFO[subject]).length;
  });
  console.log(
    `Extracted information for ${tokenCourseCount} courses from tokens files`
  );

  // Second pass: Load majors and process templates
  console.log("Second pass: Loading majors and processing templates...");
  await Promise.all(
    majors.map(async ({ year, college, major }) => {
      const basePath = path.join(rootDir, year, college, major);
      const commitFile = path.join(basePath, "parsed.commit.json");
      const initialFile = path.join(basePath, "parsed.initial.json");
      const templateFile = path.join(basePath, "template.json");

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

          // Extract course info from the requirements as fallback
          if (majorData.requirementSections) {
            majorData.requirementSections.forEach((section) => {
              extractCourseInfo(section);
            });
          }
        } else if (await fileExists(fs, initialFile)) {
          majorData = JSON.parse(
            (await fs.readFile(initialFile)).toString()
          ) as Major2;
          majorName = majorData.name;
          if (MAJORS[year]) {
            MAJORS[year][majorName] = majorData;

            // Extract course info from the requirements as fallback
            if (majorData.requirementSections) {
              majorData.requirementSections.forEach((section) => {
                extractCourseInfo(section);
              });
            }
          }
        }

        // Step 2: Check for and process template file
        if (await fileExists(fs, templateFile)) {
          console.log(`Found template file for ${major} (${year})`);

          // Read and parse template
          const templateRawData = await fs.readFile(templateFile);
          const templateJson = JSON.parse(templateRawData.toString());

          if (!templateJson || Object.keys(templateJson).length === 0) {
            console.log(`Empty template for ${major} (${year})`);
            return;
          }

          // Get template name (the top-level key)
          const templateName = Object.keys(templateJson)[0];
          console.log(`Processing template: ${templateName}`);

          // Process template data to add course names
          const enhancedTemplateJson = { ...templateJson };
          const templateData = enhancedTemplateJson[templateName];

          if (!templateData) {
            console.log(`No template data found for ${templateName}`);
            return;
          }

          // Enhance template with course descriptions
          Object.keys(templateData).forEach((yearKey) => {
            const yearData = templateData[yearKey];

            Object.keys(yearData).forEach((termKey) => {
              const courses = yearData[termKey];

              if (Array.isArray(courses)) {
                // Create a new array with enhanced course information
                const enhancedCourses = courses.map((courseStr) => {
                  const courseParts = courseStr.match(/([A-Z]+)\s+(\d+[A-Z]*)/);
                  if (courseParts) {
                    const subject = courseParts[1];
                    const classId = courseParts[2];

                    // Get the full course name including description
                    const courseName = getCourseName(subject, classId, true);

                    // Log if we found a description or not (for debugging)
                    if (courseName !== `${subject} ${classId}`) {
                      console.log(
                        `Enhanced course: ${subject} ${classId} -> ${courseName}`
                      );
                    } else {
                      console.log(
                        `No description found for: ${subject} ${classId}`
                      );
                    }

                    return courseName;
                  }
                  return courseStr; // Return original if we can't parse it
                });

                // Update the template with enhanced courses
                yearData[termKey] = enhancedCourses;
              }
            });
          });

          // Create template object
          const template: Template = {
            name: templateName,
            requirementSections: [], // Template doesn't need requirements
            yearVersion: parseInt(year),
            templateData: enhancedTemplateJson,
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
            // Associate the template with the major
            MAJORS[year][majorName].baseTemplate = template;

            // Also store the template under the major name for consistent lookup
            TEMPLATES[year][majorName] = template;

            console.log(
              `Successfully associated template with ${majorName} (${year})`
            );
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

  // Log statistics
  let courseCount = 0;
  Object.keys(COURSE_INFO).forEach((subject) => {
    courseCount += Object.keys(COURSE_INFO[subject]).length;
  });

  console.log(`Extracted information for ${courseCount} courses`);

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
  console.log(
    `Loaded ${templateCount} templates for majors with enhanced course names`
  );
}

collateMajors();

export { MAJORS, MAJOR_YEARS, TEMPLATES };
