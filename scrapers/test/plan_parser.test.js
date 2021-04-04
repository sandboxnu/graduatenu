const plan_parser = require("../src/plan_parser.ts");
const fs = require("fs");
const rp = require("request-promise");

// plans of study to run tests on.

// majors on which the scraper has been verified to run correctly:
const supported = [
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-science/bscs/#planofstudytext",
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/bs/#planofstudytext",
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-cognitive-psychology-bs/#planofstudytext",
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/information-science-cognitive-psychology-bs/#planofstudytext",
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/data-science-health-science-bs/#planofstudytext",
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-political-science-bs/#planofstudytext",
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-linguistics-bs/#planofstudytext",
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-mathematics-bs/#planofstudytext",

  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-communication-studies-bs/#planofstudytext",
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-criminal-justice-bs/#planofstudytext",
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/information-science-journalism-bs/#planofstudytext",
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-media-arts-bs/#planofstudytext",

  // This major parses correctly, but has a "Take two courses, at least one of which is at the 4000 or 5000 level, from the following:"
  // which is not handled, and has courses double listed in one location which may not parse correctly (?)
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-philosophy-bs/#planofstudytext",

  // "Complete four ECON electives with at least two numbered at ECON 3000 or above."
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/cybersecurity-economics-bs/#planofstudytext",

  // "Complete four economics electives with no more than two below 3000:"
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-information-science-combined-majors/economics-bs/#planofstudytext",
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/science/biochemistry/biochemistry-bs/#planofstudytext",
  "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/science/mathematics/mathematics-bs/#planofstudytext",
];

const general = [
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-science/bscs/",
  "http://catalog.northeastern.edu/undergraduate/arts-media-design/art-design/design-bfa/",
  "http://catalog.northeastern.edu/undergraduate/social-sciences-humanities/english/english-graphic-information-design-ba/",
  "http://catalog.northeastern.edu/undergraduate/science/marine-environmental/environmental-science-bs/",
  "http://catalog.northeastern.edu/undergraduate/science/marine-environmental/marine-biology-bs/",
  "http://catalog.northeastern.edu/undergraduate/business/business-administration-bsba/",
  "http://catalog.northeastern.edu/undergraduate/engineering/mechanical-industrial/bsme/",
];

const camd_architecture = [
  "http://catalog.northeastern.edu/undergraduate/arts-media-design/architecture/architecture-bs/",
  "http://catalog.northeastern.edu/undergraduate/arts-media-design/architecture/architectural-studies-bs/",
  // this one's weird - only has 3 columns instead of normal 4.
  "http://catalog.northeastern.edu/undergraduate/arts-media-design/architecture/landscape-architecture-bla/",
  // no plan of study available.
  // "http://catalog.northeastern.edu/undergraduate/arts-media-design/architecture/architecture-english-bs/",
  "http://catalog.northeastern.edu/undergraduate/arts-media-design/architecture/architecture-graphic-information-design-bs/",
  "http://catalog.northeastern.edu/undergraduate/engineering/civil-environmental/civil-engineering-architectural-studies-bsce/",
  "http://catalog.northeastern.edu/undergraduate/engineering/civil-environmental/environmental-engineering-landscape-architecture-bsenve/",
  "http://catalog.northeastern.edu/undergraduate/science/marine-environmental/environmental-science-landscape-architecture-bs/",
  // no plan of study available for minors
  // "http://catalog.northeastern.edu/undergraduate/arts-media-design/architecture/architectural-history-minor/",
  // "http://catalog.northeastern.edu/undergraduate/arts-media-design/architecture/architectural-science-systems-minor/",
  // "http://catalog.northeastern.edu/undergraduate/arts-media-design/architecture/urban-landscape-studies-minor/",
];

const khoury = [
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-science/bscs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-science/bacs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/cybersecurity/cybersecurity-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/data-science/data-science-bs/",
  // combined majors
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-design-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-game-development-bs/",
  "http://catalog.northeastern.edu/undergraduate/engineering/electrical-computer/computer-engineering-computer-science-bscompe/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/data-science-psychology-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/data-science-mathematics-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/data-science-journalism-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/data-science-health-science-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/data-science-environmental-science-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/data-science-ecology-evolutionary-biology-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/data-science-business-administration-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/data-science-behavioral-neuroscience-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/data-science-biology-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/data-science-biochemistry-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/cybersecurity-economics-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-science/cybersecurity-criminal-justice-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-science/cybersecurity-business-administration-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-sociology-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-political-science-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-physics-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-philosophy-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-concentration-music-composition-technology-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-media-arts-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-mathematics-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-linguistics-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-journalism-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-history-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-environmental-science-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-english-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/economics-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-criminal-justice-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-communication-studies-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-cognitive-psychology-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-business-administration-bs/",
  "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-biology-bs/",
];

// runs tests
runTestsOnLinks(supported);
runTestsOnLinks(general);
runTestsOnLinks(camd_architecture);
runTestsOnLinks(khoury);

test("ensure that supported majors are still correct, unchanged.", async () => {
  // for each of the majors, download the plans.
  const plans = supported.map(link => rp(link));

  for (plan of plans) {
    const schedules = await plan_parser.planOfStudyToSchedule(await plan);
    expect(schedules).toMatchSnapshot();
  }
});

/**
 * Runs tests on an array of links.
 * @param {string[]} links the links to plans of study to test on.
 */
