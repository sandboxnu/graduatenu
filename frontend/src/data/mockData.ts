import { Schedule, Season, Status, ScheduleCourse } from "../models/types";

const mockClass = (num: number): ScheduleCourse => ({
  classId: 3500,
  subject: "CS",
  numCreditsMin: 4,
  numCreditsMax: 4,
  dndId: "class-" + num,
});

export const mockData: Schedule = {
  years: [1, 2],
  yearMap: {
    1: {
      year: 1,
      isSummerFull: false,
      fall: {
        season: Season.FL,
        year: 1,
        termId: 1,
        id: "fall 1",
        status: Status.CLASSES,
        classes: [mockClass(1), mockClass(2), mockClass(3), mockClass(4)],
      },
      spring: {
        season: Season.SP,
        year: 1,
        termId: 2,
        id: "spring 1",
        status: Status.CLASSES,
        classes: [mockClass(5), mockClass(6), mockClass(7), mockClass(8)],
      },
      summer1: {
        season: Season.S1,
        year: 1,
        termId: 3,
        id: "summer1 1",
        status: Status.CLASSES,
        classes: [mockClass(9), mockClass(10)],
      },
      summer2: {
        season: Season.S2,
        year: 1,
        termId: 4,
        id: "summer2 1",
        status: Status.CLASSES,
        classes: [],
      },
    },
    2: {
      year: 2,
      isSummerFull: false,
      fall: {
        season: Season.FL,
        year: 2,
        termId: 5,
        id: "fall 2",
        status: Status.CLASSES,
        classes: [mockClass(11), mockClass(12), mockClass(13), mockClass(14)],
      },
      spring: {
        season: Season.SP,
        year: 2,
        termId: 6,
        id: "spring 2",
        status: Status.CLASSES,
        classes: [mockClass(15), mockClass(16), mockClass(17), mockClass(18)],
      },
      summer1: {
        season: Season.S1,
        year: 2,
        termId: 5,
        id: "summer1 2",
        status: Status.CLASSES,
        classes: [mockClass(19), mockClass(20)],
      },
      summer2: {
        season: Season.S2,
        year: 2,
        termId: 5,
        id: "summer2 2",
        status: Status.CLASSES,
        classes: [],
      },
    },
  },
  id: "example-schedule",
};
