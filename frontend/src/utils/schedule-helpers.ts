import {
  DNDSchedule,
  DNDScheduleCourse,
  Schedule,
  ScheduleCourse,
  DNDScheduleTerm,
} from "../models/types";
import { HomeState } from "../home/Home";

export function convertTermIdToSeason(termId: number): string {
  const seasonId = termId % 100;

  if (seasonId === 10) {
    return "fall";
  }
  if (seasonId === 30) {
    return "spring";
  }
  if (seasonId === 40) {
    return "summer1";
  }
  return "summer2";
}

export function convertTermIdToYear(termId: number): number {
  return Math.trunc(termId / 100);
}

export function sumCreditsInSemester(
  schedule: DNDSchedule,
  year: number,
  season: string
): number {
  return (schedule.yearMap[year] as any)[season].classes.reduce(
    (acc: number, curr: DNDScheduleCourse) => acc + curr.numCreditsMax,
    0
  );
}

export function getNumCoops(schedule: Schedule): number {
  var num = 0;
  for (const year of schedule.years) {
    const yearSch = schedule.yearMap[year];
    if (yearSch.fall.status === "COOP" || yearSch.spring.status === "COOP") {
      num++;
      continue;
    }
  }
  return num;
}

export function isSpringCycle(schedule: Schedule): boolean {
  for (const year of schedule.years) {
    const yearSch = schedule.yearMap[year];
    if (yearSch.fall.status === "COOP") {
      return false;
    }
    if (yearSch.spring.status === "COOP") {
      return true;
    }
  }

  // should never happen
  return false;
}

export const convertToDNDSchedule = async (
  schedule: Schedule,
  counter: number
): Promise<[DNDSchedule, number]> => {
  const newSchedule = schedule as DNDSchedule;
  for (const year of Object.keys(schedule.yearMap)) {
    var result = await convertToDNDCourses(
      newSchedule.yearMap[year as any].fall.classes as ScheduleCourse[],
      counter
    );
    newSchedule.yearMap[year as any].fall.classes = result[0];
    counter = result[1];

    result = await convertToDNDCourses(
      newSchedule.yearMap[year as any].spring.classes as ScheduleCourse[],
      counter
    );
    newSchedule.yearMap[year as any].spring.classes = result[0];
    counter = result[1];

    result = await convertToDNDCourses(
      newSchedule.yearMap[year as any].summer1.classes as ScheduleCourse[],
      counter
    );
    newSchedule.yearMap[year as any].summer1.classes = result[0];
    counter = result[1];

    result = await convertToDNDCourses(
      newSchedule.yearMap[year as any].summer2.classes as ScheduleCourse[],
      counter
    );
    newSchedule.yearMap[year as any].summer2.classes = result[0];
    counter = result[1];
  }
  return [newSchedule, counter];
};

export const convertToDNDCourses = async (
  courses: ScheduleCourse[],
  counter: number
): Promise<[DNDScheduleCourse[], number]> => {
  var list: DNDScheduleCourse[] = [];
  for (const course of courses) {
    counter++;
    list.push({
      ...course,
      dndId: String(counter),
    });
  }
  return [list, counter];
};

export function isCoopOrVacation(currSemester: DNDScheduleTerm): boolean {
  return currSemester.status.includes("HOVER");
}

export function addClassToSchedule(
  state: HomeState,
  year: number,
  season: string,
  counter: number,
  dndCourses: DNDScheduleCourse[]
): HomeState {
  const newState = {
    ...state,
    currentClassCounter: counter,
    schedule: {
      ...state.schedule,
      yearMap: {
        ...state.schedule.yearMap,
        [year]: {
          ...state.schedule.yearMap[year],
          [season]: {
            ...(state.schedule.yearMap[year] as any)[season],
            classes: [
              ...(state.schedule.yearMap[year] as any)[season].classes,
              ...dndCourses,
            ],
          },
        },
      },
    },
  };
  return newState;
}
