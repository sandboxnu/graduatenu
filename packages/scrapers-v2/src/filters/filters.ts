import { CatalogHierarchy } from "../urls/types";
import { CatalogEntryType } from "./types";

export const filterByEntryType = (
  hierarchy: CatalogHierarchy<{ url: string }>,
  include: CatalogEntryType[]
): CatalogHierarchy<{ url: string, type: CatalogEntryType }> => {
  // function to add the type
  // function to filter
  throw "unimplemented!";
};

const applyToHierarchy = async (leaf: T) => {

}
const addType = (hierarchy: CatalogHierarchy<{  url :string }>)
