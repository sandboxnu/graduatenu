var catalogToMajor = require("../src/catalog-scraper/catalog_scraper.ts");
const majors = require("@graduate/common");
const { supported2018_2019, supported2019_2020, supported2020_2021 } = majors;

//run tests
jest.setTimeout(200000);
test("ensure that catalog_scraper produces the expected output for supported majors.", async () => {
  // for each of the majors, create promises that resolve to the Major object.
  for (link of supported2018_2019) {
    major = await catalogToMajor(link);
    expect(major).toMatchSnapshot();
  }
  for (link of supported2019_2020) {
    major = await catalogToMajor(link);
    expect(major).toMatchSnapshot();
  }
  for (link of supported2020_2021) {
    major = await catalogToMajor(link);
    expect(major).toMatchSnapshot();
  }
});
