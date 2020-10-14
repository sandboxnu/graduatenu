import { TransferableExamGroup, TransferableExamType } from "./types";

export const IBExamGroups2020To2021: Array<TransferableExamGroup> = [
  {
    name: "Sciences",
    transferableExams: [
      {
        name: "Biology",
        type: TransferableExamType.IB,
        mappableCourses: [
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
        semesterHours: 10,
      },
      {
        name: "Chemistry",
        type: TransferableExamType.IB,
        mappableCourses: [
          {
            type: "COURSE",
            classId: 1161,
            subject: "CHEM",
          },
          {
            type: "COURSE",
            classId: 1162,
            subject: "CHEM",
          },
        ],
        semesterHours: 5,
      },
      {
        name: "Physics",
        type: TransferableExamType.IB,
        mappableCourses: [
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
            classId: 1165,
            subject: "PHYS",
          },
          {
            type: "COURSE",
            classId: 1166,
            subject: "PHYS",
          },
        ],
        semesterHours: 10,
      },
    ],
  },
  {
    name: "Individuals and Societies",
    transferableExams: [
      {
        name: "Business Management",
        type: TransferableExamType.IB,
        mappableCourses: [
          {
            type: "COURSE",
            classId: 1990,
            subject: "BUSN",
          },
        ],
        semesterHours: 4,
      },
      {
        name: "Economics",
        type: TransferableExamType.IB,
        mappableCourses: [
          {
            type: "COURSE",
            classId: 1115,
            subject: "ECON",
          },
          {
            type: "COURSE",
            classId: 1116,
            subject: "ECON",
          },
        ],
        semesterHours: 8,
      },
      {
        name: "Global Politics",
        type: TransferableExamType.IB,
        mappableCourses: [
          {
            type: "COURSE",
            classId: 1160,
            subject: "POLS",
          },
        ],
        semesterHours: 4,
      },
      {
        name: "History of Africa and the Middle East",
        type: TransferableExamType.IB,
        mappableCourses: [
          {
            type: "COURSE",
            classId: 1990,
            subject: "HIST",
          },
        ],
        semesterHours: 4,
      },
      {
        name: "History of Asia and Oceania",
        type: TransferableExamType.IB,
        mappableCourses: [
          {
            type: "COURSE",
            classId: 1150,
            subject: "HIST",
          },
        ],
        semesterHours: 4,
      },
      {
        name: "History of Europe",
        type: TransferableExamType.IB,
        mappableCourses: [
          {
            type: "COURSE",
            classId: 1170,
            subject: "HIST",
          },
        ],
        semesterHours: 4,
      },
      {
        name: "History of the Americas",
        type: TransferableExamType.IB,
        mappableCourses: [
          {
            type: "COURSE",
            classId: 1130,
            subject: "HIST",
          },
        ],
        semesterHours: 4,
      },
      {
        name: "Philosophy",
        type: TransferableExamType.IB,
        mappableCourses: [
          {
            type: "COURSE",
            classId: 1101,
            subject: "PHIL",
          },
        ],
        semesterHours: 4,
      },
      {
        name: "Psychology",
        type: TransferableExamType.IB,
        mappableCourses: [
          {
            type: "COURSE",
            classId: 1101,
            subject: "PSYC",
          },
        ],
        semesterHours: 4,
      },
      {
        name: "Social and Cultural Anthropology",
        type: TransferableExamType.IB,
        mappableCourses: [
          {
            type: "COURSE",
            classId: 1101,
            subject: "ANTH",
          },
        ],
        semesterHours: 4,
      },
    ],
  },
  {
    name: "The Arts",
    transferableExams: [
      {
        name: "Design Technology",
        type: TransferableExamType.IB,
        mappableCourses: [
          {
            type: "COURSE",
            classId: 1990,
            subject: "ARTS",
          },
        ],
        semesterHours: 4,
      },
      {
        name: "Film",
        type: TransferableExamType.IB,
        mappableCourses: [
          {
            type: "COURSE",
            classId: 1990,
            subject: "MSCR",
          },
        ],
        semesterHours: 4,
      },
      {
        name: "Music",
        type: TransferableExamType.IB,
        mappableCourses: [
          {
            type: "COURSE",
            classId: 1990,
            subject: "MUSC",
          },
        ],
        semesterHours: 4,
      },
      {
        name: "Theatre",
        type: TransferableExamType.IB,
        mappableCourses: [
          {
            type: "COURSE",
            classId: 1101,
            subject: "THTR",
          },
        ],
        semesterHours: 4,
      },
      {
        name: "Visual Arts",
        type: TransferableExamType.IB,
        mappableCourses: [
          {
            type: "COURSE",
            classId: 1990,
            subject: "ARTF",
          },
        ],
        semesterHours: 4,
      },
    ],
  },
  {
    name: "Studies in Language and Literature",
    transferableExams: [
      {
        name: "English A: Language and Literature",
        type: TransferableExamType.IB,
        mappableCourses: [
          {
            type: "COURSE",
            classId: 1111,
            subject: "ENGW",
          },
        ],
        semesterHours: 4,
      },
      {
        name: "English A: Literature",
        type: TransferableExamType.IB,
        mappableCourses: [
          {
            type: "COURSE",
            classId: 1111,
            subject: "ENGW",
          },
          {
            type: "COURSE",
            classId: 1990,
            subject: "ENGL",
          },
        ],
        semesterHours: 8,
      },
    ],
  },
  {
    name: "Mathematics",
    transferableExams: [
      {
        name: "Further Mathematics",
        type: TransferableExamType.IB,
        mappableCourses: [
          {
            type: "COURSE",
            classId: 2280,
            subject: "MATH",
          },
          {
            type: "COURSE",
            classId: 2310,
            subject: "MATH",
          },
        ],
        semesterHours: 8,
      },
      {
        name: "Mathematics",
        type: TransferableExamType.IB,
        mappableCourses: [
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
        semesterHours: 8,
      },
    ],
  },
];
