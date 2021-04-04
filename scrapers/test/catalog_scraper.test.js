var catalogToMajor = require("../src/catalog-scraper/catalog_scraper.ts");

var fs = require("fs");
const rp = require("request-promise");
const plan_parser = require();
("../src/plan_parser.ts");
const majors = require("../../common/constants");
const { supported2018_2019, supported2019_2020, supported2020_2021 } = majors;

//run tests
test("ensure that catalog_scraper produces the expected output for supported majors.", async () => {
  jest.setTimeout(200000);
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

async function createObject(acc, link, major) {
  const plansOfStudy = await plan_parser.planOfStudyToSchedule(await rp(link));
  const { yearVersion } = major;
  const id = link
    .replace("/#programrequirementstext", "")
    .split("undergraduate/")[1];
  acc.push({ plansOfStudy, yearVersion, id, major });
}
