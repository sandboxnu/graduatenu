import axios from "axios";
import * as cheerio from "cheerio";
import { CatalogHierarchy } from "./urls/types";

export const loadHTML = async (url: string): Promise<CheerioStatic> => {
  try {
    const { data } = await axios.get(url);
    return cheerio.load(data);
  } catch (error) {
    console.log("request failed:", url);
    throw error;
  }
};

export const appendPath = (base: string, path: string, hash?: string) => {
  const url = new URL(path, base);
  if (hash) {
    url.hash = hash;
  }
  return url;
};

export const ensureLength = <T>(n: number, l: T[]) => {
  const length = l.length;
  if (length !== n) {
    const msg = `expected text row to contain exactly ${n} cells, found ${length}`;
    throw new Error(msg);
  }
  return l;
};

export const ensureLengthAtLeast = <T>(n: number, l: T[]) => {
  const length = l.length;
  if (length < n) {
    const msg = `expected text row to contain at least ${n} cells, found ${length}`;
    throw new Error(msg);
  }
  return l;
};

export const parseText = (td: Cheerio) => {
  // replace &NBSP with space
  return td.text().replaceAll("\xa0", " ").trim();
};

export const flattenCatalogHierarchy = <T extends { url: string }>(
  hierarchy: CatalogHierarchy<T>
): T[] => {
  const list: T[] = [];
  const isLeaf = (node: T | CatalogHierarchy<T>): node is T => {
    // note: this doesn't work if "url" happens to be a key in the hierarchy
    // but that probably won't ever happen... right?
    return "url" in node;
  };
  const recur = (node: T | CatalogHierarchy<T>) => {
    if (isLeaf(node)) {
      // it's a leaf!
      list.push(node);
    } else {
      for (const child of Object.values(node)) {
        recur(child);
      }
    }
  };
  recur(hierarchy);
  return list;
};