function runTestsOnLinks(links) {
  jest.setTimeout(30000);
  // download all the links async, stored as strings.
  const plans = links.map(link => rp(link));

  // run tests on the results.
  plans.map((plan, index) => {
    test(
      "Ensures that scraper correctly converts plan of study no. " + index,
      async () => {
        const schedules = await plan_parser.planOfStudyToSchedule(await plan);
        expect(schedules).toBeValidModernScheduleList();
      }
    );
  });
}

// store as a file.
// test("Ensures that scraper correctly converts plan of study no.", async () => {
//   const plan = rp(camd_architecture[2]);
//   const schedules = plan_parser.planOfStudyToSchedule(await plan);

//   // log the file to output.
//   fs.writeFileSync("./schedules2.json", JSON.stringify(schedules, null, 2));
//   expect(schedules).toBeValidModernScheduleList();

// });

// custom matchers for Jest testing.
expect.extend({
  // custom matcher for checking schedule property form.
  toBeValidModernScheduleList(received) {
    expect(received).toBeDefined();
    expect(received).toBeInstanceOf(Array);

    // for each of the schedules, check they are proper.
    for (
      let scheduleIndex = 0;
      scheduleIndex < received.length;
      scheduleIndex += 1
    ) {
      const schedule = received[scheduleIndex];

      // ensure schedule is defined, and is an Object.
      expect(schedule).toBeDefined();
      expect(schedule).toBeInstanceOf(Object);

      // ensure that it has all the proper properties (hava) of a {@interface Schedule}.
      expect(schedule).toHaveProperty("years");
      expect(schedule).toHaveProperty("yearMap");

      // make sure they are of proper tyes
      expect(schedule.years).toBeInstanceOf(Array);
      expect(schedule.yearMap).toBeInstanceOf(Object);

      // all of the years should be properties of yearMap.
      const yearMap = schedule.yearMap;
      for (
        let yearIndex = 0;
        yearIndex < schedule.years.length;
        yearIndex += 1
      ) {
        const yearNumber = schedule.years[yearIndex];

        // expect year to have isSummerFull and year
        expect(yearMap).toHaveProperty("" + yearNumber);
        expect(yearMap[yearNumber]).toBeDefined();
        expect(yearMap[yearNumber]).toBeInstanceOf(Object);

        const yearObj = yearMap[yearNumber];

        // is defined
        expect(yearObj).toBeDefined();
        expect(yearObj).toBeInstanceOf(Object);

        // year object should have a year and a isSummerFull as well as seasons.
        expect(yearObj).toHaveProperty("year");
        expect(yearObj).toHaveProperty("isSummerFull");

        expect(yearObj.year).toEqual(yearNumber);

        // expect the year to have several terms.
        const seasons = ["FL", "SP", "S1", "S2"];
        const seasonIds = [10, 30, 40, 60];
        const terms = ["fall", "spring", "summer1", "summer2"];
        for (
          let seasonsIndex = 0;
          seasonsIndex < seasons.length;
          seasonsIndex += 1
        ) {
          expect(yearObj).toHaveProperty(terms[seasonsIndex]);
          const term = yearObj[terms[seasonsIndex]];

          // should be defined object.
          expect(term).toBeDefined();
          expect(term).toBeInstanceOf(Object);

          // property check
          expect(term).toHaveProperty("season");
          expect(term).toHaveProperty("year");
          expect(term).toHaveProperty("termId");
          expect(term).toHaveProperty("status");
          expect(term).toHaveProperty("classes");

          // check properties of term.
          expect(term.season).toEqual(seasons[seasonsIndex]);
          expect(term.year).toEqual(yearNumber);
          expect(Number(term.termId)).toEqual(
            yearNumber * 100 + seasonIds[seasonsIndex]
          );
          expect(term.status).toMatch(/COOP|CLASSES|INACTIVE/);

          // classes should be defined.
          expect(term.classes).toBeDefined();
          expect(term.classes).toBeInstanceOf(Array);

          // check classes length based on status.
          if (/COOP/.test(term.status)) {
            // if on coop, we may be taking online courses.
            expect(term.classes.length).toBeGreaterThanOrEqual(0);
          } else if (/INACTIVE/.test(term.status)) {
            // if we are inactive, there should be zero courses.
            expect(term.classes.length).toEqual(0);
          } else {
            // we should have courses.
            expect(term.classes.length).toBeGreaterThan(0);

            for (
              let classIndex = 0;
              classIndex < term.classes.length;
              classIndex += 1
            ) {
              // each {@interface ScheduleCourse} should have the correct properties.
              const course = term.classes[classIndex];

              expect(course).toBeDefined();

              // classId, subject, numCreditsMin, numCreditsMax
              expect(course).toHaveProperty("classId");
              expect(course).toHaveProperty("subject");
              expect(course).toHaveProperty("numCreditsMin");
              expect(course).toHaveProperty("numCreditsMax");

              // expect some things about each property.
              expect(Number(course.classId)).toBeGreaterThan(999);
              expect(course.subject.length).toBeGreaterThanOrEqual(2);
              // apparently 0 credit courses exist...
              expect(course.numCreditsMin).toBeGreaterThanOrEqual(0);
              expect(course.numCreditsMax).toBeGreaterThanOrEqual(0);
            }
          }
        }
      }
    }

    return {
      message: () =>
        `expected ${received} not to have valid schedule properties.`,
      pass: true,
    };
  },
});
