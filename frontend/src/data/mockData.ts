import {
  Concentration,
  Concentrations,
  IMajorRequirementGroup,
  Major,
} from "../../../common/types";
import {
  DNDSchedule,
  DNDScheduleCourse,
  SeasonEnum,
  StatusEnum,
} from "../models/types";

const mockClass = (num: number): DNDScheduleCourse => ({
  classId: "3500",
  subject: "CS",
  numCreditsMin: 4,
  numCreditsMax: 4,
  dndId: "class-" + num,
  name: "Object-Oriented Design",
});

export const mockEmptySchedule: DNDSchedule = {
  years: [2019, 2020, 2021, 2022],
  yearMap: {
    2019: {
      year: 2019,
      isSummerFull: false,
      fall: {
        season: SeasonEnum.FL,
        year: 2019,
        termId: 201910,
        status: StatusEnum.CLASSES,
        classes: [],
      },
      spring: {
        season: SeasonEnum.SP,
        year: 2019,
        termId: 201930,
        status: StatusEnum.CLASSES,
        classes: [],
      },
      summer1: {
        season: SeasonEnum.S1,
        year: 2019,
        termId: 201940,
        status: StatusEnum.CLASSES,
        classes: [],
      },
      summer2: {
        season: SeasonEnum.S2,
        year: 2019,
        termId: 201960,
        status: StatusEnum.CLASSES,
        classes: [],
      },
    },
    2020: {
      year: 2020,
      isSummerFull: false,
      fall: {
        season: SeasonEnum.FL,
        year: 2020,
        termId: 202010,
        status: StatusEnum.CLASSES,
        classes: [],
      },
      spring: {
        season: SeasonEnum.SP,
        year: 2020,
        termId: 202030,
        status: StatusEnum.CLASSES,
        classes: [],
      },
      summer1: {
        season: SeasonEnum.S1,
        year: 2020,
        termId: 202040,
        status: StatusEnum.CLASSES,
        classes: [],
      },
      summer2: {
        season: SeasonEnum.S2,
        year: 2020,
        termId: 202060,
        status: StatusEnum.CLASSES,
        classes: [],
      },
    },
    2021: {
      year: 2021,
      isSummerFull: false,
      fall: {
        season: SeasonEnum.FL,
        year: 2021,
        termId: 202110,
        status: StatusEnum.CLASSES,
        classes: [],
      },
      spring: {
        season: SeasonEnum.SP,
        year: 2021,
        termId: 202130,
        status: StatusEnum.CLASSES,
        classes: [],
      },
      summer1: {
        season: SeasonEnum.S1,
        year: 2021,
        termId: 202140,
        status: StatusEnum.CLASSES,
        classes: [],
      },
      summer2: {
        season: SeasonEnum.S2,
        year: 2021,
        termId: 202160,
        status: StatusEnum.CLASSES,
        classes: [],
      },
    },
    2022: {
      year: 2022,
      isSummerFull: false,
      fall: {
        season: SeasonEnum.FL,
        year: 2022,
        termId: 202210,
        status: StatusEnum.CLASSES,
        classes: [],
      },
      spring: {
        season: SeasonEnum.SP,
        year: 2022,
        termId: 202230,
        status: StatusEnum.CLASSES,
        classes: [],
      },
      summer1: {
        season: SeasonEnum.S1,
        year: 2022,
        termId: 202240,
        status: StatusEnum.CLASSES,
        classes: [],
      },
      summer2: {
        season: SeasonEnum.S2,
        year: 2022,
        termId: 202260,
        status: StatusEnum.CLASSES,
        classes: [],
      },
    },
  },
};

