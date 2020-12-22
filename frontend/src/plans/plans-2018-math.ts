import { Schedule } from "../../../common/types";

export const mathPlans: Schedule[] = [
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
              classId: "1365",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Introduction to Mathematical Reasoning",
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
            {
              classId: "1161",
              subject: "PHYS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "",
            },
            {
              classId: "1162",
              subject: "PHYS",
              numCreditsMin: 1,
              numCreditsMax: 1,
              name: "",
            },
            {
              classId: "1000",
              subject: "MATH",
              numCreditsMin: 1,
              numCreditsMax: 1,
              name: "Mathematics at Northeastern",
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
          classes: [
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
              classId: "1165",
              subject: "PHYS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Physics 2",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "PHYS",
                    classId: "1166",
                  },
                  {
                    subject: "PHYS",
                    classId: "1167",
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
                        classId: "1151",
                        subject: "PHYS",
                      },
                      {
                        classId: "1161",
                        subject: "PHYS",
                        missing: true,
                      },
                      {
                        classId: "1171",
                        subject: "PHYS",
                      },
                    ],
                  },
                  {
                    type: "or",
                    values: [
                      {
                        classId: "1342",
                        subject: "MATH",
                      },
                      {
                        classId: "2321",
                        subject: "MATH",
                      },
                    ],
                  },
                ],
              },
            },
            {
              classId: "1166",
              subject: "PHYS",
              numCreditsMin: 1,
              numCreditsMax: 1,
              name: "Lab for PHYS 1165 (HON)",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "PHYS",
                    classId: "1165",
                  },
                  {
                    subject: "PHYS",
                    classId: "1167",
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
              classId: "2321",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Calculus 3 for Science and Engineering",
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
          year: 1001,
          termId: 100130,
          classes: [
            {
              classId: "2341",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Differential Equations and Linear Algebra for Engineering",
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
              classId: "2000",
              subject: "EESC",
              numCreditsMin: 1,
              numCreditsMax: 1,
              name: "Professional Development for Co-op",
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
        summer1: {
          season: "S1",
          year: 1001,
          termId: 100140,
          classes: [],
          status: "INACTIVE",
        },
        summer2: {
          season: "S2",
          year: 1001,
          termId: 100160,
          classes: [],
          status: "COOP",
        },
        isSummerFull: false,
      },
      "1002": {
        year: 1002,
        fall: {
          season: "FL",
          year: 1002,
          termId: 100210,
          classes: [],
          status: "COOP",
        },
        spring: {
          season: "SP",
          year: 1002,
          termId: 100230,
          classes: [
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "MATH elective",
            },
            {
              classId: "3315",
              subject: "ENGW",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Interdiscip Adv Writing - SOL",
              coreqs: {
                type: "and",
                values: [],
              },
              prereqs: {
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
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Upper-division elective",
            },
            {
              classId: "3000",
              subject: "MATH",
              numCreditsMin: 1,
              numCreditsMax: 1,
              name: "Co-op and Experiential Learning Reflection Seminar 1",
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
        summer1: {
          season: "S1",
          year: 1002,
          termId: 100240,
          classes: [
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "MATH elective",
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
          year: 1002,
          termId: 100260,
          classes: [],
          status: "COOP",
        },
        isSummerFull: false,
      },
      "1003": {
        year: 1003,
        fall: {
          season: "FL",
          year: 1003,
          termId: 100310,
          classes: [],
          status: "COOP",
        },
        spring: {
          season: "SP",
          year: 1003,
          termId: 100330,
          classes: [
            {
              classId: "3150",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Real Analysis",
              coreqs: {
                type: "and",
                values: [],
              },
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "2321",
                    subject: "MATH",
                  },
                  {
                    classId: "2331",
                    subject: "MATH",
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
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "MATH elective",
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
              name: "Upper-division elective",
            },
            {
              classId: "4000",
              subject: "MATH",
              numCreditsMin: 1,
              numCreditsMax: 1,
              name: "",
            },
          ],
          status: "CLASSES",
        },
        summer1: {
          season: "S1",
          year: 1003,
          termId: 100340,
          classes: [
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "MATH elective",
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
          year: 1003,
          termId: 100360,
          classes: [],
          status: "COOP",
        },
        isSummerFull: false,
      },
      "1004": {
        year: 1004,
        fall: {
          season: "FL",
          year: 1004,
          termId: 100410,
          classes: [],
          status: "COOP",
        },
        spring: {
          season: "SP",
          year: 1004,
          termId: 100430,
          classes: [
            {
              classId: "3175",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Group Theory",
              coreqs: {
                type: "and",
                values: [],
              },
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "2321",
                    subject: "MATH",
                  },
                  {
                    classId: "2331",
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
              name: "MATH elective",
            },
            {
              classId: "4025",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Applied Mathematics Capstone",
              coreqs: {
                type: "and",
                values: [],
              },
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "3081",
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
              name: "Upper-division elective",
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
              classId: "1161",
              subject: "PHYS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "",
            },
            {
              classId: "1162",
              subject: "PHYS",
              numCreditsMin: 1,
              numCreditsMax: 1,
              name: "",
            },
            {
              classId: "1365",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Introduction to Mathematical Reasoning",
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
              classId: "1000",
              subject: "MATH",
              numCreditsMin: 1,
              numCreditsMax: 1,
              name: "Mathematics at Northeastern",
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
          classes: [
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
              classId: "1165",
              subject: "PHYS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Physics 2",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "PHYS",
                    classId: "1166",
                  },
                  {
                    subject: "PHYS",
                    classId: "1167",
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
                        classId: "1151",
                        subject: "PHYS",
                      },
                      {
                        classId: "1161",
                        subject: "PHYS",
                        missing: true,
                      },
                      {
                        classId: "1171",
                        subject: "PHYS",
                      },
                    ],
                  },
                  {
                    type: "or",
                    values: [
                      {
                        classId: "1342",
                        subject: "MATH",
                      },
                      {
                        classId: "2321",
                        subject: "MATH",
                      },
                    ],
                  },
                ],
              },
            },
            {
              classId: "1166",
              subject: "PHYS",
              numCreditsMin: 1,
              numCreditsMax: 1,
              name: "Lab for PHYS 1165 (HON)",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "PHYS",
                    classId: "1165",
                  },
                  {
                    subject: "PHYS",
                    classId: "1167",
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
              classId: "2321",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Calculus 3 for Science and Engineering",
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
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Elective",
            },
            {
              classId: "2000",
              subject: "EESC",
              numCreditsMin: 1,
              numCreditsMax: 1,
              name: "Professional Development for Co-op",
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
              classId: "2341",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Differential Equations and Linear Algebra for Engineering",
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
              classId: "3175",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Group Theory",
              coreqs: {
                type: "and",
                values: [],
              },
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "2321",
                    subject: "MATH",
                  },
                  {
                    classId: "2331",
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
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Elective",
            },
            {
              classId: "3000",
              subject: "MATH",
              numCreditsMin: 1,
              numCreditsMax: 1,
              name: "Co-op and Experiential Learning Reflection Seminar 1",
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
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "MATH elective",
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
          classes: [
            {
              classId: "3315",
              subject: "ENGW",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Interdiscip Adv Writing - SOL",
              coreqs: {
                type: "and",
                values: [],
              },
              prereqs: {
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
              classId: "4000",
              subject: "MATH",
              numCreditsMin: 1,
              numCreditsMax: 1,
              name: "",
            },
            {
              classId: "3150",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Real Analysis",
              coreqs: {
                type: "and",
                values: [],
              },
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "2321",
                    subject: "MATH",
                  },
                  {
                    classId: "2331",
                    subject: "MATH",
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
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Upper-division elective",
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
              name: "MATH elective",
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
          classes: [
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "MATH elective",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "MATH elective",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Upper-division elective",
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
          year: 1004,
          termId: 100430,
          classes: [
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Elective",
            },
            {
              classId: "4025",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "Applied Mathematics Capstone",
              coreqs: {
                type: "and",
                values: [],
              },
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "3081",
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
              name: "Upper-division elective",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              name: "MATH elective",
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
