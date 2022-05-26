import { ensureLengthAtLeast, loadHTML, parseText } from "../utils";
import { CatalogEntryType, TypedCatalogEntry } from "./types";

export const classifyCatalogEntries = async (
  flattenedList: string[],
): Promise<TypedCatalogEntry[]> => {
  return await Promise.all(flattenedList.map(addTypeToUrl));
};

const addTypeToUrl = async (url: string): Promise<TypedCatalogEntry> => {
  const $ = await loadHTML(url);
  const type = getUrlType($);
  return { url, type };
};

const getUrlType = ($: CheerioStatic): CatalogEntryType => {
  const tabsContainer = $("#contentarea #tabs");

  if (!tabsContainer || tabsContainer.length === 0) {
    return CatalogEntryType.Unknown;
  }

  if (tabsContainer.length > 1) {
    throw new Error(
      `Expected 1 tab container, but found ${tabsContainer.length}.`
    );
  }
  const tabs = tabsContainer.find("ul > li");
  const [, middleTab] = ensureLengthAtLeast(2, tabs.toArray().map($));
  const middleTabText = parseText(middleTab);
  if (tabs.length === 2) {
    if (middleTabText === "Minor Requirements") {
      return CatalogEntryType.Minor;
    } else if (middleTabText === "Concentration Requirements") {
      return CatalogEntryType.Concentration;
    }
    throw new Error(`Expected minor, but found ${middleTabText}`);
  } else if (tabs.length === 3) {
    if (middleTabText === "Program Requirements") {
      return CatalogEntryType.Major;
    }
    throw new Error(`Expected minor, but found ${middleTabText}`);
  }

  throw new Error(`Unexpected numbers of tabs: ${tabs.length}`);
};

