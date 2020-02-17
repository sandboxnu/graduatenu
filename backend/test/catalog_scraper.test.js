var catalogToMajor = require("../src/catalog_scraper.ts");

// majors to run tests on

// majors on which the scraper has been verified to run correctly:
const supported = [
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-science/bscs/#programrequirementstext",
];

//run tests
test("ensure that catalog_scraper produces the expected output for supported majors.", async () => {
  // for each of the majors, create promises that resolve to the Major object.
  for (link of supported) {
    major = await catalogToMajor(link);
    expect(major).toMatchSnapshot();
  }

  console.log("here");
});
