import { createAction } from "typesafe-actions";
import { Major } from "../../../../common/types";

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

export const setDeclaredMajorAction = createAction(
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

export const setIdAction = createAction(
  "user/SET_ID",
  (id: number) => ({
    id,
  })
)();

export const setEmailAction = createAction(
  "user/SET_EMAIL",
  (email: string) => ({
    email,
  })
)();

export const setUserCoopCycleAction = createAction(
  "user/SET_COOP_CYCLE",
  (coopCycle: string) => ({
    coopCycle,
  })
)();