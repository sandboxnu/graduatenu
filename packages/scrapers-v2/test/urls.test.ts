// https://catalog.northeastern.edu/undergraduate

import { scrapeMajorLinks } from "../src/urls/urls";
import { convertToHierarchy } from "../src/utils";

describe("url scraper", () => {
  test("scrape", async () => {
    const result = await scrapeMajorLinks(2021, 2022);
    expect(result.unfinished).toHaveLength(0);
    const hierarchy = convertToHierarchy(result.entries);
    expect(hierarchy).toMatchSnapshot();
  }, 15000);
});
