import { appendPath, loadHTML } from "../utils";
import { AvailableMajors, College, MajorPath } from "./types";

export const scrapeMajorLinks = async (start: number, end: number) => {
  if (start !== end - 1) {
    throw new Error("start should == end-1");
  }

  if (start < 2016) {
    // this is because there is no HTML version of those catalogs
    throw new Error("scraping for years before 2016-2017 are not supported");
  }

  if (start !== 2021) {
    // todo: implement generic scraping from overall archive
    // https://registrar.northeastern.edu/group/academic-catalogs/
    throw new Error("only current year is supported");
  }

  return scrapeMajorLinksForUrl(
    "https://catalog.northeastern.edu/undergraduate"
  );
};

export const scrapeMajorLinksForUrl = async (
  baseUrl: string
): Promise<AvailableMajors> => {
  try {
    // we visit the baseUrl appended with each of the college hardcoded paths
    // baseUrl should match something like:
    // - https://catalog.northeastern.edu/undergraduate/
    // - https://catalog.northeastern.edu/archive/2018-2019/undergraduate/
    // college hardcoded path looks like this:
    // - college-information-science
    const initStack = Object.values(College).map((college) => ({
      college,
      path: [],
    }));
    return dfsMajors(baseUrl, initStack);
  } catch (e) {
    throw e;
  }
};

// stack: array<array<string>>
// each item is a list of paths
// when an item is "done", we add it to the list corresponding to top-level path
const dfsMajors = async (
  base: string,
  stack: MajorPath[]
): Promise<AvailableMajors> => {
  const done: AvailableMajors = {
    ARTS_MEDIA_DESIGN: [],
    BUSINESS: [],
    ENGINEERING: [],
    HEALTH_SCIENCES: [],
    KHOURY: [],
    SCIENCE: [],
    SOCIAL_SCIENCES_HUMANITIES: [],
  };
  // for each url: click
  // <page reload>
  // find parent
  // does it have children? if so, recur
  // else push link

  // invariant: all strings in next.paths do NOT have spaces or trailing slashes

  while (stack.length > 0) {
    const next = stack.pop()!;
    const url = getPath(base, next);
    const $ = await loadHTML(url);
    const id = ["", "undergraduate", next.college, ...next.path, ""].join(
      "\\/"
    );
    const current = $("#" + id);
    const links = current.find("li > a").toArray();
    // console.log(links.map(l => $(l).text()));
    if (links.length > 0) {
      // get children
      // todo: add children to stack
      const children = links.map($).map((child) => {
        const path = child.attr("href");
        const parts = getParts(path);
        const idx = parts.indexOf(next.college);
        const keep = parts.slice(idx + 1);
        console.log(keep);
        return {
          college: next.college,
          path: keep,
        };
      });
      stack.push(...children);
    } else {
      // scrape
      // add to done listcon
      const path = getPath(base, next);
      console.log("adding:", path);
    }
  }

  return done;
};

const isParent = (el: Cheerio) => {
  return el.hasClass("isparent");
};

// const getChildren = (current: Cheerio) => {
//
//
//   const links = parent.find("ul > li > a");
//
//   // if is parent:
//
//   const el = $(`#${id}`)
// }

const getPath = (base: string, major: MajorPath) => {
  const relative = [major.college, ...major.path].join("/");
  // todo: find a better way to append
  // return appendPath(base, relative);
  return `${base}/${relative}`;
};

const getParts = (url: string) => {
  return url.split("/").filter((s) => s !== "");
};
