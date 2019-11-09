import {
  Schedule,
  ScheduleTerm,
  DNDSchedule,
  DNDScheduleCourse,
} from "../models/types";

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
