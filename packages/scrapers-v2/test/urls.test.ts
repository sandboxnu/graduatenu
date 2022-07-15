import { scrapeMajorLinks } from "../src/urls/urls";

describe("url scraper", () => {
  test("scrape", async () => {
    const result = await scrapeMajorLinks(2021, 2022);

    expect(result.unfinished).toHaveLength(0);
    const urlStrings = result.entries.map((url) => url.href);
    expect(urlStrings.length).toEqual(new Set(urlStrings).size);
    expect(urlStrings.sort()).toMatchSnapshot();
  }, 15000);
});
