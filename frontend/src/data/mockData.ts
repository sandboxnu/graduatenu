import {
  DNDSchedule,
  Season,
  Status,
  DNDScheduleCourse,
} from "../models/types";

const mockClass = (num: number): DNDScheduleCourse => ({
  classId: 3500,
  subject: "CS",
  numCreditsMin: 4,
  numCreditsMax: 4,
  dndId: "class-" + num,
});

export const mockData: DNDSchedule = {
  years: [2019, 2020],
  yearMap: {
    2019: {
      year: 2019,
      isSummerFull: false,
      fall: {
        season: Season.FL,
        year: 2019,
        termId: 201910,
        id: 1,
        status: Status.CLASSES,
        classes: [mockClass(1), mockClass(2), mockClass(3), mockClass(4)],
      },
      spring: {
        season: Season.SP,
        year: 2019,
        termId: 201930,
        id: 2,
        status: Status.CLASSES,
        classes: [mockClass(5), mockClass(6), mockClass(7), mockClass(8)],
      },
      summer1: {
        season: Season.S1,
        year: 2019,
        termId: 201940,
        id: 3,
        status: Status.CLASSES,
        classes: [mockClass(9), mockClass(10)],
      },
      summer2: {
        season: Season.S2,
        year: 2019,
        termId: 201960,
        id: 4,
        status: Status.CLASSES,
        classes: [],
      },
    },
    2020: {
      year: 2020,
      isSummerFull: false,
      fall: {
        season: Season.FL,
        year: 2020,
        termId: 202010,
        id: 5,
        status: Status.CLASSES,
        classes: [mockClass(11), mockClass(12), mockClass(13), mockClass(14)],
      },
      spring: {
        season: Season.SP,
        year: 2020,
        termId: 202030,
        id: 6,
        status: Status.CLASSES,
        classes: [mockClass(15), mockClass(16), mockClass(17), mockClass(18)],
      },
      summer1: {
        season: Season.S1,
        year: 2020,
        termId: 202040,
        id: 7,
        status: Status.CLASSES,
        classes: [mockClass(19), mockClass(20)],
      },
      summer2: {
        season: Season.S2,
        year: 2020,
        termId: 202060,
        id: 8,
        status: Status.CLASSES,
        classes: [],
      },
    },
  },
  id: "example-schedule",
};
