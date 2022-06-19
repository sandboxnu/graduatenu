import { ensureLengthAtLeast, loadHTML, parseText } from "../utils";
import { CatalogEntryType, TypedCatalogEntry } from "./types";

export const addTypeToUrl = async (url: URL): Promise<TypedCatalogEntry> => {
  const type = getUrlType(await loadHTML(url.href));
  return { url, type };
};

const getUrlType = ($: CheerioStatic): CatalogEntryType => {
  const tabsContainer = $("#contentarea #tabs");

  if (tabsContainer.length === 0) {
    return CatalogEntryType.Unknown;
  } else if (tabsContainer.length === 1) {
    return getUrlTypeFromTabs($, tabsContainer.find("ul > li"));
  }
  throw new Error(
    `Expected 1 tab container, but found ${tabsContainer.length}.`
  );
};

const getUrlTypeFromTabs = ($: CheerioStatic, tabs: Cheerio) => {
  const [, middleTab] = ensureLengthAtLeast(2, tabs.toArray().map($));
  const middleTabText = parseText(middleTab);

  // most entries have 3 tabs, but some have 2 or rarely 4
  if (middleTabText === "Minor Requirements") {
    return CatalogEntryType.Minor;
  } else if (middleTabText === "Concentration Requirements") {
    return CatalogEntryType.Concentration;
  } else if (middleTabText === "Program Requirements") {
    return CatalogEntryType.Major;
  }

  throw new Error(
    `Middle tab text did not match one of the expected types: ${middleTabText}`
  );
};
