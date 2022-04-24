// https://catalog.northeastern.edu/undergraduate

import { scrapeMajorLinks } from "../src/urls/scrape_urls";

describe("url scraper", () => {
  test("scrape", async () => {

    const result = await scrapeMajorLinks(2021, 2022);
    expect(result).toMatchSnapshot();
  });
});
