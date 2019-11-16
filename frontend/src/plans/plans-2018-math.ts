import { Schedule } from "../models/types";

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
          id: 1010,
          classes: [
            {
              classId: "1341",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
            },
            {
              classId: "1365",
              subject: "MATH",
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
              classId: "1161",
              subject: "PHYS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1162",
                    subject: "PHYS",
                  },
                  {
                    classId: "1163",
                    subject: "PHYS",
                  },
                ],
              },
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "1241",
                    subject: "MATH",
                  },
                  {
                    classId: "1251",
                    subject: "MATH",
                  },
                  {
                    classId: "1341",
                    subject: "MATH",
                  },
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
            },
            {
              classId: "1162",
              subject: "PHYS",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1161",
                    subject: "PHYS",
                  },
                  {
                    classId: "1163",
                    subject: "PHYS",
                  },
                ],
              },
            },
            {
              classId: "1000",
              subject: "MATH",
              numCreditsMin: 1,
              numCreditsMax: 1,
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
              classId: "1342",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
            },
            {
              classId: "1165",
              subject: "PHYS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1166",
                    subject: "PHYS",
                  },
                  {
                    classId: "1167",
                    subject: "PHYS",
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
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1165",
                    subject: "PHYS",
                  },
                  {
                    classId: "1167",
                    subject: "PHYS",
                  },
                ],
              },
            },
            {
              classId: "1111",
              subject: "ENGW",
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
              classId: "2321",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
            },
            {
              classId: "2331",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
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
        spring: {
          season: "SP",
          year: 1001,
          termId: 100130,
          id: 1031,
          classes: [
            {
              classId: "2341",
              subject: "MATH",
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
            {
              classId: "2000",
              subject: "EESC",
              numCreditsMin: 1,
              numCreditsMax: 1,
            },
          ],
          status: "CLASSES",
        },
        summer1: {
          season: "S1",
          year: 1001,
          termId: 100140,
          id: 1041,
          classes: [],
          status: "INACTIVE",
        },
        summer2: {
          season: "S2",
          year: 1001,
          termId: 100160,
          id: 1061,
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
          id: 1012,
          classes: [],
          status: "COOP",
        },
        spring: {
          season: "SP",
          year: 1002,
          termId: 100230,
          id: 1032,
          classes: [
            {
              classId: "9999",
              subject: "Elective",
              numCreditsMin: 4,
              numCreditsMax: 4,
            },
            {
              classId: "3315",
              subject: "ENGW",
              numCreditsMin: 4,
              numCreditsMax: 4,
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
              subject: "Elective",
              numCreditsMin: 4,
              numCreditsMax: 4,
            },
            {
              classId: "3000",
              subject: "MATH",
              numCreditsMin: 1,
              numCreditsMax: 1,
            },
          ],
          status: "CLASSES",
        },
        summer1: {
          season: "S1",
          year: 1002,
          termId: 100240,
          id: 1042,
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
        summer2: {
          season: "S2",
          year: 1002,
          termId: 100260,
          id: 1062,
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
          id: 1013,
          classes: [],
          status: "COOP",
        },
        spring: {
          season: "SP",
          year: 1003,
          termId: 100330,
          id: 1033,
          classes: [
            {
              classId: "3150",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
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
            {
              classId: "9999",
              subject: "Elective",
              numCreditsMin: 4,
              numCreditsMax: 4,
            },
            {
              classId: "4000",
              subject: "MATH",
              numCreditsMin: 1,
              numCreditsMax: 1,
            },
          ],
          status: "CLASSES",
        },
        summer1: {
          season: "S1",
          year: 1003,
          termId: 100340,
          id: 1043,
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
        summer2: {
          season: "S2",
          year: 1003,
          termId: 100360,
          id: 1063,
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
          id: 1014,
          classes: [],
          status: "COOP",
        },
        spring: {
          season: "SP",
          year: 1004,
          termId: 100430,
          id: 1034,
          classes: [
            {
              classId: "3175",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
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
              subject: "Elective",
              numCreditsMin: 4,
              numCreditsMax: 4,
            },
            {
              classId: "4025",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
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
              subject: "Elective",
              numCreditsMin: 4,
              numCreditsMax: 4,
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
              classId: "1161",
              subject: "PHYS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1162",
                    subject: "PHYS",
                  },
                  {
                    classId: "1163",
                    subject: "PHYS",
                  },
                ],
              },
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "1241",
                    subject: "MATH",
                  },
                  {
                    classId: "1251",
                    subject: "MATH",
                  },
                  {
                    classId: "1341",
                    subject: "MATH",
                  },
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
            },
            {
              classId: "1162",
              subject: "PHYS",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1161",
                    subject: "PHYS",
                  },
                  {
                    classId: "1163",
                    subject: "PHYS",
                  },
                ],
              },
            },
            {
              classId: "1365",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
            },
            {
              classId: "1341",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
            },
            {
              classId: "1000",
              subject: "MATH",
              numCreditsMin: 1,
              numCreditsMax: 1,
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
        spring: {
          season: "SP",
          year: 1000,
          termId: 100030,
          id: 1030,
          classes: [
            {
              classId: "1342",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
            },
            {
              classId: "1165",
              subject: "PHYS",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1166",
                    subject: "PHYS",
                  },
                  {
                    classId: "1167",
                    subject: "PHYS",
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
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1165",
                    subject: "PHYS",
                  },
                  {
                    classId: "1167",
                    subject: "PHYS",
                  },
                ],
              },
            },
            {
              classId: "1111",
              subject: "ENGW",
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
              classId: "2321",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
            },
            {
              classId: "2331",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
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
            {
              classId: "2000",
              subject: "EESC",
              numCreditsMin: 1,
              numCreditsMax: 1,
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
              classId: "2341",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
            },
            {
              classId: "3175",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
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
            {
              classId: "3000",
              subject: "MATH",
              numCreditsMin: 1,
              numCreditsMax: 1,
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
      "1003": {
        year: 1003,
        fall: {
          season: "FL",
          year: 1003,
          termId: 100310,
          id: 1013,
          classes: [
            {
              classId: "3315",
              subject: "ENGW",
              numCreditsMin: 4,
              numCreditsMax: 4,
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
            },
            {
              classId: "3150",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
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
              subject: "Elective",
              numCreditsMin: 4,
              numCreditsMax: 4,
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
      "1004": {
        year: 1004,
        fall: {
          season: "FL",
          year: 1004,
          termId: 100410,
          id: 1014,
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
        spring: {
          season: "SP",
          year: 1004,
          termId: 100430,
          id: 1034,
          classes: [
            {
              classId: "9999",
              subject: "Elective",
              numCreditsMin: 4,
              numCreditsMax: 4,
            },
            {
              classId: "4025",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
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
