import { Schedule } from "graduate-common";

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
          id: 1010,
          classes: [
            {
              classId: "1200",
              subject: "CS",
              numCreditsMin: 1,
              numCreditsMax: 1,
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
              name: "Elective",
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
              numCreditsMin: 4,
              numCreditsMax: 4,
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
              name: "Elective",
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
              name: "Elective",
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
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Elective",
            },
            {
              classId: "1342",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
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
          id: 1011,
          classes: [
            {
              classId: "3650",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
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
              name: "Elective",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Elective",
            },
            {
              classId: "1210",
              subject: "CS",
              numCreditsMin: 1,
              numCreditsMax: 1,
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
              classId: "3081",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
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
          id: 1012,
          classes: [
            {
              classId: "3700",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
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
              name: "Science elective with lab",
            },
            {
              classId: "1170",
              subject: "THTR",
              numCreditsMin: 1,
              numCreditsMax: 1,
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
              name: "Computing and social issues",
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
              classId: "2331",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
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
          id: 1013,
          classes: [
            {
              classId: "4400",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
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
              name: "Science elective with lab",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Computer science elective",
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
              classId: "4500",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
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
              name: "",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Computer science capstone",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Elective",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Computer science elective",
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
          id: 1010,
          classes: [
            {
              classId: "1200",
              subject: "CS",
              numCreditsMin: 1,
              numCreditsMax: 1,
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
              name: "Elective",
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
              numCreditsMin: 4,
              numCreditsMax: 4,
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
              name: "Elective",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Elective",
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
      "1001": {
        year: 1001,
        fall: {
          season: "FL",
          year: 1001,
          termId: 100110,
          id: 1011,
          classes: [
            {
              classId: "3500",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
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
              name: "Elective",
            },
            {
              classId: "1210",
              subject: "CS",
              numCreditsMin: 1,
              numCreditsMax: 1,
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
          id: 1012,
          classes: [
            {
              classId: "3800",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
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
              name: "Science elective with lab",
            },
            {
              classId: "1170",
              subject: "THTR",
              numCreditsMin: 1,
              numCreditsMax: 1,
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
              classId: "2331",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
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
          id: 1013,
          classes: [
            {
              classId: "3700",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
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
              name: "Science elective with lab",
            },
          ],
          status: "CLASSES",
        },
        spring: {
          season: "SP",
          year: 1003,
          termId: 100330,
          id: 1033,
          classes: [],
          status: "COOP",
        },
        summer1: {
          season: "S1",
          year: 1003,
          termId: 100340,
          id: 1043,
          classes: [],
          status: "COOP",
        },
        summer2: {
          season: "S2",
          year: 1003,
          termId: 100360,
          id: 1063,
          classes: [
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Elective",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
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
          id: 1014,
          classes: [
            {
              classId: "4400",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
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
              name: "CS undergraduate elective",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "CS undergraduate elective",
            },
          ],
          status: "CLASSES",
        },
        spring: {
          season: "SP",
          year: 1004,
          termId: 100430,
          id: 1034,
          classes: [
            {
              classId: "4500",
              subject: "CS",
              numCreditsMin: 4,
              numCreditsMax: 4,
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
              name: "",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Computing and social issues",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Capstone",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Elective",
            },
          ],
          status: "CLASSES",
        },
        summer1: {
          season: "S1",
          year: 1004,
          termId: 100440,
          id: 1044,
          classes: [],
          status: "INACTIVE",
        },
        summer2: {
          season: "S2",
          year: 1004,
          termId: 100460,
          id: 1064,
          classes: [],
          status: "INACTIVE",
        },
        isSummerFull: false,
      },
    },
    id: "1",
  },
];
