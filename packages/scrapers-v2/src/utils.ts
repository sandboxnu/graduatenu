import * as cheerio from "cheerio";
import { Err, Ok, Result } from "@graduate/common";
import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import undici from "undici";

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

/**
 * Whether to cache the response bodies of requests. if set to true,
 * `cachedGetRequest` will cache requests.
 */
const USE_CACHE = true;
export const loadHTML = async (url: string): Promise<CheerioStatic> => {
  const data = await cachedGetRequest(url);
  return cheerio.load(data);
};

/**
 * If use cache is true, will attempt to look for request body in
 * `./catalogCache` before fetching. If does not exist, will save the response
 * in `./catalogCache` before returning response.
 *
 * @param url
 */
const cachedGetRequest = async (url: string) => {
  if (!USE_CACHE) {
    return await wrappedGetRequest(url);
  }

  if (!existsSync("./catalogCache")) {
    await mkdir("./catalogCache");
  }

  // https://stackoverflow.com/questions/35511331/how-to-make-a-valid-filename-from-an-arbitrary-string-in-javascript
  const path = `./catalogCache/${url.replaceAll(/[\/|\\:*?"<>]/g, "-")}`;
  if (existsSync(path)) {
    return await readFile(path);
  }

  const data = await wrappedGetRequest(url);
  await writeFile(path, data);
  return data;
};

const wrappedGetRequest = async (url: string) => {
  const response = await undici.request(url, { maxRedirections: 1 });
  if (response.statusCode !== 200) {
    throw new Error(`non-ok status code: ${response.statusCode}, url: ${url}`);
  }
  return await response.body.text();
};

export const ensureLength = <T>(n: number, l: T[], extraMessage?: String) => {
  const length = l.length;
  if (length !== n) {
    const msg = `expected array length to equal exactly ${n}, but was ${length}${extraMessage ?? ""}`;
    throw new Error(msg);
  }
  return l;
};

export const ensureLengthAtLeast = <T>(n: number, l: T[]) => {
  const length = l.length;
  if (length < n) {
    const msg = `expected array to be >= ${n}, but was ${length}`;
    throw new Error(msg);
  }
  return l;
};

export const parseText = (td: Cheerio) => {
  // replace &NBSP with space
  return td.text().replaceAll("\xa0", " ").trim();
};
