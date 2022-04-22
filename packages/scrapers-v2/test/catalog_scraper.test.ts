import { scrapeMajorDataFromCatalog } from "../src/lexer/lexer";

const format = (path: string) =>
  `https://catalog.northeastern.edu${path}#programrequirementstext`;
const CS_GAME_DEV = format(
  "/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-game-development-bs"
);
const BUSINESS = format("/undergraduate/business/business-administration-bsba");
const PHYSICS = format("/undergraduate/science/physics/physics-bs");
const BSCS = format(
  "/undergraduate/computer-information-science/computer-science/bscs"
);
const MEDIA_SCREEN_STUDIES_HISTORY = format(
  "/undergraduate/arts-media-design/communication-studies/media-screen-studies-history-ba"
);

const CS_HISTORY = format(
  "/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-history-bs"
);
const CHEMICAL_ENG = format(
  "/undergraduate/engineering/chemical/chemical-engineering-bsche"
);

describe("scraper v2 snapshot tests", () => {
  test("CS & Game Dev matches snapshot", async () => {
    expect(await scrapeMajorDataFromCatalog(CS_GAME_DEV)).toMatchSnapshot();
  });
  test("nested linked concentration pages (business)", async () => {
    expect(await scrapeMajorDataFromCatalog(BUSINESS)).toMatchSnapshot();
  });
  test("3 classes per AND (physics)", async () => {
    expect(await scrapeMajorDataFromCatalog(PHYSICS)).toMatchSnapshot();
  });
  // CS 4950 is in the same AND twice for the Foundations concentration
  test("multiple of the same class per AND (cs) ", async () => {
    expect(await scrapeMajorDataFromCatalog(BSCS)).toMatchSnapshot();
  });
  // Range bounded
  test("Test range bounded (history)", async () => {
    expect(
      await scrapeMajorDataFromCatalog(MEDIA_SCREEN_STUDIES_HISTORY)
    ).toMatchSnapshot();
  });
  // Range lower bounded
  test("Test range lower bounded (cs & history)", async () => {
    expect(await scrapeMajorDataFromCatalog(CS_HISTORY)).toMatchSnapshot();
  });
  // Range unbounded
  test("Test range unbounded (chemical engineering)", async () => {
    expect(await scrapeMajorDataFromCatalog(CHEMICAL_ENG)).toMatchSnapshot();
  });
});
