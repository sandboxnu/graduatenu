const prereq_loader = require("../src/prereq_loader");
const rp = require("request-promise");
const plan_parser = require("../src/plan_parser");

test("Ensure that prereqs are successfully added to Computer Science BSCS plans of study.", async () => {
  const link =
    "http://catalog.northeastern.edu/undergraduate/computer-information-science/computer-science/bscs/#planofstudytext";
  const page = await rp(link);
  const schedules = plan_parser.planOfStudyToSchedule(page);

  const enhancedSchedules = await prereq_loader.addPrereqsToSchedules(
    schedules
  );
  expect(enhancedSchedules[0]).toStrictEqual({
    years: [1000, 1001, 1002, 1003],
    yearMap: {
      "1000": {
        year: 1000,
        fall: {
          season: "FL",
          year: 1000,
          termId: 100010,
          id: 1010,
          classes: [
            {
              classId: "1200",
              subject: "CS",
              numCreditsMin: 1,
              numCreditsMax: 1,
              prereqs: {
                type: "and",
                values: [],
              },
              coreqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1800",
              subject: "CS",
              numCreditsMin: 5,
              numCreditsMax: 5,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1802",
                    subject: "CS",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1802",
              subject: "CS",
              numCreditsMin: 0,
              numCreditsMax: 0,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1800",
                    subject: "CS",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "2500",
              subject: "CS",
              numCreditsMin: 5,
              numCreditsMax: 5,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "2501",
                    subject: "CS",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "2501",
              subject: "CS",
              numCreditsMin: 0,
              numCreditsMax: 0,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "2500",
                    subject: "CS",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1365",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1111",
              subject: "ENGW",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
          ],
          status: "CLASSES",
        },
        spring: {
          season: "SP",
          year: 1000,
          termId: 100030,
          id: 1030,
          classes: [
            {
              classId: "2510",
              subject: "CS",
              numCreditsMin: 5,
              numCreditsMax: 5,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "2511",
                    subject: "CS",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "2500",
                    subject: "CS",
                  },
                ],
              },
            },
            {
              classId: "2511",
              subject: "CS",
              numCreditsMin: 0,
              numCreditsMax: 0,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "2510",
                    subject: "CS",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "2810",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "1800",
                    subject: "CS",
                  },
                  {
                    classId: "2500",
                    subject: "CS",
                  },
                ],
              },
              coreqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "9999",
              subject: "Elective",
              numCreditsMin: 5,
              numCreditsMax: 5,
            },
            {
              classId: "9999",
              subject: "Elective",
              numCreditsMin: 4,
              numCreditsMax: 4,
            },
          ],
          status: "CLASSES",
        },
        summer1: {
          season: "S1",
          year: 1000,
          termId: 100040,
          id: 1040,
          classes: [
            {
              classId: "3500",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "2510",
                    subject: "CS",
                  },
                  {
                    classId: "1500",
                    subject: "CS",
                    missing: true,
                  },
                  {
                    classId: "2560",
                    subject: "EECE",
                  },
                ],
              },
              coreqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "9999",
              subject: "Elective",
              numCreditsMin: 4,
              numCreditsMax: 4,
            },
          ],
          status: "CLASSES",
        },
        summer2: {
          season: "S2",
          year: 1000,
          termId: 100060,
          id: 1060,
          classes: [
            {
              classId: "1341",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "3000",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "1500",
                    subject: "CS",
                    missing: true,
                  },
                  {
                    type: "and",
                    values: [
                      {
                        classId: "2510",
                        subject: "CS",
                      },
                      {
                        classId: "1800",
                        subject: "CS",
                      },
                    ],
                  },
                  {
                    classId: "2160",
                    subject: "EECE",
                  },
                  {
                    classId: "2162",
                    subject: "EECE",
                    missing: true,
                  },
                  {
                    classId: "2164",
                    subject: "EECE",
                    missing: true,
                  },
                ],
              },
              coreqs: {
                type: "and",
                values: [],
              },
            },
          ],
          status: "CLASSES",
        },
        isSummerFull: false,
      },
      "1001": {
        year: 1001,
        fall: {
          season: "FL",
          year: 1001,
          termId: 100110,
          id: 1011,
          classes: [
            {
              classId: "3650",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "2510",
                    subject: "CS",
                  },
                  {
                    classId: "1500",
                    subject: "CS",
                    missing: true,
                  },
                  {
                    classId: "2560",
                    subject: "EECE",
                  },
                ],
              },
              coreqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "2160",
              subject: "EECE",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "1111",
                    subject: "GE",
                  },
                  {
                    classId: "1502",
                    subject: "GE",
                  },
                  {
                    classId: "3500",
                    subject: "CS",
                  },
                ],
              },
              coreqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "9999",
              subject: "Concentration course",
              numCreditsMin: 4,
              numCreditsMax: 4,
            },
            {
              classId: "9999",
              subject: "Elective",
              numCreditsMin: 4,
              numCreditsMax: 4,
            },
            {
              classId: "1210",
              subject: "CS",
              numCreditsMin: 1,
              numCreditsMax: 1,
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "2510",
                    subject: "CS",
                  },
                ],
              },
              coreqs: {
                type: "and",
                values: [],
              },
            },
          ],
          status: "CLASSES",
        },
        spring: {
          season: "SP",
          year: 1001,
          termId: 100130,
          id: 1031,
          classes: [],
          status: "COOP",
        },
        summer1: {
          season: "S1",
          year: 1001,
          termId: 100140,
          id: 1041,
          classes: [],
          status: "COOP",
        },
        summer2: {
          season: "S2",
          year: 1001,
          termId: 100160,
          id: 1061,
          classes: [
            {
              classId: "9999",
              subject: "Elective",
              numCreditsMin: 4,
              numCreditsMax: 4,
            },
            {
              classId: "9999",
              subject: "Elective",
              numCreditsMin: 4,
              numCreditsMax: 4,
            },
          ],
          status: "CLASSES",
        },
        isSummerFull: false,
      },
      "1002": {
        year: 1002,
        fall: {
          season: "FL",
          year: 1002,
          termId: 100210,
          id: 1012,
          classes: [
            {
              classId: "3800",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "1500",
                    subject: "CS",
                    missing: true,
                  },
                  {
                    classId: "2510",
                    subject: "CS",
                  },
                  {
                    classId: "2160",
                    subject: "EECE",
                  },
                  {
                    classId: "2162",
                    subject: "EECE",
                    missing: true,
                  },
                  {
                    classId: "2164",
                    subject: "EECE",
                    missing: true,
                  },
                ],
              },
              coreqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1170",
              subject: "THTR",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "9999",
              subject: "Concentration course",
              numCreditsMin: 4,
              numCreditsMax: 4,
            },
            {
              classId: "9999",
              subject: "Elective",
              numCreditsMin: 4,
              numCreditsMax: 4,
            },
            {
              classId: "9999",
              subject: "Computing and social issues",
              numCreditsMin: 4,
              numCreditsMax: 4,
            },
          ],
          status: "CLASSES",
        },
        spring: {
          season: "SP",
          year: 1002,
          termId: 100230,
          id: 1032,
          classes: [],
          status: "COOP",
        },
        summer1: {
          season: "S1",
          year: 1002,
          termId: 100240,
          id: 1042,
          classes: [],
          status: "COOP",
        },
        summer2: {
          season: "S2",
          year: 1002,
          termId: 100260,
          id: 1062,
          classes: [
            {
              classId: "3302",
              subject: "ENGW",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "1102",
                    subject: "ENGW",
                  },
                  {
                    classId: "1111",
                    subject: "ENGW",
                  },
                  {
                    classId: "1102",
                    subject: "ENGL",
                    missing: true,
                  },
                  {
                    classId: "1111",
                    subject: "ENGL",
                    missing: true,
                  },
                ],
              },
              coreqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "9999",
              subject: "Elective",
              numCreditsMin: 4,
              numCreditsMax: 4,
            },
          ],
          status: "CLASSES",
        },
        isSummerFull: false,
      },
      "1003": {
        year: 1003,
        fall: {
          season: "FL",
          year: 1003,
          termId: 100310,
          id: 1013,
          classes: [
            {
              classId: "4500",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "3500",
                    subject: "CS",
                  },
                  {
                    type: "or",
                    values: [
                      {
                        classId: "1111",
                        subject: "ENGL",
                        missing: true,
                      },
                      {
                        classId: "1102",
                        subject: "ENGL",
                        missing: true,
                      },
                      {
                        classId: "1111",
                        subject: "ENGW",
                      },
                      {
                        classId: "1102",
                        subject: "ENGW",
                      },
                    ],
                  },
                ],
              },
              coreqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "9999",
              subject: "Elective",
              numCreditsMin: 4,
              numCreditsMax: 4,
            },
            {
              classId: "9999",
              subject: "Concentration course",
              numCreditsMin: 4,
              numCreditsMax: 4,
            },
            {
              classId: "9999",
              subject: "Elective",
              numCreditsMin: 5,
              numCreditsMax: 5,
            },
          ],
          status: "CLASSES",
        },
        spring: {
          season: "SP",
          year: 1003,
          termId: 100330,
          id: 1033,
          classes: [
            {
              classId: "9999",
              subject: "Concentration course",
              numCreditsMin: 4,
              numCreditsMax: 4,
            },
            {
              classId: "9999",
              subject: "Elective",
              numCreditsMin: 4,
              numCreditsMax: 4,
            },
            {
              classId: "9999",
              subject: "Security course",
              numCreditsMin: 4,
              numCreditsMax: 4,
            },
            {
              classId: "9999",
              subject: "Elective",
              numCreditsMin: 4,
              numCreditsMax: 4,
            },
          ],
          status: "CLASSES",
        },
        summer1: {
          season: "S1",
          year: 1003,
          termId: 100340,
          id: 1043,
          classes: [],
          status: "INACTIVE",
        },
        summer2: {
          season: "S2",
          year: 1003,
          termId: 100360,
          id: 1063,
          classes: [],
          status: "INACTIVE",
        },
        isSummerFull: false,
      },
    },
    id: "0",
  });

  for (const schedule of enhancedSchedules) {
    expect(schedule.years).toBeInstanceOf(Array);
  }

  expect(200).toEqual(200);
});

