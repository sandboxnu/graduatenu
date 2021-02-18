import { Schedule } from "../../../common/types";

export const csPlans: Schedule[] = [
  {
    years: [1000, 1001, 1002, 1003],
    yearMap: {
      "1000": {
        year: 1000,
        fall: {
          season: "FL",
          year: 1000,
          termId: 100010,
          classes: [
            {
              classId: "1200",
              subject: "CS",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "Leadership Skill Development",
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
              classId: "1800",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Discrete Structures",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CS",
                    classId: "1802",
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
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "Seminar for CS 1800",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CS",
                    classId: "1800",
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
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Fundamentals of Computer Science 1",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CS",
                    classId: "2501",
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
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "Lab for CS 2500",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CS",
                    classId: "2500",
                  },
                ],
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
              semester: null,
              name: "First-Year Writing",
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
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective",
            },
          ],
          status: "CLASSES",
        },
        spring: {
          season: "SP",
          year: 1000,
          termId: 100030,
          classes: [
            {
              classId: "2510",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Fundamentals of Computer Science 2",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CS",
                    classId: "2511",
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
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "Lab for CS 2510",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CS",
                    classId: "2510",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "2800",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Logic and Computation",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CS",
                    classId: "2801",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [
                  {
                    type: "or",
                    values: [
                      {
                        classId: "1800",
                        subject: "CS",
                      },
                      {
                        classId: "1365",
                        subject: "MATH",
                      },
                      {
                        classId: "2310",
                        subject: "MATH",
                        missing: true,
                      },
                    ],
                  },
                  {
                    classId: "2500",
                    subject: "CS",
                  },
                ],
              },
            },
            {
              classId: "2801",
              subject: "CS",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "Lab for CS 2800",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CS",
                    classId: "2800",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1341",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Calculus 1 for Science and Engineering",
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
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective",
            },
          ],
          status: "CLASSES",
        },
        summer1: {
          season: "S1",
          year: 1000,
          termId: 100040,
          classes: [
            {
              classId: "3500",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Object-Oriented Design",
              coreqs: {
                type: "and",
                values: [],
              },
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
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective",
            },
          ],
          status: "CLASSES",
        },
        summer2: {
          season: "S2",
          year: 1000,
          termId: 100060,
          classes: [
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective",
            },
            {
              classId: "1342",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Calculus 2 for Science and Engineering",
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
        isSummerFull: false,
      },
      "1001": {
        year: 1001,
        fall: {
          season: "FL",
          year: 1001,
          termId: 100110,
          classes: [
            {
              classId: "3650",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Computer Systems",
              coreqs: {
                type: "and",
                values: [],
              },
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
            },
            {
              classId: "3000",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Algorithms and Data",
              coreqs: {
                type: "and",
                values: [],
              },
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
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective",
            },
            {
              classId: "1210",
              subject: "CS",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "Professional Development for Khoury Co-op",
              coreqs: {
                type: "and",
                values: [],
              },
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "2510",
                    subject: "CS",
                  },
                ],
              },
            },
          ],
          status: "CLASSES",
        },
        spring: {
          season: "SP",
          year: 1001,
          termId: 100130,
          classes: [],
          status: "COOP",
        },
        summer1: {
          season: "S1",
          year: 1001,
          termId: 100140,
          classes: [],
          status: "COOP",
        },
        summer2: {
          season: "S2",
          year: 1001,
          termId: 100160,
          classes: [
            {
              classId: "3081",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Probability and Statistics",
              coreqs: {
                type: "and",
                values: [],
              },
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "1342",
                    subject: "MATH",
                  },
                  {
                    classId: "1252",
                    subject: "MATH",
                  },
                  {
                    classId: "1242",
                    subject: "MATH",
                  },
                ],
              },
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective",
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
          classes: [
            {
              classId: "3700",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Networks and Distributed Systems",
              coreqs: {
                type: "and",
                values: [],
              },
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "2510",
                    subject: "CS",
                  },
                ],
              },
            },
            {
              classId: "3800",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Theory of Computation",
              coreqs: {
                type: "and",
                values: [],
              },
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
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 5,
              numCreditsMax: 5,
              semester: null,
              name: "Science elective with lab",
            },
            {
              classId: "1170",
              subject: "THTR",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "The Eloquent Presenter",
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
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Computing and social issues",
            },
          ],
          status: "CLASSES",
        },
        spring: {
          season: "SP",
          year: 1002,
          termId: 100230,
          classes: [],
          status: "COOP",
        },
        summer1: {
          season: "S1",
          year: 1002,
          termId: 100240,
          classes: [],
          status: "COOP",
        },
        summer2: {
          season: "S2",
          year: 1002,
          termId: 100260,
          classes: [
            {
              classId: "2331",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Linear Algebra",
              coreqs: {
                type: "and",
                values: [],
              },
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "1342",
                    subject: "MATH",
                  },
                  {
                    classId: "1242",
                    subject: "MATH",
                  },
                  {
                    classId: "1252",
                    subject: "MATH",
                  },
                  {
                    classId: "1800",
                    subject: "CS",
                  },
                ],
              },
            },
            {
              classId: "3302",
              subject: "ENGW",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Advanced Writing in the Technical Professions",
              coreqs: {
                type: "and",
                values: [],
              },
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
          classes: [
            {
              classId: "4400",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Programming Languages",
              coreqs: {
                type: "and",
                values: [],
              },
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
                        classId: "3000",
                        subject: "CS",
                      },
                      {
                        classId: "4800",
                        subject: "CS",
                        missing: true,
                      },
                    ],
                  },
                ],
              },
            },
            {
              classId: "2160",
              subject: "EECE",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Embedded Design: Enabling Robotics",
              coreqs: {
                type: "and",
                values: [],
              },
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
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 5,
              numCreditsMax: 5,
              semester: null,
              name: "Science elective with lab",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Computer science elective",
            },
          ],
          status: "CLASSES",
        },
        spring: {
          season: "SP",
          year: 1003,
          termId: 100330,
          classes: [
            {
              classId: "4500",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Software Development",
              coreqs: {
                type: "and",
                values: [],
              },
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
            },
            {
              classId: "4501",
              subject: "CS",
              numCreditsMin: 0,
              numCreditsMax: 0,
              semester: null,
              name: "",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Computer science capstone",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Computer science elective",
            },
          ],
          status: "CLASSES",
        },
        summer1: {
          season: "S1",
          year: 1003,
          termId: 100340,
          classes: [],
          status: "INACTIVE",
        },
        summer2: {
          season: "S2",
          year: 1003,
          termId: 100360,
          classes: [],
          status: "INACTIVE",
        },
        isSummerFull: false,
      },
    },
  },
  {
    years: [1000, 1001, 1002, 1003, 1004],
    yearMap: {
      "1000": {
        year: 1000,
        fall: {
          season: "FL",
          year: 1000,
          termId: 100010,
          classes: [
            {
              classId: "1200",
              subject: "CS",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "Leadership Skill Development",
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
              classId: "1800",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Discrete Structures",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CS",
                    classId: "1802",
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
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "Seminar for CS 1800",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CS",
                    classId: "1800",
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
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Fundamentals of Computer Science 1",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CS",
                    classId: "2501",
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
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "Lab for CS 2500",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CS",
                    classId: "2500",
                  },
                ],
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
              semester: null,
              name: "First-Year Writing",
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
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective",
            },
          ],
          status: "CLASSES",
        },
        spring: {
          season: "SP",
          year: 1000,
          termId: 100030,
          classes: [
            {
              classId: "2510",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Fundamentals of Computer Science 2",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CS",
                    classId: "2511",
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
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "Lab for CS 2510",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CS",
                    classId: "2510",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "2800",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Logic and Computation",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CS",
                    classId: "2801",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [
                  {
                    type: "or",
                    values: [
                      {
                        classId: "1800",
                        subject: "CS",
                      },
                      {
                        classId: "1365",
                        subject: "MATH",
                      },
                      {
                        classId: "2310",
                        subject: "MATH",
                        missing: true,
                      },
                    ],
                  },
                  {
                    classId: "2500",
                    subject: "CS",
                  },
                ],
              },
            },
            {
              classId: "2801",
              subject: "CS",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "Lab for CS 2800",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CS",
                    classId: "2800",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective",
            },
          ],
          status: "CLASSES",
        },
        summer1: {
          season: "S1",
          year: 1000,
          termId: 100040,
          classes: [],
          status: "INACTIVE",
        },
        summer2: {
          season: "S2",
          year: 1000,
          termId: 100060,
          classes: [],
          status: "INACTIVE",
        },
        isSummerFull: false,
      },
      "1001": {
        year: 1001,
        fall: {
          season: "FL",
          year: 1001,
          termId: 100110,
          classes: [
            {
              classId: "3500",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Object-Oriented Design",
              coreqs: {
                type: "and",
                values: [],
              },
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
            },
            {
              classId: "1341",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Calculus 1 for Science and Engineering",
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
              semester: null,
              name: "Algorithms and Data",
              coreqs: {
                type: "and",
                values: [],
              },
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
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective",
            },
            {
              classId: "1210",
              subject: "CS",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "Professional Development for Khoury Co-op",
              coreqs: {
                type: "and",
                values: [],
              },
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "2510",
                    subject: "CS",
                  },
                ],
              },
            },
          ],
          status: "CLASSES",
        },
        spring: {
          season: "SP",
          year: 1001,
          termId: 100130,
          classes: [],
          status: "COOP",
        },
        summer1: {
          season: "S1",
          year: 1001,
          termId: 100140,
          classes: [],
          status: "COOP",
        },
        summer2: {
          season: "S2",
          year: 1001,
          termId: 100160,
          classes: [],
          status: "INACTIVE",
        },
        isSummerFull: false,
      },
      "1002": {
        year: 1002,
        fall: {
          season: "FL",
          year: 1002,
          termId: 100210,
          classes: [
            {
              classId: "3800",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Theory of Computation",
              coreqs: {
                type: "and",
                values: [],
              },
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
            },
            {
              classId: "3650",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Computer Systems",
              coreqs: {
                type: "and",
                values: [],
              },
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
            },
            {
              classId: "1342",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Calculus 2 for Science and Engineering",
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
              subject: "XXXX",
              numCreditsMin: 5,
              numCreditsMax: 5,
              semester: null,
              name: "Science elective with lab",
            },
            {
              classId: "1170",
              subject: "THTR",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "The Eloquent Presenter",
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
          year: 1002,
          termId: 100230,
          classes: [],
          status: "COOP",
        },
        summer1: {
          season: "S1",
          year: 1002,
          termId: 100240,
          classes: [],
          status: "COOP",
        },
        summer2: {
          season: "S2",
          year: 1002,
          termId: 100260,
          classes: [
            {
              classId: "2331",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Linear Algebra",
              coreqs: {
                type: "and",
                values: [],
              },
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "1342",
                    subject: "MATH",
                  },
                  {
                    classId: "1242",
                    subject: "MATH",
                  },
                  {
                    classId: "1252",
                    subject: "MATH",
                  },
                  {
                    classId: "1800",
                    subject: "CS",
                  },
                ],
              },
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective",
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
          classes: [
            {
              classId: "3700",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Networks and Distributed Systems",
              coreqs: {
                type: "and",
                values: [],
              },
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "2510",
                    subject: "CS",
                  },
                ],
              },
            },
            {
              classId: "3081",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Probability and Statistics",
              coreqs: {
                type: "and",
                values: [],
              },
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "1342",
                    subject: "MATH",
                  },
                  {
                    classId: "1252",
                    subject: "MATH",
                  },
                  {
                    classId: "1242",
                    subject: "MATH",
                  },
                ],
              },
            },
            {
              classId: "3302",
              subject: "ENGW",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Advanced Writing in the Technical Professions",
              coreqs: {
                type: "and",
                values: [],
              },
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
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 5,
              numCreditsMax: 5,
              semester: null,
              name: "Science elective with lab",
            },
          ],
          status: "CLASSES",
        },
        spring: {
          season: "SP",
          year: 1003,
          termId: 100330,
          classes: [],
          status: "COOP",
        },
        summer1: {
          season: "S1",
          year: 1003,
          termId: 100340,
          classes: [],
          status: "COOP",
        },
        summer2: {
          season: "S2",
          year: 1003,
          termId: 100360,
          classes: [
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective",
            },
          ],
          status: "CLASSES",
        },
        isSummerFull: false,
      },
      "1004": {
        year: 1004,
        fall: {
          season: "FL",
          year: 1004,
          termId: 100410,
          classes: [
            {
              classId: "4400",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Programming Languages",
              coreqs: {
                type: "and",
                values: [],
              },
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
                        classId: "3000",
                        subject: "CS",
                      },
                      {
                        classId: "4800",
                        subject: "CS",
                        missing: true,
                      },
                    ],
                  },
                ],
              },
            },
            {
              classId: "2160",
              subject: "EECE",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Embedded Design: Enabling Robotics",
              coreqs: {
                type: "and",
                values: [],
              },
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
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "CS undergraduate elective",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "CS undergraduate elective",
            },
          ],
          status: "CLASSES",
        },
        spring: {
          season: "SP",
          year: 1004,
          termId: 100430,
          classes: [
            {
              classId: "4500",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Software Development",
              coreqs: {
                type: "and",
                values: [],
              },
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
            },
            {
              classId: "4501",
              subject: "CS",
              numCreditsMin: 0,
              numCreditsMax: 0,
              semester: null,
              name: "",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Computing and social issues",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Capstone",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective",
            },
          ],
          status: "CLASSES",
        },
        summer1: {
          season: "S1",
          year: 1004,
          termId: 100440,
          classes: [],
          status: "INACTIVE",
        },
        summer2: {
          season: "S2",
          year: 1004,
          termId: 100460,
          classes: [],
          status: "INACTIVE",
        },
        isSummerFull: false,
      },
    },
  },
];
