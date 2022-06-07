import { ensureLengthAtLeast, loadHTML, parseText } from "../utils";
import { CatalogEntryType, TypedCatalogEntry } from "./types";

export const addTypeToUrl = async (url: URL): Promise<TypedCatalogEntry> => {
  const type = getUrlType(url, await loadHTML(url.href));
  return { url, type };
};

const getUrlType = (url: URL, $: CheerioStatic): CatalogEntryType => {
  const tabsContainer = $("#contentarea #tabs");

  if (tabsContainer.length === 0) {
    return CatalogEntryType.Unknown;
  } else if (tabsContainer.length === 1) {
    return getUrlTypeDetailed(url, $, tabsContainer.find("ul > li"));
  }
  throw new Error(
    `Expected 1 tab container, but found ${tabsContainer.length}.`
  );
};

const getUrlTypeDetailed = (url: URL, $: CheerioStatic, tabs: Cheerio) => {
  if (url.href.slice(-6) === "-minor") {
    return CatalogEntryType.Minor;
  }

  const urlEnding = getUrlEnding(url);
  const nameEnding = getNameEnding($);
  if (isMajorEnding(urlEnding) || isMajorEnding(nameEnding)) {
    return CatalogEntryType.Major;
  }

  return getUrlTypeFromTabs($, tabs);
};

const getUrlEnding = (url: URL) => {
  const href = url.href;
  const hyphen = href.lastIndexOf("-");
  const slash = href.lastIndexOf("/");
  return href.slice(Math.max(hyphen, slash) + 1);
};

const getNameEnding = ($: CheerioStatic) => {
  const name = parseText($("#site-title").find("h1"));
  const degree = name.lastIndexOf(",");
  // assume ", "<degree>
  return name.substring(degree + 2);
};

const isMajorEnding = (ending: string) => {
  const bs = ending.substring(0, 2) === "bs";
  const ba = ending[0] + ending[ending.length - 1] === "ba";
  // very uncommon ending
  const ba1 = ending.substring(0, 2) === "ba";
  return bs || ba || ba1;
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
