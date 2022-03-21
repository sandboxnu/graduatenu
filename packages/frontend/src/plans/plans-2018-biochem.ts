import { Schedule } from "@graduate/common";

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
          classes: [
            {
              classId: "1107",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "",
            },
            {
              classId: "1108",
              subject: "BIOL",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "",
            },
            {
              classId: "1211",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "General Chemistry 1",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "1212",
                  },
                  {
                    subject: "CHEM",
                    classId: "1213",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1212",
              subject: "CHEM",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "Lab for CHEM 1211",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "1211",
                  },
                  {
                    subject: "CHEM",
                    classId: "1213",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1213",
              subject: "CHEM",
              numCreditsMin: 0,
              numCreditsMax: 0,
              semester: null,
              name: "Recitation for CHEM 1211",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "1211",
                  },
                  {
                    subject: "CHEM",
                    classId: "1212",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1251",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Calculus and Differential Equations for Biology 1",
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
              name: "Elective 1",
            },
            {
              classId: "1000",
              subject: "BIOC",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "",
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
              classId: "2299",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Inquiries in Biological Sciences",
              coreqs: {
                type: "and",
                values: [],
              },
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
                    missing: true,
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
              semester: null,
              name: "General Chemistry 2 (HON)",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "1215",
                  },
                  {
                    subject: "CHEM",
                    classId: "1216",
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
              semester: null,
              name: "Lab for CHEM 1214",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "1214",
                  },
                  {
                    subject: "CHEM",
                    classId: "1216",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1216",
              subject: "CHEM",
              numCreditsMin: 0,
              numCreditsMax: 0,
              semester: null,
              name: "Recitation for CHEM 1214",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "1214",
                  },
                  {
                    subject: "CHEM",
                    classId: "1215",
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
              classId: "1252",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Calc & Diff Eq -Biol 2 (HON)",
              coreqs: {
                type: "and",
                values: [],
              },
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
          classes: [
            {
              classId: "2301",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Genetics and Molecular Biology",
              coreqs: {
                type: "and",
                values: [],
              },
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
                        missing: true,
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
                      {
                        classId: "1105",
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
                        missing: true,
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
              semester: null,
              name: "Lab for BIOL 2301",
              coreqs: {
                type: "and",
                values: [],
              },
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
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective 2",
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
              name: "Elective 3",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective 4",
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
              classId: "2309",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Biology Project Lab",
              coreqs: {
                type: "and",
                values: [],
              },
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
              semester: null,
              name: "Organic Chemistry 1",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "2312",
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
                    missing: true,
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
              semester: null,
              name: "Lab for CHEM 2311",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "2311",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1151",
              subject: "PHYS",
              numCreditsMin: 3,
              numCreditsMax: 3,
              semester: null,
              name: "Physics for Engineering 1",
              coreqs: {
                type: "and",
                values: [],
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
              semester: null,
              name: "Lab for PHYS 1151 (HON)",
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
              classId: "1153",
              subject: "PHYS",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "Interactive Learning Seminar for PHYS 1151",
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
              name: "Elective 5",
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
              classId: "2313",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Organic Chemistry 2",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "2314",
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
              semester: null,
              name: "Lab for CHEM 2313",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "2313",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1155",
              subject: "PHYS",
              numCreditsMin: 3,
              numCreditsMax: 3,
              semester: null,
              name: "Physics for Engineering 2",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "PHYS",
                    classId: "1157",
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
              semester: null,
              name: "Lab for PHYS 1155",
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
              classId: "1157",
              subject: "PHYS",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "Interactive Learning Seminar for PHYS 1155",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "PHYS",
                    classId: "1155",
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
              name: "Elective 6",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective 7",
            },
            {
              classId: "2000",
              subject: "EESC",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
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
          classes: [
            {
              classId: "3611",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Biochemistry",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "BIOL",
                    classId: "3612",
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
              semester: null,
              name: "Lab for BIOL 3611",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "BIOL",
                    classId: "3611",
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
              name: "Elective 8",
            },
          ],
          status: "CLASSES",
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
              classId: "3431",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Physical Chemistry",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "3432",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "1214",
                    subject: "CHEM",
                  },
                  {
                    classId: "1220",
                    subject: "CHEM",
                    missing: true,
                  },
                  {
                    type: "or",
                    values: [
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
                        missing: true,
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
              semester: null,
              name: "Lab for CHEM 3431",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "3431",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "4620",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "",
            },
            {
              classId: "3307",
              subject: "ENGW",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Advanced Writing in the Sciences",
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
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective 9",
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
              classId: "4707",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Cell and Molecular Biology",
              coreqs: {
                type: "and",
                values: [],
              },
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
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective 10",
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
          classes: [
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 5,
              numCreditsMax: 5,
              semester: null,
              name: "BIOL or CHEM advanced elective",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 5,
              numCreditsMax: 5,
              semester: null,
              name: "BIOL or CHEM advanced elective",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 5,
              numCreditsMax: 5,
              semester: null,
              name: "BIOL or CHEM advanced elective",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "CHEM 4750 or BIOL4701",
            },
          ],
          status: "CLASSES",
        },
        spring: {
          season: "SP",
          year: 1003,
          termId: 100330,
          classes: [],
          status: "INACTIVE",
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
              classId: "1107",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "",
            },
            {
              classId: "1108",
              subject: "BIOL",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "",
            },
            {
              classId: "1211",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "General Chemistry 1",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "1212",
                  },
                  {
                    subject: "CHEM",
                    classId: "1213",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1212",
              subject: "CHEM",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "Lab for CHEM 1211",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "1211",
                  },
                  {
                    subject: "CHEM",
                    classId: "1213",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1213",
              subject: "CHEM",
              numCreditsMin: 0,
              numCreditsMax: 0,
              semester: null,
              name: "Recitation for CHEM 1211",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "1211",
                  },
                  {
                    subject: "CHEM",
                    classId: "1212",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1251",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Calculus and Differential Equations for Biology 1",
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
              name: "Elective 1",
            },
            {
              classId: "1000",
              subject: "BIOC",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "",
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
              classId: "2299",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Inquiries in Biological Sciences",
              coreqs: {
                type: "and",
                values: [],
              },
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
                    missing: true,
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
              semester: null,
              name: "General Chemistry 2 (HON)",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "1215",
                  },
                  {
                    subject: "CHEM",
                    classId: "1216",
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
              semester: null,
              name: "Lab for CHEM 1214",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "1214",
                  },
                  {
                    subject: "CHEM",
                    classId: "1216",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1216",
              subject: "CHEM",
              numCreditsMin: 0,
              numCreditsMax: 0,
              semester: null,
              name: "Recitation for CHEM 1214",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "1214",
                  },
                  {
                    subject: "CHEM",
                    classId: "1215",
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
              classId: "1252",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Calc & Diff Eq -Biol 2 (HON)",
              coreqs: {
                type: "and",
                values: [],
              },
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
          classes: [
            {
              classId: "2301",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Genetics and Molecular Biology",
              coreqs: {
                type: "and",
                values: [],
              },
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
                        missing: true,
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
                      {
                        classId: "1105",
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
                        missing: true,
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
              semester: null,
              name: "Lab for BIOL 2301",
              coreqs: {
                type: "and",
                values: [],
              },
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
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective 2",
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
              name: "Elective 3",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective 4",
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
              classId: "2309",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Biology Project Lab",
              coreqs: {
                type: "and",
                values: [],
              },
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
              semester: null,
              name: "Organic Chemistry 1",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "2312",
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
                    missing: true,
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
              semester: null,
              name: "Lab for CHEM 2311",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "2311",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1151",
              subject: "PHYS",
              numCreditsMin: 3,
              numCreditsMax: 3,
              semester: null,
              name: "Physics for Engineering 1",
              coreqs: {
                type: "and",
                values: [],
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
              semester: null,
              name: "Lab for PHYS 1151 (HON)",
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
              classId: "1153",
              subject: "PHYS",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "Interactive Learning Seminar for PHYS 1151",
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
              name: "Elective 5",
            },
            {
              classId: "2000",
              subject: "EESC",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
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
          classes: [
            {
              classId: "2313",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Organic Chemistry 2",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "2314",
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
              semester: null,
              name: "Lab for CHEM 2313",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "2313",
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
              name: "Elective 6",
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
              classId: "3611",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Biochemistry",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "BIOL",
                    classId: "3612",
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
              semester: null,
              name: "Lab for BIOL 3611",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "BIOL",
                    classId: "3611",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1155",
              subject: "PHYS",
              numCreditsMin: 3,
              numCreditsMax: 3,
              semester: null,
              name: "Physics for Engineering 2",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "PHYS",
                    classId: "1157",
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
              semester: null,
              name: "Lab for PHYS 1155",
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
              classId: "1157",
              subject: "PHYS",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "Interactive Learning Seminar for PHYS 1155",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "PHYS",
                    classId: "1155",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "3307",
              subject: "ENGW",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Advanced Writing in the Sciences",
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
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective 7",
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
              classId: "4707",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Cell and Molecular Biology",
              coreqs: {
                type: "and",
                values: [],
              },
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
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective 8",
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
              classId: "3431",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Physical Chemistry",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "3432",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "1214",
                    subject: "CHEM",
                  },
                  {
                    classId: "1220",
                    subject: "CHEM",
                    missing: true,
                  },
                  {
                    type: "or",
                    values: [
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
                        missing: true,
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
              semester: null,
              name: "Lab for CHEM 3431",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "3431",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "4620",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 5,
              numCreditsMax: 5,
              semester: null,
              name: "BIOL or CHEM advanced elective",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective 9",
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
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 5,
              numCreditsMax: 5,
              semester: null,
              name: "BIOL or CHEM advanced elective",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 5,
              numCreditsMax: 5,
              semester: null,
              name: "BIOL or CHEM advanced elective",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "CHEM 4750 or BIOL4701",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective 10",
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
              classId: "1107",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "",
            },
            {
              classId: "1108",
              subject: "BIOL",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "",
            },
            {
              classId: "1211",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "General Chemistry 1",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "1212",
                  },
                  {
                    subject: "CHEM",
                    classId: "1213",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1212",
              subject: "CHEM",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "Lab for CHEM 1211",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "1211",
                  },
                  {
                    subject: "CHEM",
                    classId: "1213",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1213",
              subject: "CHEM",
              numCreditsMin: 0,
              numCreditsMax: 0,
              semester: null,
              name: "Recitation for CHEM 1211",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "1211",
                  },
                  {
                    subject: "CHEM",
                    classId: "1212",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1251",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Calculus and Differential Equations for Biology 1",
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
              name: "Elective 1",
            },
            {
              classId: "1000",
              subject: "BIOC",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "",
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
              classId: "2299",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Inquiries in Biological Sciences",
              coreqs: {
                type: "and",
                values: [],
              },
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
                    missing: true,
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
              semester: null,
              name: "General Chemistry 2 (HON)",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "1215",
                  },
                  {
                    subject: "CHEM",
                    classId: "1216",
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
              semester: null,
              name: "Lab for CHEM 1214",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "1214",
                  },
                  {
                    subject: "CHEM",
                    classId: "1216",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1216",
              subject: "CHEM",
              numCreditsMin: 0,
              numCreditsMax: 0,
              semester: null,
              name: "Recitation for CHEM 1214",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "1214",
                  },
                  {
                    subject: "CHEM",
                    classId: "1215",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1252",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Calc & Diff Eq -Biol 2 (HON)",
              coreqs: {
                type: "and",
                values: [],
              },
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
          ],
          status: "CLASSES",
        },
        summer1: {
          season: "S1",
          year: 1000,
          termId: 100040,
          classes: [
            {
              classId: "2301",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Genetics and Molecular Biology",
              coreqs: {
                type: "and",
                values: [],
              },
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
                        missing: true,
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
                      {
                        classId: "1105",
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
                        missing: true,
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
              semester: null,
              name: "Lab for BIOL 2301",
              coreqs: {
                type: "and",
                values: [],
              },
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
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective 2",
            },
          ],
          status: "CLASSES",
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
              classId: "2309",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Biology Project Lab",
              coreqs: {
                type: "and",
                values: [],
              },
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
              semester: null,
              name: "Organic Chemistry 1",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "2312",
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
                    missing: true,
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
              semester: null,
              name: "Lab for CHEM 2311",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "2311",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1151",
              subject: "PHYS",
              numCreditsMin: 3,
              numCreditsMax: 3,
              semester: null,
              name: "Physics for Engineering 1",
              coreqs: {
                type: "and",
                values: [],
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
              semester: null,
              name: "Lab for PHYS 1151 (HON)",
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
              classId: "1153",
              subject: "PHYS",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "Interactive Learning Seminar for PHYS 1151",
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
              name: "Elective 3",
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
              classId: "2313",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Organic Chemistry 2",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "2314",
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
              semester: null,
              name: "Lab for CHEM 2313",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "2313",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1155",
              subject: "PHYS",
              numCreditsMin: 3,
              numCreditsMax: 3,
              semester: null,
              name: "Physics for Engineering 2",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "PHYS",
                    classId: "1157",
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
              semester: null,
              name: "Lab for PHYS 1155",
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
              classId: "1157",
              subject: "PHYS",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "Interactive Learning Seminar for PHYS 1155",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "PHYS",
                    classId: "1155",
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
              name: "Elective 4",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective 5",
            },
            {
              classId: "2000",
              subject: "EESC",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
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
          classes: [
            {
              classId: "3611",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Biochemistry",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "BIOL",
                    classId: "3612",
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
              semester: null,
              name: "Lab for BIOL 3611",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "BIOL",
                    classId: "3611",
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
              name: "Elective 6",
            },
          ],
          status: "CLASSES",
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
              classId: "4707",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Cell and Molecular Biology",
              coreqs: {
                type: "and",
                values: [],
              },
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
              semester: null,
              name: "Physical Chemistry",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "3432",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "1214",
                    subject: "CHEM",
                  },
                  {
                    classId: "1220",
                    subject: "CHEM",
                    missing: true,
                  },
                  {
                    type: "or",
                    values: [
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
                        missing: true,
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
              semester: null,
              name: "Lab for CHEM 3431",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "3431",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "3307",
              subject: "ENGW",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Advanced Writing in the Sciences",
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
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective 7",
            },
          ],
          status: "CLASSES",
        },
        summer1: {
          season: "S1",
          year: 1002,
          termId: 100240,
          classes: [],
          status: "INACTIVE",
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
              classId: "4620",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 5,
              numCreditsMax: 5,
              semester: null,
              name: "BIOL or CHEM advanced elective",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective 8",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective 9",
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
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 5,
              numCreditsMax: 5,
              semester: null,
              name: "BIOL or CHEM advanced elective",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 5,
              numCreditsMax: 5,
              semester: null,
              name: "BIOL or CHEM advanced elective",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "CHEM 4750 or BIOL4701",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective 10",
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
              classId: "1107",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "",
            },
            {
              classId: "1108",
              subject: "BIOL",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "",
            },
            {
              classId: "1211",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "General Chemistry 1",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "1212",
                  },
                  {
                    subject: "CHEM",
                    classId: "1213",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1212",
              subject: "CHEM",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "Lab for CHEM 1211",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "1211",
                  },
                  {
                    subject: "CHEM",
                    classId: "1213",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1213",
              subject: "CHEM",
              numCreditsMin: 0,
              numCreditsMax: 0,
              semester: null,
              name: "Recitation for CHEM 1211",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "1211",
                  },
                  {
                    subject: "CHEM",
                    classId: "1212",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1251",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Calculus and Differential Equations for Biology 1",
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
              name: "Elective 1",
            },
            {
              classId: "1000",
              subject: "BIOC",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "",
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
              classId: "2299",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Inquiries in Biological Sciences",
              coreqs: {
                type: "and",
                values: [],
              },
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
                    missing: true,
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
              semester: null,
              name: "General Chemistry 2 (HON)",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "1215",
                  },
                  {
                    subject: "CHEM",
                    classId: "1216",
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
              semester: null,
              name: "Lab for CHEM 1214",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "1214",
                  },
                  {
                    subject: "CHEM",
                    classId: "1216",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1216",
              subject: "CHEM",
              numCreditsMin: 0,
              numCreditsMax: 0,
              semester: null,
              name: "Recitation for CHEM 1214",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "1214",
                  },
                  {
                    subject: "CHEM",
                    classId: "1215",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1252",
              subject: "MATH",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Calc & Diff Eq -Biol 2 (HON)",
              coreqs: {
                type: "and",
                values: [],
              },
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
          ],
          status: "CLASSES",
        },
        summer1: {
          season: "S1",
          year: 1000,
          termId: 100040,
          classes: [
            {
              classId: "2301",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Genetics and Molecular Biology",
              coreqs: {
                type: "and",
                values: [],
              },
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
                        missing: true,
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
                      {
                        classId: "1105",
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
                        missing: true,
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
              semester: null,
              name: "Lab for BIOL 2301",
              coreqs: {
                type: "and",
                values: [],
              },
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
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective 2",
            },
          ],
          status: "CLASSES",
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
              classId: "2309",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Biology Project Lab",
              coreqs: {
                type: "and",
                values: [],
              },
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
              semester: null,
              name: "Organic Chemistry 1",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "2312",
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
                    missing: true,
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
              semester: null,
              name: "Lab for CHEM 2311",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "2311",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1151",
              subject: "PHYS",
              numCreditsMin: 3,
              numCreditsMax: 3,
              semester: null,
              name: "Physics for Engineering 1",
              coreqs: {
                type: "and",
                values: [],
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
              semester: null,
              name: "Lab for PHYS 1151 (HON)",
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
              classId: "1153",
              subject: "PHYS",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "Interactive Learning Seminar for PHYS 1151",
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
              name: "Elective 3",
            },
            {
              classId: "2000",
              subject: "EESC",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
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
          classes: [
            {
              classId: "2313",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Organic Chemistry 2",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "2314",
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
              semester: null,
              name: "Lab for CHEM 2313",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "2313",
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
              name: "Elective 4",
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
              classId: "3611",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Biochemistry",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "BIOL",
                    classId: "3612",
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
              semester: null,
              name: "Lab for BIOL 3611",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "BIOL",
                    classId: "3611",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "1155",
              subject: "PHYS",
              numCreditsMin: 3,
              numCreditsMax: 3,
              semester: null,
              name: "Physics for Engineering 2",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "PHYS",
                    classId: "1157",
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
              semester: null,
              name: "Lab for PHYS 1155",
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
              classId: "1157",
              subject: "PHYS",
              numCreditsMin: 1,
              numCreditsMax: 1,
              semester: null,
              name: "Interactive Learning Seminar for PHYS 1155",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "PHYS",
                    classId: "1155",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "3307",
              subject: "ENGW",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Advanced Writing in the Sciences",
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
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective 5",
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
          classes: [
            {
              classId: "4707",
              subject: "BIOL",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Cell and Molecular Biology",
              coreqs: {
                type: "and",
                values: [],
              },
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
              semester: null,
              name: "Physical Chemistry",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "3432",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [
                  {
                    classId: "1214",
                    subject: "CHEM",
                  },
                  {
                    classId: "1220",
                    subject: "CHEM",
                    missing: true,
                  },
                  {
                    type: "or",
                    values: [
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
                        missing: true,
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
              semester: null,
              name: "Lab for CHEM 3431",
              coreqs: {
                type: "and",
                values: [
                  {
                    subject: "CHEM",
                    classId: "3431",
                  },
                ],
              },
              prereqs: {
                type: "and",
                values: [],
              },
            },
            {
              classId: "4620",
              subject: "CHEM",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective 6",
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
          classes: [
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 5,
              numCreditsMax: 5,
              semester: null,
              name: "BIOL or CHEM advanced elective",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 5,
              numCreditsMax: 5,
              semester: null,
              name: "BIOL or CHEM advanced elective",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective 7",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective 8",
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
              numCreditsMin: 5,
              numCreditsMax: 5,
              semester: null,
              name: "BIOL or CHEM advanced elective",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "CHEM 4750 or BIOL4701",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective 9",
            },
            {
              classId: "9999",
              subject: "XXXX",
              numCreditsMin: 4,
              numCreditsMax: 4,
              semester: null,
              name: "Elective 10",
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
