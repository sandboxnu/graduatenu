import { scrapeMajorLinks } from "./urls/scrape_urls";
import { classifyCatalogEntries } from "./classifier/classifier";
import { CatalogEntryType } from "./classifier/types";
import { filterByEntryType, flattenCatalogHierarchy } from "./utils";
import { fetchAndTokenizeHTML } from "./lexer/lexer";

export const runScrape = async () => {
  try {
    const hierarchy = await scrapeMajorLinks(2021, 2022);
    const flattenedUrls = flattenCatalogHierarchy(hierarchy);
    const typedUrls = await classifyCatalogEntries(flattenedUrls);
    const filteredUrls = filterByEntryType(typedUrls, [CatalogEntryType.Major]);
    const tokenized = await Promise.all(
      filteredUrls.map(({ url }) => fetchAndTokenizeHTML(url))
    );
    // todo:
    // return await tokenized.map(tok => parseMajor2(tok))
  } catch (e) {
    throw e;
  }
};
