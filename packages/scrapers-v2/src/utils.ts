import axios from "axios";
import * as cheerio from "cheerio";
import { CatalogHierarchy, CatalogPath } from "./urls/types";

export const loadHTML = async (url: string): Promise<CheerioStatic> => {
  const { data } = await axios.get(url);
  return cheerio.load(data);
};

export const appendPath = (base: string, path: string, hash?: string) => {
  const url = new URL(path, base);
  if (hash) {
    url.hash = hash;
  }
  return url;
};

export const joinParts = (base: string, parts: string[]) => {
  return appendPath(base, parts.join("/"));
};

/**
 * Converts a flat list of entries to catalog hierarchy.
 *
 * @param base         the base catalog URL, i.e. https://catalog.northeastern.edu
 * @param catalogPaths a flat list of paths
 * @returns            catalog hierarchy
 */
export const convertToHierarchy = (
  base: string,
  catalogPaths: CatalogPath[]
): CatalogHierarchy => {
  const hierarchy: CatalogHierarchy = {};
  for (const { path } of catalogPaths) {
    let obj: CatalogHierarchy = hierarchy;

    // For each part of the path, add it to the hierarchy
    // except for the last piece
    for (const part of path.slice(0, -1)) {
      if (!(part in obj)) {
        obj[part] = {};
      }
      const child = obj[part];
      if (typeof child === "string") {
        // shouldn't ever be reached, as long as majors cannot be sub entries of other majors.
        // ex. breaks if a major exists at "coe/marine-bio" and also
        // "coe/marine-bio/fishing-concentration"
        throw new Error(
          "Hierarchy was inconsistent: found a child, where a parent was expected"
        );
      }
      obj = child;
    }

    const last = path[path.length - 1];
    // Obj should equal the parent of the entry
    obj[last] = joinParts(base, path).toString();
  }
  return hierarchy;
};
