import { scrapeMajorDataFromCatalog } from "../src/catalog_scraper";

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
});