export const mockData: DNDSchedule = {
  years: [2019, 2020],
  yearMap: {
    2019: {
      year: 2019,
      isSummerFull: false,
      fall: {
        season: SeasonEnum.FL,
        year: 2019,
        termId: 201910,
        status: StatusEnum.CLASSES,
        classes: [mockClass(1), mockClass(2), mockClass(3), mockClass(4)],
      },
      spring: {
        season: SeasonEnum.SP,
        year: 2019,
        termId: 201930,
        status: StatusEnum.CLASSES,
        classes: [mockClass(5), mockClass(6), mockClass(7), mockClass(8)],
      },
      summer1: {
        season: SeasonEnum.S1,
        year: 2019,
        termId: 201940,
        status: StatusEnum.CLASSES,
        classes: [mockClass(9), mockClass(10)],
      },
      summer2: {
        season: SeasonEnum.S2,
        year: 2019,
        termId: 201960,
        status: StatusEnum.CLASSES,
        classes: [],
      },
    },
    2020: {
      year: 2020,
      isSummerFull: false,
      fall: {
        season: SeasonEnum.FL,
        year: 2020,
        termId: 202010,
        status: StatusEnum.CLASSES,
        classes: [mockClass(11), mockClass(12), mockClass(13), mockClass(14)],
      },
      spring: {
        season: SeasonEnum.SP,
        year: 2020,
        termId: 202030,
        status: StatusEnum.CLASSES,
        classes: [mockClass(15), mockClass(16), mockClass(17), mockClass(18)],
      },
      summer1: {
        season: SeasonEnum.S1,
        year: 2020,
        termId: 202040,
        status: StatusEnum.CLASSES,
        classes: [mockClass(19), mockClass(20)],
      },
      summer2: {
        season: SeasonEnum.S2,
        year: 2020,
        termId: 202060,
        status: StatusEnum.CLASSES,
        classes: [],
      },
    },
  },
};

