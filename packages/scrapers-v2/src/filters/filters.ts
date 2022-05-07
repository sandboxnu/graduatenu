import { ensureLengthAtLeast, loadHTML, parseText } from "../utils";
import { CatalogEntryType } from "./types";

export const filterCatalogByTypes = async (
  flattenedList: { url: string }[],
  include: CatalogEntryType[]
): Promise<{ url: string, type: CatalogEntryType }[]> => {
  // function to add the type
  // function to filter
  const typedUrls = await addTypeToUrls(flattenedList);
  const filteredUrls = filterByEntryType(typedUrls, include);

  return filteredUrls;
};

const addTypeToUrls = async (
  flattenedList: { url: string }[]
): Promise<{ url: string, type: CatalogEntryType }[]> => {
  // figure out what type to add
  // checking if url html has corresponding attributes for type
  // i.e 3 columns for major, 2 columns for minors, etc.
  const typedUrls = await Promise.all(flattenedList.map(addTypeToUrl));

  return typedUrls;
}

const addTypeToUrl = async (
  { url }: { url: string }
): Promise<{ url: string, type: CatalogEntryType }> => {
  const $ = await loadHTML(url);
  const type = getUrlType($);
  return { url, type };
}

const getUrlType = ($: CheerioStatic): CatalogEntryType => {
  const tabsContainer = $("#contentarea #tabs");

  if (!tabsContainer) {
    return CatalogEntryType.Unknown;
  }

  if (tabsContainer.length > 1) {
    throw new Error(`Expected 1 tab container, but found ${tabsContainer.length}.`);
  }
  const tabs = tabsContainer.find("ul > li");
  const [, middleTab] = ensureLengthAtLeast(2, tabs.toArray().map($));
  const middleTabText = parseText(middleTab);
  if (tabs.length === 2) {
    if (middleTabText === "Minor Requirements") {
      return CatalogEntryType.Minor;
    } else if (middleTabText === "Concentration Requirements") {
      return CatalogEntryType.Concentration
    }
    throw new Error(`Expected minor, but found ${middleTabText}`);
  } else if (tabs.length === 3) {
    if (middleTabText === "Program Requirements") {
      return CatalogEntryType.Major;
    }
    throw new Error(`Expected minor, but found ${middleTabText}`);
  }

  throw new Error(`Unexpected numbers of tabs: ${tabs.length}`);
}

const filterByEntryType = (
  typedUrls: { url: string, type: CatalogEntryType }[],
  include: CatalogEntryType[]
): { url: string, type: CatalogEntryType }[] => {
  const filteredEntries = typedUrls.filter((typedUrl) => include.includes(typedUrl.type));

  return filteredEntries;
}
