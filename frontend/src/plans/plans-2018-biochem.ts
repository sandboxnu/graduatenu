import { Schedule } from "../models/types";

export const bioChemPlans: Schedule[] = [
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
              classId: "1107",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1108",
                    subject: "BIOL",
                  },
                ],
              },
            },
            {
              classId: "1108",
              subject: "BIOL",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1107",
                    subject: "BIOL",
                  },
                ],
              },
            },
            {
              classId: "1211",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1212",
                    subject: "CHEM",
                  },
                  {
                    classId: "1213",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "1212",
              subject: "CHEM",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1211",
                    subject: "CHEM",
                  },
                  {
                    classId: "1213",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "1213",
              subject: "CHEM",
              numCreditsMin: 0,
              numCreditsMax: 0,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1211",
                    subject: "CHEM",
                  },
                  {
                    classId: "1212",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "1251",
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
              classId: "1000",
              subject: "BIOC",
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
              classId: "2299",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "1101",
                    subject: "BIOL",
                    missing: true,
                  },
                  {
                    classId: "1107",
                    subject: "BIOL",
                  },
                  {
                    classId: "1111",
                    subject: "BIOL",
                  },
                ],
              },
            },
            {
              classId: "1214",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1215",
                    subject: "CHEM",
                  },
                  {
                    classId: "1216",
                    subject: "CHEM",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "1211",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "1215",
              subject: "CHEM",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1214",
                    subject: "CHEM",
                  },
                  {
                    classId: "1216",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "1216",
              subject: "CHEM",
              numCreditsMin: 0,
              numCreditsMax: 0,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1214",
                    subject: "CHEM",
                  },
                  {
                    classId: "1215",
                    subject: "CHEM",
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
              classId: "1252",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "1251",
                    subject: "MATH",
                  },
                ],
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
          classes: [
            {
              classId: "2301",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "and",
                values: [
                  {
                    type: "or",
                    values: [
                      {
                        classId: "1103",
                        subject: "BIOL",
                        missing: true,
                      },
                      {
                        classId: "1113",
                        subject: "BIOL",
                      },
                      {
                        classId: "1115",
                        subject: "BIOL",
                      },
                      {
                        classId: "2297",
                        subject: "BIOL",
                        missing: true,
                      },
                      {
                        classId: "2299",
                        subject: "BIOL",
                      },
                      {
                        classId: "2290",
                        subject: "EEMB",
                      },
                      {
                        classId: "2400",
                        subject: "ENVR",
                        missing: true,
                      },
                      {
                        classId: "2400",
                        subject: "EEMB",
                      },
                    ],
                  },
                  {
                    type: "or",
                    values: [
                      {
                        classId: "1211",
                        subject: "CHEM",
                      },
                      {
                        classId: "1217",
                        subject: "CHEM",
                      },
                      {
                        classId: "1151",
                        subject: "CHEM",
                      },
                      {
                        classId: "1161",
                        subject: "CHEM",
                      },
                    ],
                  },
                ],
              },
            },
            {
              classId: "2302",
              subject: "BIOL",
              numCreditsMin: 1,
              numCreditsMax: 1,
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "2301",
                    subject: "BIOL",
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
        summer2: {
          season: "S2",
          year: 1000,
          termId: 100060,
          id: 1060,
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
      "1001": {
        year: 1001,
        fall: {
          season: "FL",
          year: 1001,
          termId: 100110,
          id: 1011,
          classes: [
            {
              classId: "2309",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "2301",
                    subject: "BIOL",
                  },
                ],
              },
            },
            {
              classId: "2311",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "2312",
                    subject: "CHEM",
                  },
                ],
              },
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "1151",
                    subject: "CHEM",
                  },
                  {
                    classId: "1214",
                    subject: "CHEM",
                  },
                  {
                    classId: "1220",
                    subject: "CHEM",
                  },
                  {
                    classId: "1161",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "2312",
              subject: "CHEM",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "2311",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "1151",
              subject: "PHYS",
              numCreditsMin: 3,
              numCreditsMax: 3,
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
                    classId: "1340",
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
              classId: "1152",
              subject: "PHYS",
              numCreditsMin: 1,
              numCreditsMax: 1,
            },
            {
              classId: "1153",
              subject: "PHYS",
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
          year: 1001,
          termId: 100130,
          id: 1031,
          classes: [
            {
              classId: "2313",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "2314",
                    subject: "CHEM",
                  },
                ],
              },
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "2311",
                    subject: "CHEM",
                  },
                  {
                    classId: "2315",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "2314",
              subject: "CHEM",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "2313",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "1155",
              subject: "PHYS",
              numCreditsMin: 3,
              numCreditsMax: 3,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1157",
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
                        classId: "1252",
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
                ],
              },
            },
            {
              classId: "1156",
              subject: "PHYS",
              numCreditsMin: 1,
              numCreditsMax: 1,
            },
            {
              classId: "1157",
              subject: "PHYS",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1155",
                    subject: "PHYS",
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
        summer1: {
          season: "S1",
          year: 1001,
          termId: 100140,
          id: 1041,
          classes: [
            {
              classId: "3611",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "3612",
                    subject: "BIOL",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "2301",
                    subject: "BIOL",
                  },
                  {
                    type: "or",
                    values: [
                      {
                        classId: "2313",
                        subject: "CHEM",
                      },
                      {
                        classId: "2317",
                        subject: "CHEM",
                      },
                    ],
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
              classId: "3612",
              subject: "BIOL",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "3611",
                    subject: "BIOL",
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
              classId: "3431",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "3432",
                    subject: "CHEM",
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
                        classId: "1214",
                        subject: "CHEM",
                      },
                      {
                        classId: "1220",
                        subject: "CHEM",
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
                        classId: "1252",
                        subject: "MATH",
                      },
                    ],
                  },
                  {
                    type: "or",
                    values: [
                      {
                        classId: "1147",
                        subject: "PHYS",
                      },
                      {
                        classId: "1155",
                        subject: "PHYS",
                      },
                      {
                        classId: "1165",
                        subject: "PHYS",
                      },
                      {
                        classId: "1175",
                        subject: "PHYS",
                      },
                    ],
                  },
                ],
              },
            },
            {
              classId: "3432",
              subject: "CHEM",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "3431",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "4620",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "2313",
                    subject: "CHEM",
                  },
                  {
                    classId: "2317",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "3307",
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
          year: 1002,
          termId: 100240,
          id: 1042,
          classes: [
            {
              classId: "4707",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "2323",
                    subject: "BIOL",
                    missing: true,
                  },
                  {
                    classId: "3611",
                    subject: "BIOL",
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
          classes: [
            {
              classId: "9999",
              subject: "Elective",
              numCreditsMin: 5,
              numCreditsMax: 5,
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
              numCreditsMin: 5,
              numCreditsMax: 5,
            },
            {
              classId: "9999",
              subject: "CHEM 4750 or BIOL4701",
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
          status: "INACTIVE",
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
              classId: "1107",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1108",
                    subject: "BIOL",
                  },
                ],
              },
            },
            {
              classId: "1108",
              subject: "BIOL",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1107",
                    subject: "BIOL",
                  },
                ],
              },
            },
            {
              classId: "1211",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1212",
                    subject: "CHEM",
                  },
                  {
                    classId: "1213",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "1212",
              subject: "CHEM",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1211",
                    subject: "CHEM",
                  },
                  {
                    classId: "1213",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "1213",
              subject: "CHEM",
              numCreditsMin: 0,
              numCreditsMax: 0,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1211",
                    subject: "CHEM",
                  },
                  {
                    classId: "1212",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "1251",
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
              classId: "1000",
              subject: "BIOC",
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
              classId: "2299",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "1101",
                    subject: "BIOL",
                    missing: true,
                  },
                  {
                    classId: "1107",
                    subject: "BIOL",
                  },
                  {
                    classId: "1111",
                    subject: "BIOL",
                  },
                ],
              },
            },
            {
              classId: "1214",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1215",
                    subject: "CHEM",
                  },
                  {
                    classId: "1216",
                    subject: "CHEM",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "1211",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "1215",
              subject: "CHEM",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1214",
                    subject: "CHEM",
                  },
                  {
                    classId: "1216",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "1216",
              subject: "CHEM",
              numCreditsMin: 0,
              numCreditsMax: 0,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1214",
                    subject: "CHEM",
                  },
                  {
                    classId: "1215",
                    subject: "CHEM",
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
              classId: "1252",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "1251",
                    subject: "MATH",
                  },
                ],
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
          classes: [
            {
              classId: "2301",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "and",
                values: [
                  {
                    type: "or",
                    values: [
                      {
                        classId: "1103",
                        subject: "BIOL",
                        missing: true,
                      },
                      {
                        classId: "1113",
                        subject: "BIOL",
                      },
                      {
                        classId: "1115",
                        subject: "BIOL",
                      },
                      {
                        classId: "2297",
                        subject: "BIOL",
                        missing: true,
                      },
                      {
                        classId: "2299",
                        subject: "BIOL",
                      },
                      {
                        classId: "2290",
                        subject: "EEMB",
                      },
                      {
                        classId: "2400",
                        subject: "ENVR",
                        missing: true,
                      },
                      {
                        classId: "2400",
                        subject: "EEMB",
                      },
                    ],
                  },
                  {
                    type: "or",
                    values: [
                      {
                        classId: "1211",
                        subject: "CHEM",
                      },
                      {
                        classId: "1217",
                        subject: "CHEM",
                      },
                      {
                        classId: "1151",
                        subject: "CHEM",
                      },
                      {
                        classId: "1161",
                        subject: "CHEM",
                      },
                    ],
                  },
                ],
              },
            },
            {
              classId: "2302",
              subject: "BIOL",
              numCreditsMin: 1,
              numCreditsMax: 1,
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "2301",
                    subject: "BIOL",
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
        summer2: {
          season: "S2",
          year: 1000,
          termId: 100060,
          id: 1060,
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
      "1001": {
        year: 1001,
        fall: {
          season: "FL",
          year: 1001,
          termId: 100110,
          id: 1011,
          classes: [
            {
              classId: "2309",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "2301",
                    subject: "BIOL",
                  },
                ],
              },
            },
            {
              classId: "2311",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "2312",
                    subject: "CHEM",
                  },
                ],
              },
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "1151",
                    subject: "CHEM",
                  },
                  {
                    classId: "1214",
                    subject: "CHEM",
                  },
                  {
                    classId: "1220",
                    subject: "CHEM",
                  },
                  {
                    classId: "1161",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "2312",
              subject: "CHEM",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "2311",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "1151",
              subject: "PHYS",
              numCreditsMin: 3,
              numCreditsMax: 3,
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
                    classId: "1340",
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
              classId: "1152",
              subject: "PHYS",
              numCreditsMin: 1,
              numCreditsMax: 1,
            },
            {
              classId: "1153",
              subject: "PHYS",
              numCreditsMin: 1,
              numCreditsMax: 1,
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
          classes: [
            {
              classId: "2313",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "2314",
                    subject: "CHEM",
                  },
                ],
              },
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "2311",
                    subject: "CHEM",
                  },
                  {
                    classId: "2315",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "2314",
              subject: "CHEM",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "2313",
                    subject: "CHEM",
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
              classId: "3611",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "3612",
                    subject: "BIOL",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "2301",
                    subject: "BIOL",
                  },
                  {
                    type: "or",
                    values: [
                      {
                        classId: "2313",
                        subject: "CHEM",
                      },
                      {
                        classId: "2317",
                        subject: "CHEM",
                      },
                    ],
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
              classId: "3612",
              subject: "BIOL",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "3611",
                    subject: "BIOL",
                  },
                ],
              },
            },
            {
              classId: "1155",
              subject: "PHYS",
              numCreditsMin: 3,
              numCreditsMax: 3,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1157",
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
                        classId: "1252",
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
                ],
              },
            },
            {
              classId: "1156",
              subject: "PHYS",
              numCreditsMin: 1,
              numCreditsMax: 1,
            },
            {
              classId: "1157",
              subject: "PHYS",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1155",
                    subject: "PHYS",
                  },
                ],
              },
            },
            {
              classId: "3307",
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
              classId: "4707",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "2323",
                    subject: "BIOL",
                    missing: true,
                  },
                  {
                    classId: "3611",
                    subject: "BIOL",
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
              classId: "3431",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "3432",
                    subject: "CHEM",
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
                        classId: "1214",
                        subject: "CHEM",
                      },
                      {
                        classId: "1220",
                        subject: "CHEM",
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
                        classId: "1252",
                        subject: "MATH",
                      },
                    ],
                  },
                  {
                    type: "or",
                    values: [
                      {
                        classId: "1147",
                        subject: "PHYS",
                      },
                      {
                        classId: "1155",
                        subject: "PHYS",
                      },
                      {
                        classId: "1165",
                        subject: "PHYS",
                      },
                      {
                        classId: "1175",
                        subject: "PHYS",
                      },
                    ],
                  },
                ],
              },
            },
            {
              classId: "3432",
              subject: "CHEM",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "3431",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "4620",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "2313",
                    subject: "CHEM",
                  },
                  {
                    classId: "2317",
                    subject: "CHEM",
                  },
                ],
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
        spring: {
          season: "SP",
          year: 1003,
          termId: 100330,
          id: 1033,
          classes: [
            {
              classId: "9999",
              subject: "Elective",
              numCreditsMin: 5,
              numCreditsMax: 5,
            },
            {
              classId: "9999",
              subject: "Elective",
              numCreditsMin: 5,
              numCreditsMax: 5,
            },
            {
              classId: "9999",
              subject: "CHEM 4750 or BIOL4701",
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
    id: "1",
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
              classId: "1107",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1108",
                    subject: "BIOL",
                  },
                ],
              },
            },
            {
              classId: "1108",
              subject: "BIOL",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1107",
                    subject: "BIOL",
                  },
                ],
              },
            },
            {
              classId: "1211",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1212",
                    subject: "CHEM",
                  },
                  {
                    classId: "1213",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "1212",
              subject: "CHEM",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1211",
                    subject: "CHEM",
                  },
                  {
                    classId: "1213",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "1213",
              subject: "CHEM",
              numCreditsMin: 0,
              numCreditsMax: 0,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1211",
                    subject: "CHEM",
                  },
                  {
                    classId: "1212",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "1251",
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
              classId: "1000",
              subject: "BIOC",
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
              classId: "2299",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "1101",
                    subject: "BIOL",
                    missing: true,
                  },
                  {
                    classId: "1107",
                    subject: "BIOL",
                  },
                  {
                    classId: "1111",
                    subject: "BIOL",
                  },
                ],
              },
            },
            {
              classId: "1214",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1215",
                    subject: "CHEM",
                  },
                  {
                    classId: "1216",
                    subject: "CHEM",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "1211",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "1215",
              subject: "CHEM",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1214",
                    subject: "CHEM",
                  },
                  {
                    classId: "1216",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "1216",
              subject: "CHEM",
              numCreditsMin: 0,
              numCreditsMax: 0,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1214",
                    subject: "CHEM",
                  },
                  {
                    classId: "1215",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "1252",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "1251",
                    subject: "MATH",
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
              classId: "2301",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "and",
                values: [
                  {
                    type: "or",
                    values: [
                      {
                        classId: "1103",
                        subject: "BIOL",
                        missing: true,
                      },
                      {
                        classId: "1113",
                        subject: "BIOL",
                      },
                      {
                        classId: "1115",
                        subject: "BIOL",
                      },
                      {
                        classId: "2297",
                        subject: "BIOL",
                        missing: true,
                      },
                      {
                        classId: "2299",
                        subject: "BIOL",
                      },
                      {
                        classId: "2290",
                        subject: "EEMB",
                      },
                      {
                        classId: "2400",
                        subject: "ENVR",
                        missing: true,
                      },
                      {
                        classId: "2400",
                        subject: "EEMB",
                      },
                    ],
                  },
                  {
                    type: "or",
                    values: [
                      {
                        classId: "1211",
                        subject: "CHEM",
                      },
                      {
                        classId: "1217",
                        subject: "CHEM",
                      },
                      {
                        classId: "1151",
                        subject: "CHEM",
                      },
                      {
                        classId: "1161",
                        subject: "CHEM",
                      },
                    ],
                  },
                ],
              },
            },
            {
              classId: "2302",
              subject: "BIOL",
              numCreditsMin: 1,
              numCreditsMax: 1,
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "2301",
                    subject: "BIOL",
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
              classId: "2309",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "2301",
                    subject: "BIOL",
                  },
                ],
              },
            },
            {
              classId: "2311",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "2312",
                    subject: "CHEM",
                  },
                ],
              },
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "1151",
                    subject: "CHEM",
                  },
                  {
                    classId: "1214",
                    subject: "CHEM",
                  },
                  {
                    classId: "1220",
                    subject: "CHEM",
                  },
                  {
                    classId: "1161",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "2312",
              subject: "CHEM",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "2311",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "1151",
              subject: "PHYS",
              numCreditsMin: 3,
              numCreditsMax: 3,
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
                    classId: "1340",
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
              classId: "1152",
              subject: "PHYS",
              numCreditsMin: 1,
              numCreditsMax: 1,
            },
            {
              classId: "1153",
              subject: "PHYS",
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
          year: 1001,
          termId: 100130,
          id: 1031,
          classes: [
            {
              classId: "2313",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "2314",
                    subject: "CHEM",
                  },
                ],
              },
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "2311",
                    subject: "CHEM",
                  },
                  {
                    classId: "2315",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "2314",
              subject: "CHEM",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "2313",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "1155",
              subject: "PHYS",
              numCreditsMin: 3,
              numCreditsMax: 3,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1157",
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
                        classId: "1252",
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
                ],
              },
            },
            {
              classId: "1156",
              subject: "PHYS",
              numCreditsMin: 1,
              numCreditsMax: 1,
            },
            {
              classId: "1157",
              subject: "PHYS",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1155",
                    subject: "PHYS",
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
        summer1: {
          season: "S1",
          year: 1001,
          termId: 100140,
          id: 1041,
          classes: [
            {
              classId: "3611",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "3612",
                    subject: "BIOL",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "2301",
                    subject: "BIOL",
                  },
                  {
                    type: "or",
                    values: [
                      {
                        classId: "2313",
                        subject: "CHEM",
                      },
                      {
                        classId: "2317",
                        subject: "CHEM",
                      },
                    ],
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
              classId: "3612",
              subject: "BIOL",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "3611",
                    subject: "BIOL",
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
              classId: "4707",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "2323",
                    subject: "BIOL",
                    missing: true,
                  },
                  {
                    classId: "3611",
                    subject: "BIOL",
                  },
                ],
              },
            },
            {
              classId: "3431",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "3432",
                    subject: "CHEM",
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
                        classId: "1214",
                        subject: "CHEM",
                      },
                      {
                        classId: "1220",
                        subject: "CHEM",
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
                        classId: "1252",
                        subject: "MATH",
                      },
                    ],
                  },
                  {
                    type: "or",
                    values: [
                      {
                        classId: "1147",
                        subject: "PHYS",
                      },
                      {
                        classId: "1155",
                        subject: "PHYS",
                      },
                      {
                        classId: "1165",
                        subject: "PHYS",
                      },
                      {
                        classId: "1175",
                        subject: "PHYS",
                      },
                    ],
                  },
                ],
              },
            },
            {
              classId: "3432",
              subject: "CHEM",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "3431",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "3307",
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
          year: 1002,
          termId: 100240,
          id: 1042,
          classes: [],
          status: "INACTIVE",
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
              classId: "4620",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "2313",
                    subject: "CHEM",
                  },
                  {
                    classId: "2317",
                    subject: "CHEM",
                  },
                ],
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
              classId: "9999",
              subject: "Elective",
              numCreditsMin: 5,
              numCreditsMax: 5,
            },
            {
              classId: "9999",
              subject: "Elective",
              numCreditsMin: 5,
              numCreditsMax: 5,
            },
            {
              classId: "9999",
              subject: "CHEM 4750 or BIOL4701",
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
    id: "2",
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
              classId: "1107",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1108",
                    subject: "BIOL",
                  },
                ],
              },
            },
            {
              classId: "1108",
              subject: "BIOL",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1107",
                    subject: "BIOL",
                  },
                ],
              },
            },
            {
              classId: "1211",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1212",
                    subject: "CHEM",
                  },
                  {
                    classId: "1213",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "1212",
              subject: "CHEM",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1211",
                    subject: "CHEM",
                  },
                  {
                    classId: "1213",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "1213",
              subject: "CHEM",
              numCreditsMin: 0,
              numCreditsMax: 0,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1211",
                    subject: "CHEM",
                  },
                  {
                    classId: "1212",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "1251",
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
              classId: "1000",
              subject: "BIOC",
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
              classId: "2299",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "1101",
                    subject: "BIOL",
                    missing: true,
                  },
                  {
                    classId: "1107",
                    subject: "BIOL",
                  },
                  {
                    classId: "1111",
                    subject: "BIOL",
                  },
                ],
              },
            },
            {
              classId: "1214",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1215",
                    subject: "CHEM",
                  },
                  {
                    classId: "1216",
                    subject: "CHEM",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "1211",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "1215",
              subject: "CHEM",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1214",
                    subject: "CHEM",
                  },
                  {
                    classId: "1216",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "1216",
              subject: "CHEM",
              numCreditsMin: 0,
              numCreditsMax: 0,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1214",
                    subject: "CHEM",
                  },
                  {
                    classId: "1215",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "1252",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "1251",
                    subject: "MATH",
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
              classId: "2301",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "and",
                values: [
                  {
                    type: "or",
                    values: [
                      {
                        classId: "1103",
                        subject: "BIOL",
                        missing: true,
                      },
                      {
                        classId: "1113",
                        subject: "BIOL",
                      },
                      {
                        classId: "1115",
                        subject: "BIOL",
                      },
                      {
                        classId: "2297",
                        subject: "BIOL",
                        missing: true,
                      },
                      {
                        classId: "2299",
                        subject: "BIOL",
                      },
                      {
                        classId: "2290",
                        subject: "EEMB",
                      },
                      {
                        classId: "2400",
                        subject: "ENVR",
                        missing: true,
                      },
                      {
                        classId: "2400",
                        subject: "EEMB",
                      },
                    ],
                  },
                  {
                    type: "or",
                    values: [
                      {
                        classId: "1211",
                        subject: "CHEM",
                      },
                      {
                        classId: "1217",
                        subject: "CHEM",
                      },
                      {
                        classId: "1151",
                        subject: "CHEM",
                      },
                      {
                        classId: "1161",
                        subject: "CHEM",
                      },
                    ],
                  },
                ],
              },
            },
            {
              classId: "2302",
              subject: "BIOL",
              numCreditsMin: 1,
              numCreditsMax: 1,
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "2301",
                    subject: "BIOL",
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
              classId: "2309",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "2301",
                    subject: "BIOL",
                  },
                ],
              },
            },
            {
              classId: "2311",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "2312",
                    subject: "CHEM",
                  },
                ],
              },
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "1151",
                    subject: "CHEM",
                  },
                  {
                    classId: "1214",
                    subject: "CHEM",
                  },
                  {
                    classId: "1220",
                    subject: "CHEM",
                  },
                  {
                    classId: "1161",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "2312",
              subject: "CHEM",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "2311",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "1151",
              subject: "PHYS",
              numCreditsMin: 3,
              numCreditsMax: 3,
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
                    classId: "1340",
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
              classId: "1152",
              subject: "PHYS",
              numCreditsMin: 1,
              numCreditsMax: 1,
            },
            {
              classId: "1153",
              subject: "PHYS",
              numCreditsMin: 1,
              numCreditsMax: 1,
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
          classes: [
            {
              classId: "2313",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "2314",
                    subject: "CHEM",
                  },
                ],
              },
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "2311",
                    subject: "CHEM",
                  },
                  {
                    classId: "2315",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "2314",
              subject: "CHEM",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "2313",
                    subject: "CHEM",
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
              classId: "3611",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "3612",
                    subject: "BIOL",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "2301",
                    subject: "BIOL",
                  },
                  {
                    type: "or",
                    values: [
                      {
                        classId: "2313",
                        subject: "CHEM",
                      },
                      {
                        classId: "2317",
                        subject: "CHEM",
                      },
                    ],
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
              classId: "3612",
              subject: "BIOL",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "3611",
                    subject: "BIOL",
                  },
                ],
              },
            },
            {
              classId: "1155",
              subject: "PHYS",
              numCreditsMin: 3,
              numCreditsMax: 3,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1157",
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
                        classId: "1252",
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
                ],
              },
            },
            {
              classId: "1156",
              subject: "PHYS",
              numCreditsMin: 1,
              numCreditsMax: 1,
            },
            {
              classId: "1157",
              subject: "PHYS",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "1155",
                    subject: "PHYS",
                  },
                ],
              },
            },
            {
              classId: "3307",
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
          classes: [],
          status: "INACTIVE",
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
              classId: "4707",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "2323",
                    subject: "BIOL",
                    missing: true,
                  },
                  {
                    classId: "3611",
                    subject: "BIOL",
                  },
                ],
              },
            },
            {
              classId: "3431",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "3432",
                    subject: "CHEM",
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
                        classId: "1214",
                        subject: "CHEM",
                      },
                      {
                        classId: "1220",
                        subject: "CHEM",
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
                        classId: "1252",
                        subject: "MATH",
                      },
                    ],
                  },
                  {
                    type: "or",
                    values: [
                      {
                        classId: "1147",
                        subject: "PHYS",
                      },
                      {
                        classId: "1155",
                        subject: "PHYS",
                      },
                      {
                        classId: "1165",
                        subject: "PHYS",
                      },
                      {
                        classId: "1175",
                        subject: "PHYS",
                      },
                    ],
                  },
                ],
              },
            },
            {
              classId: "3432",
              subject: "CHEM",
              numCreditsMin: 1,
              numCreditsMax: 1,
              coreqs: {
                type: "and",
                values: [
                  {
                    classId: "3431",
                    subject: "CHEM",
                  },
                ],
              },
            },
            {
              classId: "4620",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              prereqs: {
                type: "or",
                values: [
                  {
                    classId: "2313",
                    subject: "CHEM",
                  },
                  {
                    classId: "2317",
                    subject: "CHEM",
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
          classes: [],
          status: "INACTIVE",
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
              numCreditsMin: 5,
              numCreditsMax: 5,
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
              numCreditsMin: 5,
              numCreditsMax: 5,
            },
            {
              classId: "9999",
              subject: "CHEM 4750 or BIOL4701",
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
    id: "3",
  },
];
