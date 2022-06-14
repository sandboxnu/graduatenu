import { ensureLengthAtLeast, loadHTML, parseText } from "../utils";
import { CatalogEntryType, TypedCatalogEntry } from "./types";

export const addTypeToUrl = async (url: URL): Promise<TypedCatalogEntry> => {
  const type = getUrlType(await loadHTML(url.href));
  return { url, type };
};

const getUrlType = ($: CheerioStatic) => {
  const typeFromName = getTypeFromNameEnding($);
  if (typeFromName !== CatalogEntryType.Unknown) {
    return typeFromName;
  }
  const typeFromTabs = getTypeFromTabs($);
  if (typeFromTabs !== CatalogEntryType.Unknown) {
    return typeFromTabs;
  }
  const typeFromContainer = getTypeFromContainer($);
  if (typeFromContainer !== CatalogEntryType.Unknown) {
    return typeFromContainer;
  }
  return CatalogEntryType.Unknown;
};

const getTypeFromNameEnding = ($: CheerioStatic) => {
  const nameEnding = getNameEnding($);
  if (nameEnding && isMajorEnding(nameEnding)) {
    return CatalogEntryType.Major;
  } else if (nameEnding?.toLowerCase() === "minor") {
    return CatalogEntryType.Minor;
  }
  return CatalogEntryType.Unknown;
};

const getTypeFromTabs = ($: CheerioStatic) => {
  const tabsContainer = $("#contentarea #tabs");
  if (tabsContainer.length === 0) {
    return CatalogEntryType.Unknown;
  } else if (tabsContainer.length === 1) {
    return getTypeFromTabText(tabsContainer.find("ul > li").toArray().map($));
  }
  throw new Error(
    `Expected 0 or 1 tab container, but found ${tabsContainer.length}.`
  );
};

const getTypeFromContainer = ($: CheerioStatic) => {
  const container = $("[id$='requirementstextcontainer']");
  if (container.length === 1) {
    const id = container.attr("id");
    if (id === "minorrequirementstextcontainer") {
      return CatalogEntryType.Minor;
    } else if (id === "programrequirementstextcontainer") {
      return CatalogEntryType.Major;
    } else if (id === "concentrationrequirementstextcontainer") {
      return CatalogEntryType.Concentration;
    }
  }
  return CatalogEntryType.Unknown;
};

const getNameEnding = ($: CheerioStatic) => {
  const name = parseText($("#site-title").find("h1"));
  const degree = name.lastIndexOf(",");
  if (degree !== -1) {
    // assume ", "<degree>
    return name
      .substring(degree + 2)
      .toLowerCase()
      .trim();
  }
  return null;
};

const isMajorEnding = (ending: string) => {
  const bs = ending.substring(0, 2) === "bs";
  const ba = ending[0] + ending[ending.length - 1] === "ba";
  // very uncommon ending
  const ba1 = ending.substring(0, 2) === "ba";
  return bs || ba || ba1;
};

const getTypeFromTabText = (tabs: Cheerio[]) => {
  // most entries have 3 tabs, but some have 2 or rarely 4
  const [, tab] = ensureLengthAtLeast(2, tabs);
  const tabText = parseText(tab);

  switch (tabText.toLowerCase()) {
    case "minor requirements":
      return CatalogEntryType.Minor;
    case "concentration requirements":
      return CatalogEntryType.Concentration;
    case "program requirements":
      return CatalogEntryType.Major;
    default:
      return CatalogEntryType.Unknown;
  }
};
