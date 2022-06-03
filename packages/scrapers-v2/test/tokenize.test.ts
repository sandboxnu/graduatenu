import { fetchAndTokenizeHTML } from "../src/tokenize/tokenize";
import {
  CS_GAME_DEV,
  BUSINESS,
  PHYSICS,
  BSCS,
  MEDIA_SCREEN_STUDIES_HISTORY,
  CS_HISTORY,
  CHEMICAL_ENG,
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
  // Range lower bounded
  test("Test range lower bounded (cs & history)", async () => {
    expect(await fetchAndTokenizeHTML(CS_HISTORY)).toMatchSnapshot();
  });
  // Range unbounded
  test("Test range unbounded (chemical engineering)", async () => {
    expect(await fetchAndTokenizeHTML(CHEMICAL_ENG)).toMatchSnapshot();
  });
});
