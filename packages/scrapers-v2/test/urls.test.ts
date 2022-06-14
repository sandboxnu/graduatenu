import { scrapeMajorLinks } from "../src/urls/urls";

describe("url scraper", () => {
  test("scrape", async () => {
    const result = await scrapeMajorLinks(2021, 2022);
    expect(result.unfinished).toHaveLength(0);
  }, 15000);
});
