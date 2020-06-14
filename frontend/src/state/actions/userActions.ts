import { createAction } from "typesafe-actions";
import { Major } from "graduate-common";

export const setFullNameAction = createAction(
  "user/SET_FULL_NAME",
  (fullName: string) => ({
    fullName,
  })
)();

export const setAcademicYearAction = createAction(
  "user/SET_ACADEMIC_YEAR",
  (academicYear: number) => ({
    academicYear,
  })
)();

export const setGraduationYearAction = createAction(
  "user/SET_GRADUATION_YEAR",
  (graduationYear: number) => ({
    graduationYear,
  })
)();

export const setMajorAction = createAction(
  "user/SET_MAJOR",
  (major?: Major) => ({
    major,
  })
)();

export const setTokenAction = createAction(
  "user/SET_TOKEN",
  (token: string) => ({
    token,
  })
)();
