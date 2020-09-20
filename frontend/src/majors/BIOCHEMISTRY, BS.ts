import { Major } from "../../../common/types";

export const biochemMajor: Major = {
  name: "Biochemistry, BS",
  yearVersion: 2018,
  isLanguageRequired: false,
  totalCreditsRequired: 0,
  nupaths: [],
  concentrations: {
    concentrationOptions: [],
    maxOptions: 0,
    minOptions: 0,
  },
  requirementGroups: [
    "Introduction to College",
    "Foundations",
    "Inquiries",
    "Techniques",
    "Genetics and Molecular Biology",
    "General Chemistry 1",
    "General Chemistry 2",
    "Organic Chemistry 1",
    "Organic Chemistry 2",
    "Physical Chemistry ",
    "Biochemistry Courses",
    "Experiential Learning Introduction",
    "Capstone",
    "Biology and Chemistry Advanced Electives",
    "Mathematics Courses",
    "Physics 1",
    "Physics 2",
  ],
  requirementGroupMap: {
    "Introduction to College": {
      type: "AND",
      name: "Introduction to College",
      requirements: [
        {
          type: "COURSE",
          classId: 1000,
          subject: "BIOC",
        },
      ],
    },
    Foundations: {
      type: "AND",
      name: "Foundations",
      requirements: [
        {
          type: "AND",
          courses: [
            {
              type: "COURSE",
              classId: 1107,
              subject: "BIOL",
            },
            {
              type: "COURSE",
              classId: 1108,
              subject: "BIOL",
            },
          ],
        },
      ],
    },
    Inquiries: {
      type: "AND",
      name: "Inquiries",
      requirements: [
        {
          type: "COURSE",
          classId: 2299,
          subject: "BIOL",
        },
      ],
    },
    Techniques: {
      type: "AND",
      name: "Techniques",
      requirements: [
        {
          type: "COURSE",
          classId: 2309,
          subject: "BIOL",
        },
      ],
    },
    "Genetics and Molecular Biology": {
      type: "AND",
      name: "Genetics and Molecular Biology",
      requirements: [
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
    "General Chemistry 1": {
      type: "AND",
      name: "General Chemistry 1",
      requirements: [
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
          ],
        },
      ],
    },
    "General Chemistry 2": {
      type: "AND",
      name: "General Chemistry 2",
      requirements: [
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
          ],
        },
      ],
    },
    "Organic Chemistry 1": {
      type: "AND",
      name: "Organic Chemistry 1",
      requirements: [
        {
          type: "AND",
          courses: [
            {
              type: "COURSE",
              classId: 2311,
              subject: "CHEM",
            },
            {
              type: "COURSE",
              classId: 2312,
              subject: "CHEM",
            },
          ],
        },
      ],
    },
    "Organic Chemistry 2": {
      type: "AND",
      name: "Organic Chemistry 2",
      requirements: [
        {
          type: "AND",
          courses: [
            {
              type: "COURSE",
              classId: 2313,
              subject: "CHEM",
            },
            {
              type: "COURSE",
              classId: 2314,
              subject: "CHEM",
            },
          ],
        },
      ],
    },
    "Physical Chemistry ": {
      type: "AND",
      name: "Physical Chemistry ",
      requirements: [
        {
          type: "AND",
          courses: [
            {
              type: "COURSE",
              classId: 3431,
              subject: "CHEM",
            },
            {
              type: "COURSE",
              classId: 3432,
              subject: "CHEM",
            },
          ],
        },
      ],
    },
    "Biochemistry Courses": {
      type: "AND",
      name: "Biochemistry Courses",
      requirements: [
        {
          type: "AND",
          courses: [
            {
              type: "COURSE",
              classId: 3611,
              subject: "BIOL",
            },
            {
              type: "COURSE",
              classId: 3612,
              subject: "BIOL",
            },
          ],
        },
        {
          type: "COURSE",
          classId: 4707,
          subject: "BIOL",
        },
        {
          type: "COURSE",
          classId: 4620,
          subject: "CHEM",
        },
      ],
    },
    "Experiential Learning Introduction": {
      type: "AND",
      name: "Experiential Learning Introduction",
      requirements: [
        {
          type: "COURSE",
          classId: 2000,
          subject: "EESC",
        },
      ],
    },
    Capstone: {
      type: "AND",
      name: "Capstone",
      requirements: [
        {
          type: "OR",
          courses: [
            {
              type: "COURSE",
              classId: 4701,
              subject: "BIOL",
            },
            {
              type: "COURSE",
              classId: 4750,
              subject: "CHEM",
            },
          ],
        },
      ],
    },
    "Biology and Chemistry Advanced Electives": {
      type: "OR",
      name: "Biology and Chemistry Advanced Electives",
      numCreditsMin: 12,
      numCreditsMax: 12,
      requirements: [
        {
          type: "RANGE",
          creditsRequired: 12,
          ranges: [
            {
              subject: "BIOL",
              idRangeStart: 2311,
              idRangeEnd: 5999,
            },
            {
              subject: "CHEM",
              idRangeStart: 2310,
              idRangeEnd: 5999,
            },
          ],
        },
        {
          type: "OR",
          courses: [
            {
              type: "COURSE",
              classId: 4991,
              subject: "BIOC",
            },
            {
              type: "COURSE",
              classId: 4970,
              subject: "BIOC",
            },
            {
              type: "COURSE",
              classId: 4971,
              subject: "BIOC",
            },
            {
              type: "COURSE",
              classId: 4994,
              subject: "BIOC",
            },
            {
              type: "COURSE",
              classId: 4991,
              subject: "BIOL",
            },
            {
              type: "COURSE",
              classId: 4970,
              subject: "BIOL",
            },
            {
              type: "COURSE",
              classId: 4901,
              subject: "CHEM",
            },
            {
              type: "COURSE",
              classId: 4750,
              subject: "CHEM",
            },
            {
              type: "COURSE",
              classId: 4970,
              subject: "CHEM",
            },
          ],
        },
      ],
    },
    "Mathematics Courses": {
      type: "OR",
      name: "Mathematics Courses",
      numCreditsMin: 8,
      numCreditsMax: 8,
      requirements: [
        {
          type: "OR",
          courses: [
            {
              type: "AND",
              courses: [
                {
                  type: "COURSE",
                  classId: 1251,
                  subject: "MATH",
                },
                {
                  type: "COURSE",
                  classId: 1252,
                  subject: "MATH",
                },
              ],
            },
            {
              type: "AND",
              courses: [
                {
                  type: "COURSE",
                  classId: 1341,
                  subject: "MATH",
                },
                {
                  type: "COURSE",
                  classId: 1342,
                  subject: "MATH",
                },
              ],
            },
          ],
        },
      ],
    },
    "Physics 1": {
      type: "OR",
      name: "Physics 1",
      numCreditsMin: 5,
      numCreditsMax: 5,
      requirements: [
        {
          type: "OR",
          courses: [
            {
              type: "AND",
              courses: [
                {
                  type: "COURSE",
                  classId: 1171,
                  subject: "PHYS",
                },
                {
                  type: "COURSE",
                  classId: 1172,
                  subject: "PHYS",
                },
                {
                  type: "COURSE",
                  classId: 1173,
                  subject: "PHYS",
                },
              ],
            },
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
                  classId: 1161,
                  subject: "PHYS",
                },
                {
                  type: "COURSE",
                  classId: 1162,
                  subject: "PHYS",
                },
              ],
            },
          ],
        },
      ],
    },
    "Physics 2": {
      type: "OR",
      name: "Physics 2",
      numCreditsMin: 5,
      numCreditsMax: 5,
      requirements: [
        {
          type: "OR",
          courses: [
            {
              type: "AND",
              courses: [
                {
                  type: "COURSE",
                  classId: 1175,
                  subject: "PHYS",
                },
                {
                  type: "COURSE",
                  classId: 1176,
                  subject: "PHYS",
                },
                {
                  type: "COURSE",
                  classId: 1177,
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
              ],
            },
          ],
        },
      ],
    },
  },
};
