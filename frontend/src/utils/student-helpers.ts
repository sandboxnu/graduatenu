import { IUserData } from "../models/types";

export function getInitialsFromName(fullName: string) {
  const names = fullName.split(" ");
  if (names.length >= 2) {
    return names[0][0] + names[1][0];
  } else if (names.length === 1) {
    return names[0][0];
  } else {
    return "";
  }
}

// TODO: get rid of id, email, and full name after aryan's PR gets merged
export function createInitialStudent({
  fullName,
  graduationYear,
  catalogYear,
  major,
  concentration,
  coopCycle,
}: {
  fullName: string;
  graduationYear: number | null;
  catalogYear: number | null;
  major: string | null;
  concentration: string | null;
  coopCycle: string | null;
}): IUserData {
  const student: IUserData = {
    id: 0,
    email: "",
    fullName,
    academicYear: null,
    graduationYear,
    catalogYear,
    major,
    concentration,
    coopCycle,
    examCredits: [],
    transferCourses: [],
    completedCourses: [],
  };

  return student;
}
