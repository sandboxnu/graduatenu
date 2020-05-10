import { Major } from "../models/types";

export const mathMajor: Major = {
  name: "Mathematics, BS",
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
    "Problem Solving",
    "Calculus",
    "Intermediate and Advanced Mathematics",
    "Co-op Reflections",
    "Physics 1",
    "Physics 2",
    "Capstone",
  ],
  requirementGroupMap: {
    "Problem Solving": {
      type: "AND",
      name: "Problem Solving",
      requirements: [
        {
          type: "COURSE",
          classId: 1365,
          subject: "MATH",
        },
      ],
    },
    Calculus: {
      type: "AND",
      name: "Calculus",
      requirements: [
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
        {
          type: "COURSE",
          classId: 2321,
          subject: "MATH",
        },
      ],
    },
    "Intermediate and Advanced Mathematics": {
      type: "AND",
      name: "Intermediate and Advanced Mathematics",
      requirements: [
        {
          type: "COURSE",
          classId: 2331,
          subject: "MATH",
        },
        {
          type: "COURSE",
          classId: 2341,
          subject: "MATH",
        },
        {
          type: "COURSE",
          classId: 3081,
          subject: "MATH",
        },
        {
          type: "COURSE",
          classId: 3150,
          subject: "MATH",
        },
        {
          type: "COURSE",
          classId: 3175,
          subject: "MATH",
        },
      ],
    },
    "Co-op Reflections": {
      type: "AND",
      name: "Co-op Reflections",
      requirements: [
        {
          type: "COURSE",
          classId: 3000,
          subject: "MATH",
        },
      ],
    },
    "Mathematics Electives": {
      type: "RANGE",
      name: "Mathematics Electives",
      numCreditsMin: 16,
      numCreditsMax: 16,
      requirements: {
        type: "RANGE",
        creditsRequired: 16,
        ranges: [
          {
            subject: "MATH",
            idRangeStart: 3101,
            idRangeEnd: 4899,
          },
        ],
      },
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
      ],
    },
    Capstone: {
      type: "OR",
      name: "Capstone",
      numCreditsMin: 4,
      numCreditsMax: 4,
      requirements: [
        {
          type: "OR",
          courses: [
            {
              type: "COURSE",
              classId: 4025,
              subject: "MATH",
            },
            {
              type: "COURSE",
              classId: 5131,
              subject: "MATH",
            },
            {
              type: "COURSE",
              classId: 4020,
              subject: "MATH",
            },
          ],
        },
      ],
    },
  },
};
