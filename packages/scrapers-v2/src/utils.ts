import axios from "axios";
import * as cheerio from "cheerio";
import { Err, Ok, Result } from "@graduate/common";

export const loadHtmlWithUrl = async (
  url: URL
): Promise<{ url: URL; result: Result<CheerioStatic, unknown> }> => {
  let result: Result<CheerioStatic, unknown>;
  try {
    result = Ok(await loadHTML(url.href));
  } catch (error) {
    result = Err(error);
  }
  return { url, result };
};

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

export const joinParts = (base: string, parts: string[]) => {
  return appendPath(base, parts.join("/"));
};

export const getPathParts = (path: string) => {
  return path.split("/").filter((s) => s !== "");
};
