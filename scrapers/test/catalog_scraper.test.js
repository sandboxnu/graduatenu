var catalogToMajor = require("../src/catalog-scraper/catalog_scraper.ts");

// majors to run tests on

// majors on which the scraper has been verified to run correctly:
const supported = [
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-science/bscs/#programrequirementstext",
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/bs/#programrequirementstext",
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-cognitive-psychology-bs/#programrequirementstext",
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/information-science-cognitive-psychology-bs/#programrequirementstext",
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/data-science-health-science-bs/#programrequirementstext",
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-political-science-bs/#programrequirementstext",
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-linguistics-bs/#programrequirementstext",
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-mathematics-bs/#programrequirementstext",
];

//run tests
test("ensure that catalog_scraper produces the expected output for supported majors.", async () => {
  // for each of the majors, create promises that resolve to the Major object.
  for (link of supported) {
    major = await catalogToMajor(link);
    expect(major).toMatchSnapshot();
  }
});
