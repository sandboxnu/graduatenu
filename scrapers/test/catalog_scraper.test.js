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

  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-communication-studies-bs/#programrequirementstext",
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-criminal-justice-bs/#programrequirementstext",
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/information-science-journalism-bs/#programrequirementstext",
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-media-arts-bs/#programrequirementstext",

  // This major parses correctly, but has a "Take two courses, at least one of which is at the 4000 or 5000 level, from the following:"
  // which is not handled, and has courses double listed in one location which may not parse correctly (?)
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-philosophy-bs/#programrequirementstext",

  // "Complete four ECON electives with at least two numbered at ECON 3000 or above."
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/cybersecurity-economics-bs/#programrequirementstext",

  // "Complete four economics electives with no more than two below 3000:"
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/economics-bs/#programrequirementstext",
];

//run tests
test("ensure that catalog_scraper produces the expected output for supported majors.", async () => {
  // for each of the majors, create promises that resolve to the Major object.
  for (link of supported) {
    major = await catalogToMajor(link);
    expect(major).toMatchSnapshot();
  }
});
