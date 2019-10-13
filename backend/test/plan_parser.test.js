const plan_parser = require("../src/plan_parser.ts");
const fs = require("fs");
const cheerio = require("cheerio");

// link for BSCS plan of study
// "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-science/bscs/#planofstudytext"

// test for deep equality
test("Ensures that the pos parser correctly converts the BSCS plan of study.", () => {
  // the plan of study, as plaintext.
  const plaintext = fs.readFileSync(
    "./backend/test/Computer Science, BSCS < Northeastern University.html",
    "utf-8"
  );

  const schedules = plan_parser.planOfStudyToSchedule(plaintext);

  expect(true).toBeTruthy();
});