export const majorWithConcentrationData: Major = {
  name: "Computer Science, BSCS",
  requirementGroups: [
    "Computer Science Overview",
    "Computer Science Fundamental Courses",
    "Computer Science Required Courses",
    "Security Required Course",
    "Presentation Requirement",
    "Khoury Elective Courses",
    "Mathematics Courses",
    "Computing and Social Issues",
    "Electrical Engineering",
    "Science Requirement",
    "College Writing",
    "Advanced Writing in the Disciplines",
  ],
  requirementGroupMap: {
    "Computer Science Overview": {
      type: "AND",
      name: "Computer Science Overview",
      requirements: [
        {
          type: "COURSE",
          classId: 1200,
          subject: "CS",
        },
        {
          type: "COURSE",
          classId: 1210,
          subject: "CS",
        },
      ],
    },
    "Computer Science Fundamental Courses": {
      type: "AND",
      name: "Computer Science Fundamental Courses",
      requirements: [
        {
          type: "AND",
          courses: [
            {
              type: "COURSE",
              classId: 1800,
              subject: "CS",
            },
            {
              type: "COURSE",
              classId: 1802,
              subject: "CS",
            },
          ],
        },
        {
          type: "AND",
          courses: [
            {
              type: "COURSE",
              classId: 2500,
              subject: "CS",
            },
            {
              type: "COURSE",
              classId: 2501,
              subject: "CS",
            },
          ],
        },
        {
          type: "AND",
          courses: [
            {
              type: "COURSE",
              classId: 2510,
              subject: "CS",
            },
            {
              type: "COURSE",
              classId: 2511,
              subject: "CS",
            },
          ],
        },
        {
          type: "COURSE",
          classId: 2810,
          subject: "CS",
        },
      ],
    },
    "Computer Science Required Courses": {
      type: "AND",
      name: "Computer Science Required Courses",
      requirements: [
        {
          type: "COURSE",
          classId: 3000,
          subject: "CS",
        },
        {
          type: "COURSE",
          classId: 3500,
          subject: "CS",
        },
        {
          type: "COURSE",
          classId: 3650,
          subject: "CS",
        },
        {
          type: "COURSE",
          classId: 3800,
          subject: "CS",
        },
        {
          type: "COURSE",
          classId: 4500,
          subject: "CS",
        },
      ],
    },
    "Security Required Course": {
      type: "OR",
      name: "Security Required Course",
      numCreditsMin: 4,
      numCreditsMax: 4,
      requirements: [
        {
          type: "COURSE",
          classId: 2550,
          subject: "CY",
        },
        {
          type: "COURSE",
          classId: 3740,
          subject: "CY",
        },
        {
          type: "COURSE",
          classId: 4740,
          subject: "CY",
        },
      ],
    },
    "Presentation Requirement": {
      type: "AND",
      name: "Presentation Requirement",
      requirements: [
        {
          type: "COURSE",
          classId: 1170,
          subject: "THTR",
        },
      ],
    },
    "Khoury Elective Courses": {
      type: "RANGE",
      name: "Khoury Elective Courses",
      numCreditsMin: 8,
      numCreditsMax: 8,
      requirements: {
        type: "RANGE",
        creditsRequired: 8,
        ranges: [
          {
            subject: "CS",
            idRangeStart: 2500,
            idRangeEnd: 9999,
          },
          {
            subject: "CY",
            idRangeStart: 2000,
            idRangeEnd: 9999,
          },
          {
            subject: "DS",
            idRangeStart: 2500,
            idRangeEnd: 9999,
          },
          {
            subject: "IS",
            idRangeStart: 2000,
            idRangeEnd: 9999,
          },
        ],
      },
    },
    "Mathematics Courses": {
      type: "AND",
      name: "Mathematics Courses",
      requirements: [
        {
          type: "COURSE",
          classId: 1341,
          subject: "MATH",
        },
        {
          type: "COURSE",
          classId: 1365,
          subject: "MATH",
        },
      ],
    },
    "Computing and Social Issues": {
      type: "OR",
      name: "Computing and Social Issues",
      numCreditsMin: 4,
      numCreditsMax: 4,
      requirements: [
        {
          type: "COURSE",
          classId: 3418,
          subject: "ANTH",
        },
        {
          type: "COURSE",
          classId: 5240,
          subject: "CY",
        },
        {
          type: "COURSE",
          classId: 2150,
          subject: "ENGL",
        },
        {
          type: "COURSE",
          classId: 2220,
          subject: "HIST",
        },
        {
          type: "COURSE",
          classId: 2102,
          subject: "INSH",
        },
        {
          type: "OR",
          courses: [
            {
              type: "COURSE",
              classId: 1300,
              subject: "IS",
            },
            {
              type: "COURSE",
              classId: 1300,
              subject: "PHIL",
            },
          ],
        },
        {
          type: "COURSE",
          classId: 1145,
          subject: "PHIL",
        },
        {
          type: "COURSE",
          classId: 1280,
          subject: "SOCL",
        },
        {
          type: "COURSE",
          classId: 3485,
          subject: "SOCL",
        },
        {
          type: "COURSE",
          classId: 4528,
          subject: "SOCL",
        },
      ],
    },
    "Electrical Engineering": {
      type: "AND",
      name: "Electrical Engineering",
      requirements: [
        {
          type: "COURSE",
          classId: 2160,
          subject: "EECE",
        },
      ],
    },
    "Science Requirement": {
      type: "OR",
      name: "Science Requirement",
      numCreditsMin: 8,
      numCreditsMax: 8,
      requirements: [
        {
          type: "AND",
          courses: [
            {
              type: "AND",
              courses: [
                {
                  type: "COURSE",
                  classId: 1111,
                  subject: "BIOL",
                },
                {
                  type: "COURSE",
                  classId: 1112,
                  subject: "BIOL",
                },
              ],
            },
            {
              type: "OR",
              courses: [
                {
                  type: "AND",
                  courses: [
                    {
                      type: "COURSE",
                      classId: 1113,
                      subject: "BIOL",
                    },
                    {
                      type: "COURSE",
                      classId: 1114,
                      subject: "BIOL",
                    },
                  ],
                },
                {
                  type: "AND",
                  courses: [
                    {
                      type: "COURSE",
                      classId: 2301,
                      subject: "BIOL",
                    },
                    {
                      type: "COURSE",
                      classId: 2302,
                      subject: "BIOL",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "AND",
          courses: [
            {
              type: "AND",
              courses: [
                {
                  type: "COURSE",
                  classId: 1211,
                  subject: "CHEM",
                },
                {
                  type: "COURSE",
                  classId: 1212,
                  subject: "CHEM",
                },
                {
                  type: "COURSE",
                  classId: 1213,
                  subject: "CHEM",
                },
              ],
            },
            {
              type: "AND",
              courses: [
                {
                  type: "COURSE",
                  classId: 1214,
                  subject: "CHEM",
                },
                {
                  type: "COURSE",
                  classId: 1215,
                  subject: "CHEM",
                },
                {
                  type: "COURSE",
                  classId: 1216,
                  subject: "CHEM",
                },
              ],
            },
          ],
        },
        {
          type: "AND",
          courses: [
            {
              type: "AND",
              courses: [
                {
                  type: "COURSE",
                  classId: 1200,
                  subject: "ENVR",
                },
                {
                  type: "COURSE",
                  classId: 1201,
                  subject: "ENVR",
                },
              ],
            },
            {
              type: "AND",
              courses: [
                {
                  type: "COURSE",
                  classId: 1202,
                  subject: "ENVR",
                },
                {
                  type: "COURSE",
                  classId: 1203,
                  subject: "ENVR",
                },
              ],
            },
          ],
        },
        {
          type: "AND",
          courses: [
            {
              type: "AND",
              courses: [
                {
                  type: "COURSE",
                  classId: 1200,
                  subject: "ENVR",
                },
                {
                  type: "COURSE",
                  classId: 1201,
                  subject: "ENVR",
                },
              ],
            },
            {
              type: "OR",
              courses: [
                {
                  type: "AND",
                  courses: [
                    {
                      type: "COURSE",
                      classId: 2310,
                      subject: "ENVR",
                    },
                    {
                      type: "COURSE",
                      classId: 2311,
                      subject: "ENVR",
                    },
                  ],
                },
                {
                  type: "AND",
                  courses: [
                    {
                      type: "COURSE",
                      classId: 2340,
                      subject: "ENVR",
                    },
                    {
                      type: "COURSE",
                      classId: 2341,
                      subject: "ENVR",
                    },
                  ],
                },
                {
                  type: "AND",
                  courses: [
                    {
                      type: "COURSE",
                      classId: 3300,
                      subject: "ENVR",
                    },
                    {
                      type: "COURSE",
                      classId: 3301,
                      subject: "ENVR",
                    },
                  ],
                },
                {
                  type: "AND",
                  courses: [
                    {
                      type: "COURSE",
                      classId: 4500,
                      subject: "ENVR",
                    },
                    {
                      type: "COURSE",
                      classId: 4501,
                      subject: "ENVR",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "AND",
          courses: [
            {
              type: "AND",
              courses: [
                {
                  type: "COURSE",
                  classId: 1202,
                  subject: "ENVR",
                },
                {
                  type: "COURSE",
                  classId: 1203,
                  subject: "ENVR",
                },
              ],
            },
            {
              type: "AND",
              courses: [
                {
                  type: "COURSE",
                  classId: 5242,
                  subject: "ENVR",
                },
                {
                  type: "COURSE",
                  classId: 5243,
                  subject: "ENVR",
                },
              ],
            },
          ],
        },
        {
          type: "AND",
          courses: [
            {
              type: "COURSE",
              classId: 1342,
              subject: "MATH",
            },
            {
              type: "COURSE",
              classId: 2331,
              subject: "MATH",
            },
            {
              type: "COURSE",
              classId: 3081,
              subject: "MATH",
            },
          ],
        },
        {
          type: "OR",
          courses: [
            {
              type: "AND",
              courses: [
                {
                  type: "AND",
                  courses: [
                    {
                      type: "COURSE",
                      classId: 1145,
                      subject: "PHYS",
                    },
                    {
                      type: "COURSE",
                      classId: 1146,
                      subject: "PHYS",
                    },
                  ],
                },
                {
                  type: "AND",
                  courses: [
                    {
                      type: "COURSE",
                      classId: 1147,
                      subject: "PHYS",
                    },
                    {
                      type: "COURSE",
                      classId: 1148,
                      subject: "PHYS",
                    },
                  ],
                },
              ],
            },
            {
              type: "AND",
              courses: [
                {
                  type: "AND",
                  courses: [
                    {
                      type: "COURSE",
                      classId: 1151,
                      subject: "PHYS",
                    },
                    {
                      type: "COURSE",
                      classId: 1152,
                      subject: "PHYS",
                    },
                    {
                      type: "COURSE",
                      classId: 1153,
                      subject: "PHYS",
                    },
                  ],
                },
                {
                  type: "AND",
                  courses: [
                    {
                      type: "COURSE",
                      classId: 1155,
                      subject: "PHYS",
                    },
                    {
                      type: "COURSE",
                      classId: 1156,
                      subject: "PHYS",
                    },
                    {
                      type: "COURSE",
                      classId: 1157,
                      subject: "PHYS",
                    },
                  ],
                },
              ],
            },
            {
              type: "AND",
              courses: [
                {
                  type: "AND",
                  courses: [
                    {
                      type: "COURSE",
                      classId: 1161,
                      subject: "PHYS",
                    },
                    {
                      type: "COURSE",
                      classId: 1162,
                      subject: "PHYS",
                    },
                    {
                      type: "COURSE",
                      classId: 1163,
                      subject: "PHYS",
                    },
                  ],
                },
                {
                  type: "AND",
                  courses: [
                    {
                      type: "COURSE",
                      classId: 1165,
                      subject: "PHYS",
                    },
                    {
                      type: "COURSE",
                      classId: 1166,
                      subject: "PHYS",
                    },
                    {
                      type: "COURSE",
                      classId: 1167,
                      subject: "PHYS",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    "College Writing": {
      type: "AND",
      name: "College Writing",
      requirements: [
        {
          type: "COURSE",
          classId: 1111,
          subject: "ENGW",
        },
      ],
    },
    "Advanced Writing in the Disciplines": {
      type: "AND",
      name: "Advanced Writing in the Disciplines",
      requirements: [
        {
          type: "OR",
          courses: [
            {
              type: "COURSE",
              classId: 3302,
              subject: "ENGW",
            },
            {
              type: "COURSE",
              classId: 3315,
              subject: "ENGW",
            },
          ],
        },
      ],
    },
  },
  yearVersion: 2020,
  isLanguageRequired: false,
  nupaths: [],
  totalCreditsRequired: 133,
  concentrations: {
    minOptions: 1,
    maxOptions: 1,
    concentrationOptions: [
      {
        name: "Artificial Intelligence",
        requirementGroups: ["Computer Science Concentrations "],
        requirementGroupMap: {
          "Computer Science Concentrations ": {
            type: "AND",
            name: "Computer Science Concentrations ",
            requirements: [
              {
                type: "COURSE",
                classId: 4100,
                subject: "CS",
              },
              {
                type: "COURSE",
                classId: 4400,
                subject: "DS",
              },
              {
                type: "CREDITS",
                minCredits: 8,
                maxCredits: 8,
                courses: [
                  {
                    type: "COURSE",
                    classId: 4120,
                    subject: "CS",
                  },
                  {
                    type: "COURSE",
                    classId: 4150,
                    subject: "CS",
                  },
                  {
                    type: "COURSE",
                    classId: 4610,
                    subject: "CS",
                  },
                  {
                    type: "COURSE",
                    classId: 4200,
                    subject: "IS",
                  },
                  {
                    type: "COURSE",
                    classId: 4420,
                    subject: "DS",
                  },
                  {
                    type: "COURSE",
                    classId: 3466,
                    subject: "PSYC",
                  },
                ],
              },
            ],
          },
        },
      },
      {
        name: "Foundations",
        requirementGroups: ["Computer Science Concentrations "],
        requirementGroupMap: {
          "Computer Science Concentrations ": {
            type: "AND",
            name: "Computer Science Concentrations ",
            requirements: [
              {
                type: "OR",
                courses: [
                  {
                    type: "AND",
                    courses: [
                      {
                        type: "COURSE",
                        classId: 2800,
                        subject: "CS",
                      },
                      {
                        type: "COURSE",
                        classId: 2801,
                        subject: "CS",
                      },
                    ],
                  },
                  {
                    type: "COURSE",
                    classId: 4820,
                    subject: "CS",
                  },
                ],
              },
              {
                type: "OR",
                courses: [
                  {
                    type: "COURSE",
                    classId: 4805,
                    subject: "CS",
                  },
                  {
                    type: "COURSE",
                    classId: 4810,
                    subject: "CS",
                  },
                ],
              },
              {
                type: "CREDITS",
                minCredits: 8,
                maxCredits: 8,
                courses: [
                  {
                    type: "COURSE",
                    classId: 4805,
                    subject: "CS",
                  },
                  {
                    type: "COURSE",
                    classId: 4810,
                    subject: "CS",
                  },
                  {
                    type: "COURSE",
                    classId: 4820,
                    subject: "CS",
                  },
                  {
                    type: "COURSE",
                    classId: 4830,
                    subject: "CS",
                  },
                  {
                    type: "AND",
                    courses: [
                      {
                        type: "COURSE",
                        classId: 3950,
                        subject: "CS",
                      },
                      {
                        type: "COURSE",
                        classId: 4950,
                        subject: "CS",
                      },
                      {
                        type: "COURSE",
                        classId: 4950,
                        subject: "CS",
                      },
                    ],
                  },
                  {
                    type: "COURSE",
                    classId: 4770,
                    subject: "CY",
                  },
                ],
              },
            ],
          },
        },
      },
      {
        name: "Human-Centered Computing",
        requirementGroups: ["Computer Science Concentrations "],
        requirementGroupMap: {
          "Computer Science Concentrations ": {
            type: "AND",
            name: "Computer Science Concentrations ",
            requirements: [
              {
                type: "COURSE",
                classId: 4300,
                subject: "IS",
              },
              {
                type: "COURSE",
                classId: 4800,
                subject: "IS",
              },
              {
                type: "CREDITS",
                minCredits: 8,
                maxCredits: 8,
                courses: [
                  {
                    type: "COURSE",
                    classId: 2000,
                    subject: "IS",
                  },
                  {
                    type: "COURSE",
                    classId: 4700,
                    subject: "IS",
                  },
                  {
                    type: "COURSE",
                    classId: 4120,
                    subject: "CS",
                  },
                  {
                    type: "COURSE",
                    classId: 4520,
                    subject: "CS",
                  },
                  {
                    type: "COURSE",
                    classId: 4550,
                    subject: "CS",
                  },
                  {
                    type: "COURSE",
                    classId: 4200,
                    subject: "DS",
                  },
                ],
              },
            ],
          },
        },
      },
      {
        name: "Software",
        requirementGroups: ["Computer Science Concentrations "],
        requirementGroupMap: {
          "Computer Science Concentrations ": {
            type: "AND",
            name: "Computer Science Concentrations ",
            requirements: [
              {
                type: "AND",
                courses: [
                  {
                    type: "COURSE",
                    classId: 2800,
                    subject: "CS",
                  },
                  {
                    type: "COURSE",
                    classId: 2801,
                    subject: "CS",
                  },
                ],
              },
              {
                type: "COURSE",
                classId: 3700,
                subject: "CS",
              },
              {
                type: "COURSE",
                classId: 4400,
                subject: "CS",
              },
              {
                type: "CREDITS",
                minCredits: 4,
                maxCredits: 4,
                courses: [
                  {
                    type: "COURSE",
                    classId: 3520,
                    subject: "CS",
                  },
                  {
                    type: "COURSE",
                    classId: 3620,
                    subject: "CS",
                  },
                  {
                    type: "COURSE",
                    classId: 4240,
                    subject: "CS",
                  },
                  {
                    type: "COURSE",
                    classId: 4410,
                    subject: "CS",
                  },
                  {
                    type: "COURSE",
                    classId: 4550,
                    subject: "CS",
                  },
                  {
                    type: "COURSE",
                    classId: 4520,
                    subject: "CS",
                  },
                  {
                    type: "COURSE",
                    classId: 4820,
                    subject: "CS",
                  },
                ],
              },
            ],
          },
        },
      },
      {
        name: "Systems",
        requirementGroups: ["Computer Science Concentrations "],
        requirementGroupMap: {
          "Computer Science Concentrations ": {
            type: "AND",
            name: "Computer Science Concentrations ",
            requirements: [
              {
                type: "COURSE",
                classId: 3700,
                subject: "CS",
              },
              {
                type: "CREDITS",
                minCredits: 4,
                maxCredits: 4,
                courses: [
                  {
                    type: "COURSE",
                    classId: 3740,
                    subject: "CY",
                  },
                  {
                    type: "COURSE",
                    classId: 4740,
                    subject: "CY",
                  },
                ],
              },
              {
                type: "CREDITS",
                minCredits: 8,
                maxCredits: 8,
                courses: [
                  {
                    type: "COURSE",
                    classId: 3520,
                    subject: "CS",
                  },
                  {
                    type: "COURSE",
                    classId: 4300,
                    subject: "CS",
                  },
                  {
                    type: "COURSE",
                    classId: 3740,
                    subject: "CY",
                  },
                  {
                    type: "COURSE",
                    classId: 4610,
                    subject: "CS",
                  },
                  {
                    type: "COURSE",
                    classId: 4710,
                    subject: "CS",
                  },
                  {
                    type: "COURSE",
                    classId: 4650,
                    subject: "CS",
                  },
                  {
                    type: "COURSE",
                    classId: 4740,
                    subject: "CY",
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
};
