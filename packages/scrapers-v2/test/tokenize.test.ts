import { fetchAndTokenizeHTML } from "../src/tokenize/tokenize";
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