test("Ensure that prereqs and coreqs for CS 2810 are successfully added to a schedule containing just CS 2810.", async () => {
  const mockSched = {
    years: [1000],
    yearMap: {
      "1000": {
        year: 1000,
        fall: {
          season: "FL",
          year: 1000,
          termId: 100010,
          id: 1010,
          classes: [],
          status: "INACTIVE",
        },
        spring: {
          season: "SP",
          year: 1000,
          termId: 100030,
          id: 1030,
          classes: [
            {
              classId: "2810",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "1800",
                    subject: "CS",
                  },
                  {
                    classId: "2500",
                    subject: "CS",
                  },
                ],
              },
              coreqs: {
                type: "and",
                values: [],
              },
            },
          ],
          status: "CLASSES",
        },
        summer1: {
          season: "S1",
          year: 1000,
          termId: 100040,
          id: 1040,
          classes: [],
          status: "INACTIVE",
        },
        summer2: {
          season: "S2",
          year: 1000,
          termId: 100060,
          id: 1060,
          classes: [],
          status: "INACTIVE",
        },
        isSummerFull: false,
      },
    },
  };

  const enhancedSchedules = await prereq_loader.addPrereqsToSchedules(
    [mockSched],
    2020
  );

  expect(enhancedSchedules).toBeDefined();
  expect(enhancedSchedules.length).toEqual(1);

  const withPrereqsCoreqs = enhancedSchedules[0];

  // ensure that the property exists, first of all.
  expect(withPrereqsCoreqs).toBeDefined();
  expect(withPrereqsCoreqs).toHaveProperty("yearMap");
  expect(withPrereqsCoreqs.yearMap).toHaveProperty("1000");
  expect(withPrereqsCoreqs.yearMap[1000]).toHaveProperty("spring");
  expect(withPrereqsCoreqs.yearMap[1000].spring).toHaveProperty("classes");

  // check that the array has the one element.
  expect(withPrereqsCoreqs.yearMap[1000].spring.classes).toBeInstanceOf(Array);
  expect(withPrereqsCoreqs.yearMap[1000].spring.classes.length).toEqual(1);

  // cs 2810, with now updated prereqs/coreqs.
  const cs2810 = withPrereqsCoreqs.yearMap[1000].spring.classes[0];

  // expect the prereqs to exist.
  expect(cs2810).toBeInstanceOf(Object);
  expect(cs2810).toHaveProperty("prereqs");
  expect(cs2810).toHaveProperty("coreqs");

  // checks on the prereqs/coreqs.
  const prereqs = cs2810.prereqs;
  const coreqs = cs2810.coreqs;

  // strict check on the prereqs.
  expect(prereqs).toStrictEqual({
    type: "and",
    values: [
      {
        classId: "1800",
        subject: "CS",
      },
      {
        classId: "2500",
        subject: "CS",
      },
    ],
  });

  // strict check on the coreqs.
  expect(coreqs).toStrictEqual({
    type: "and",
    values: [],
  });
});

