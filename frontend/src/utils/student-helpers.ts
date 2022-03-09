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
export function createInitialStudent(id: number, email: string): IUserData {
  const student: IUserData = {
    id,
    email,
    fullName: "",
    academicYear: null,
    graduationYear: null,
    catalogYear: null,
    isAdvisor: false,
    major: null,
    concentration: null,
    coopCycle: null,
    examCredits: [],
    transferCourses: [],
    completedCourses: [],
  };

  return student;
}
