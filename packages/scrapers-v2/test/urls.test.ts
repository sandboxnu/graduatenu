// https://catalog.northeastern.edu/undergraduate

import { scrapeMajorLinks } from "../src/urls/scrape_urls";

describe("url scraper", () => {
  test("scrape", async () => {
    jest.setTimeout(15000);
    const result = await scrapeMajorLinks(2021, 2022);
    expect(result).toMatchSnapshot();
  });
});
