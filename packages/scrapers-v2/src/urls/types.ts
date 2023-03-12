/*
Master list of old catalogs:
https://registrar.northeastern.edu/group/academic-catalogs/

Catalogs that are scrape-able (HTML):
2021–2022 Catalog and Course Descriptions (current year)
2020–2021 Catalog and Course Descriptions
2019–2020 Catalog and Course Descriptions
2018–2019 Catalog and Course Descriptions
2017–2018 Catalog and Course Descriptions
2016–2017 Catalog and Course Descriptions
*/

export enum College {
  ARTS_MEDIA_DESIGN = "arts-media-design",
  // BUSINESS = "business",
  KHOURY = "computer-information-science",
  // ENGINEERING = "engineering",
  // HEALTH_SCIENCES = "health-sciences",
  // SCIENCE = "science",
  // SOCIAL_SCIENCES_HUMANITIES = "social-sciences-humanities",
}

/**
 * Represents the result of an attempted catalog URL scrape (to find URLs to entries).
 *
 * Produces a list of entry URLs, as well a queue of unfinished URLs that still
 * need to be searched. Will produce unfinished URLs if visiting a URL fails.
 */
export type CatalogURLResult = {
  entries: URL[];
  unfinished: Array<EntryError>;
};

export type EntryError = { url: URL; error: unknown };
