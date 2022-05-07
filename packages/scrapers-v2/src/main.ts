import { scrapeMajorLinks } from "./urls/scrape_urls";
import { filterByEntryType } from "./filters/filters";
import { CatalogEntryType } from "./filters/types";
import { flattenCatalogHierarchy } from "./utils";
import { fetchAndTokenizeHTML } from "./lexer/lexer";


export const runScrape = async () => {
  try {
    const hierarchy = await scrapeMajorLinks(2021, 2022);
    const majorHierarchy = await filterByEntryType(hierarchy, [CatalogEntryType.Major]);
    const majors = flattenCatalogHierarchy(majorHierarchy);
    const tokenized = await Promise.all(majors.map(({ url }) => fetchAndTokenizeHTML(url)));
    // todo:
    // return await tokenized.map(tok => parseMajor2(tok))
  } catch (e) {
    throw e;
  }
}