import {
  fetchAndTokenizeHTML,
  getRequirementsContainer,
} from "../src/tokenize/tokenize";
import {
  ARCH_ENGLISH,
  BIOENG_BIOCHEM,
  BSCS,
  BUSINESS,
  CHEMICAL_ENG,
  CS_GAME_DEV,
  CS_HISTORY,
  CS_MATH,
  MEDIA_SCREEN_STUDIES_HISTORY,
  PHARM_SCI_BS,
  PHARMD,
  PHYSICS,
  PUBLIC_HEALTH_BA,
} from "./testUrls";
import { loadHTML } from "../src/utils";
import { parseCatalogEntryHtml } from "../src/tokenize/parseCatalogEntryHtml";
import {
  ParseHtmlH2,
  ParseHtmlH3,
  ParseHtmlH5,
  ParseHtmlLeafList,
  ParseHtmlMain,
} from "../src/tokenize/postprocessCatalogEntryHtml";

describe("scraper v2 snapshot tests", () => {
  test("CS & Game Dev matches snapshot", async () => {
    expect(await fetchAndTokenizeHTML(CS_GAME_DEV)).toMatchSnapshot();
  });
  test("nested linked concentration pages (business)", async () => {
    expect(await fetchAndTokenizeHTML(BUSINESS)).toMatchSnapshot();
  });
  test("3 classes per AND (physics)", async () => {
    expect(await fetchAndTokenizeHTML(PHYSICS)).toMatchSnapshot();
  });
  // CS 4950 is in the same AND twice for the Foundations concentration
  test("multiple of the same class per AND (cs) ", async () => {
    expect(await fetchAndTokenizeHTML(BSCS)).toMatchSnapshot();
  });
  // Range bounded
  test("Test range bounded (history)", async () => {
    expect(
      await fetchAndTokenizeHTML(MEDIA_SCREEN_STUDIES_HISTORY)
    ).toMatchSnapshot();
  });
  // Range bounded with exceptions
  test("Test range bounded with exceptions (cs and math)", async () => {
    expect(await fetchAndTokenizeHTML(CS_MATH)).toMatchSnapshot();
  });
  // Range lower bounded
  test("Test range lower bounded (cs & history)", async () => {
    expect(await fetchAndTokenizeHTML(CS_HISTORY)).toMatchSnapshot();
  });
  // Range unbounded
  test("Test range unbounded (chemical engineering)", async () => {
    expect(await fetchAndTokenizeHTML(CHEMICAL_ENG)).toMatchSnapshot();
  });
  // Or of ands
  test("Test OR of ANDs (bioengineering biochemistry)", async () => {
    expect(await fetchAndTokenizeHTML(BIOENG_BIOCHEM)).toMatchSnapshot();
  });
  // no tabs
  test("Test NO tabs (architecture and english)", async () => {
    expect(await fetchAndTokenizeHTML(ARCH_ENGLISH)).toMatchSnapshot();
  });
  describe("weird program requirement hours text placement", () => {
    const get = (url: URL) =>
      fetchAndTokenizeHTML(url).then((h) => h.programRequiredHours);
    test("Minimum of x hours", async () => {
      expect(await get(PUBLIC_HEALTH_BA)).toBeGreaterThan(0);
    });
    test("paragraph in front of `x total hrs`", async () => {
      expect(await get(PHARMD)).toBeGreaterThan(0);
    });
    test("paragraph in front of `Minimum of x hrs`", async () => {
      expect(await get(PHARM_SCI_BS)).toBeGreaterThan(0);
    });
  });
});

describe("parser", () => {
  // tests can't serialize the full cheerio outputs, so just take element type (name)
  const getTokens = async (url: URL) => {
    const $ = await loadHTML(url.href);
    return getRequirementsContainer($).children().toArray();
  };

  test("cs game dev", async () => {
    const tokens = await getTokens(CS_GAME_DEV);

    expect(tokens.length).toBeGreaterThan(0);
    expect(simplify(parseCatalogEntryHtml(tokens))).toMatchSnapshot();
  });

  test("nested linked concentration pages (business)", async () => {
    const tokens = await getTokens(BUSINESS);

    expect(tokens.length).toBeGreaterThan(0);
    expect(simplify(parseCatalogEntryHtml(tokens))).toMatchSnapshot();
  });
});

const simplify = (input: ParseHtmlMain) => {
  return {
    leadingLeafList: simplifyLeafList(input.leadingLeafList),
    leadingH5s: input.leadingH5s.map(simplifyH35),
    leadingH3s: input.leadingH3s.map(simplifyH35),
    h2s: input.h2s.map(simplifyH2),
  };
};

const simplifyLeafList = (l: ParseHtmlLeafList) => {
  return l.map((e) => e.name);
};

const simplifyH35 = (input: ParseHtmlH5 | ParseHtmlH3) => {
  return {
    type: input.header.name,
    leafList: simplifyLeafList(input.leafList),
  };
};

const simplifyH2 = (input: ParseHtmlH2) => {
  return {
    type: input.header.name,
    h3s: input.h3s.map(simplifyH35),
    leadingLeafList: simplifyLeafList(input.leadingLeafList),
  };
};
