/**
 * This script is used to verify that the major req jsons are up to date. It is
 * run as a GitHub Action on every push to the main branch.
 */

import * as path from "path";
import * as fs from "fs";

const majorReqJsonRootDir = "packages/api/src/major/majors";
const templateRootDir = "packages/api/src/major/templates";
const minorRootDir = "packages/api/src/minor/minors";

/**
 * Verifies that all JSON files have metadata.branch set to "main" Optimized to
 * traverse each year once and check all data types
 */
async function verifyAllData(): Promise<boolean> {
  // Get all years from majors directory (assuming all directories have same years)
  const years = fs.readdirSync(majorReqJsonRootDir);

  for (const year of years) {
    // Check majors
    if (
      !(await verifyDataType(
        majorReqJsonRootDir,
        year,
        "Major",
        "parsed.initial.json"
      ))
    ) {
      return false;
    }

    // Check templates
    if (
      !(await verifyDataType(
        templateRootDir,
        year,
        "Template",
        "template.json"
      ))
    ) {
      return false;
    }

    // Check minors
    if (
      !(await verifyDataType(
        minorRootDir,
        year,
        "Minor",
        "parsed.initial.json"
      ))
    ) {
      return false;
    }
  }

  return true;
}

/** Helper function to verify a specific data type for a given year */
async function verifyDataType(
  rootDir: string,
  year: string,
  dataType: string,
  fileName: string
): Promise<boolean> {
  const yearPath = path.join(rootDir, year);
  if (!fs.existsSync(yearPath)) {
    return true; // Skip if year doesn't exist for this data type
  }

  const colleges = fs.readdirSync(yearPath);
  for (const college of colleges) {
    const collegePath = path.join(yearPath, college);
    const items = fs.readdirSync(collegePath);
    for (const item of items) {
      const itemPath = path.join(collegePath, item);
      const filePath = path.join(itemPath, fileName);

      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, "utf8");
          const data = JSON.parse(content) as {
            metadata?: { branch?: string };
          };
          if (data.metadata?.branch !== "main") {
            console.error(
              `${dataType} ${year}/${college}/${item} is not up to date. Branch is ${data.metadata?.branch}. Expected branch is main.`
            );
            return false;
          }
        } catch (error) {
          console.error(
            `Error parsing ${dataType} ${year}/${college}/${item}: ${error}`
          );
          return false;
        }
      }
    }
  }

  return true;
}

async function verifyAll(): Promise<boolean> {
  return await verifyAllData();
}

async function main() {
  const result = await verifyAll();
  if (!result) {
    process.exit(1);
  }
}

main();
