import axios from "axios";
import * as cheerio from "cheerio";
import { Err, Ok, Result } from "@graduate/common";
import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";

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

// whether to cache catalog pages
const USE_CACHE = false;
export const loadHTML = async (url: string): Promise<CheerioStatic> => {
  const data = await cachedGetRequest(url);
  return cheerio.load(data);
};

const cachedGetRequest = async (url: string) => {
  if (!USE_CACHE) {
    const { data } = await axios.get(url);
    return data;
  }

  if (!existsSync("./catalogCache")) {
    await mkdir("./catalogCache");
  }

  // https://stackoverflow.com/questions/35511331/how-to-make-a-valid-filename-from-an-arbitrary-string-in-javascript
  const path = `./catalogCache/${url.replaceAll(/[\/|\\:*?"<>]/g, "-")}`;
  if (existsSync(path)) {
    return await readFile(path);
  }

  const { data } = await axios.get(url);
  await writeFile(path, data);
  return data;
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