// const fs = require('fs');
// test("Writes testing files for mitch", async () => {
//     const links = [
//       "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/computer-information-science/computer-science/bscs/",
//       "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/science/biochemistry/biochemistry-bs/",
//       "http://catalog.northeastern.edu/archive/2018-2019/undergraduate/science/mathematics/mathematics-bs/"
//     ];

//     const pages = await Promise.all(links.map((link) => rp(link)));

//     const schedules = pages.map((page) => plan_parser.planOfStudyToSchedule(page));

//     const withPrereqs = await Promise.all(schedules.map((plans) => prereq_loader.addPrereqsToSchedules(plans)));

//     for (let i = 0; i < withPrereqs.length; i += 1) {
//       fs.writeFile(`schedules${i}.json`, JSON.stringify(withPrereqs[i], null, 2));
//     }
//     expect(true).toBeTruthy();
// });

// this works:
/* const querySchema = `
query {
  class1: class(subject: "CS", classId: 2500) {
    occurrence(termId: 202010) {
      name
    }
  }
}`;

const queryObj = {
  query: querySchema,
}

// make the request.
// request result is a string.
let queryResult = await rp({
  uri: "https://searchneu.com/graphql",
  method: 'POST',
  body: JSON.stringify(queryObj),
  headers: {
    'Content-type': 'application/json'
  }
});

let objResult = JSON.parse(queryResult);
console.log(objResult); */
