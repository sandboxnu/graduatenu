const plan_parser = require("../src/plan_parser.ts");
const fs = require("fs");

// tests using BSCS plan of study. downloaded from:
// "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-science/bscs/#planofstudytext"

// test for deep equality
test("Ensures that the pos parser correctly converts the BSCS plan of study.", () => {
  // the plan of study, as plaintext.
  const plaintext = fs.readFileSync(
    "./backend/test/Computer Science, BSCS < Northeastern University.html",
    "utf-8"
  );

  // get the schedules.
  const schedules = plan_parser.planOfStudyToSchedule(plaintext);

  // should test every schedule produced.
  expect(schedules).toBeValidModernScheduleList();
});

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
      expect(schedule).toHaveProperty("id");

      // make sure they are of proper tyes
      expect(schedule.years).toBeInstanceOf(Array);
      expect(schedule.yearMap).toBeInstanceOf(Object);
      expect(schedule.id).toEqual(scheduleIndex);

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
          expect(term).toHaveProperty("id");
          expect(term).toHaveProperty("status");
          expect(term).toHaveProperty("classes");

          // check properties of term.
          expect(term.season).toEqual(seasons[seasonsIndex]);
          expect(term.year).toEqual(yearNumber);
          expect(term.termId).toEqual(
            yearNumber * 100 + seasonIds[seasonsIndex]
          );
          expect(term.id).toEqual(
            yearNumber * 100 + seasonIds[seasonsIndex] + seasonsIndex
          );
          expect(term.status).toMatch(/COOP|CLASSES|INACTIVE/);

          // classes should be defined.
          expect(term.classes).toBeDefined();
          expect(term.classes).toBeInstanceOf(Array);

          // check classes length based on status.
          if (/COOP|INACTIVE/.test(term.status)) {
            // if we are on coop or inactive, there should be zero courses.
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
              expect(course.classId).toBeGreaterThan(1000);
              expect(course.subject.length).toBeGreaterThanOrEqual(2);
              expect(course.numCreditsMin).toBeGreaterThan(0);
              expect(course.numCreditsMax).toBeGreaterThan(0);
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
