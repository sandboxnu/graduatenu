export enum CatalogEntryType {
  Major = "Major",
  Minor = "Minor",
  Concentration = "Concentration",
  Unknown = "Unknown",
  Uncategorized = "Uncategorized"
}

export type CatalogHierarchyEntry = {
  type: CatalogEntryType,
  url: string
}