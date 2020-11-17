import { createAction } from "typesafe-actions";
import { TransferableExam, Major } from "../../../../common/types";

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

export const setUserCatalogYearAction = createAction(
  "user/SET_CATALOG",
  (catalogYear?: number) => ({
    catalogYear,
  })
)();
export const setUserIdAction = createAction(
  "user/SET_USER_ID",
  (id: number) => ({
    id,
  })
)();

export const addPlanIdAction = createAction(
  "user/ADD_PLAN_ID",
  (planId: number) => ({
    planId,
  })
)();

export const setPlanNameAction = createAction(
  "user/SET_PLAN_NAME",
  (name: string) => ({
    name,
  })
)();

export const setLinkSharingAction = createAction(
  "user/SET_LINK_SHARING",
  (linkSharing: boolean) => ({
    linkSharing,
  })
)();

export const setMajorPlanAction = createAction(
  "user/SET_MAJOR_PLAN",
  (major: Major | undefined, planStr: string) => ({
    major,
    planStr,
  })
)();

export const setPlanIdsAction = createAction(
  "user/SET_PLAN_IDS",
  (planIds: number[]) => ({
    planIds,
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

export const deletePlanId = createAction(
  "user/DELETE_PLAN_ID",
  (planId: number) => ({
    planId,
  })
)();

export const setExamCredits = createAction(
  "user/SET_EXAM_CREDITS",
  (examCredits: TransferableExam[]) => ({ examCredits })
)();

export const resetUserAction = createAction("user/RESET_USER", () => void 0)();
