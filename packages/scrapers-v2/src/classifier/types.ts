export enum CatalogEntryType {
  Major = "Major",
  Minor = "Minor",
  Concentration = "Concentration",
  Unknown = "Unknown",
}

export type TypedCatalogEntry = { url: string; type: CatalogEntryType };
