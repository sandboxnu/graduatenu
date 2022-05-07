export enum College {
  ARTS_MEDIA_DESIGN = "arts-media-design",
  BUSINESS = "business",
  KHOURY = "computer-information-science",
  ENGINEERING = "engineering",
  HEALTH_SCIENCES = "health-sciences",
  SCIENCE = "science",
  SOCIAL_SCIENCES_HUMANITIES = "social-sciences-humanities",
}

export type CatalogHierarchy<T> = {
  [part: string]: T | CatalogHierarchy<T>;
};

export type CatalogPath = {
  // base: https://catalog.northeastern.edu/
  path: Array<string>;
  // ex: "undergraduate", "computer-information-science"
  // or, in the archive case:
  // ex: "archive", "2018-2019", "undergraduate", "computer-information-science"
};