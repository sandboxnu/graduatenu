import { createAction } from "typesafe-actions";
import {
  TransferableExam,
  IRequiredCourse,
  ScheduleCourse,
} from "../../../../common/types";
import { IUserData } from "../../models/types";

export const setStudentAction = createAction(
  "student/SET_USER",
  (student?: IUserData) => ({
    student,
  })
)();

export const setStudentIdAction = createAction(
  "student/SET_ID",
  (id: number) => ({
    id,
  })
)();

export const addPlanIdAction = createAction(
  "student/ADD_PLAN_ID",
  (planId: number) => ({
    planId,
  })
)();

export const setPlanNameAction = createAction(
  "student/SET_PLAN_NAME",
  (planName: string) => ({
    planName,
  })
)();

export const setLinkSharingAction = createAction(
  "student/SET_LINK_SHARING",
  (linkSharing: boolean) => ({
    linkSharing,
  })
)();

export const setStudentFullNameAction = createAction(
  "student/SET_FULL_NAME",
  (fullName: string) => ({
    fullName,
  })
)();

export const setStudentEmailAction = createAction(
  "student/SET_EMAIL",
  (email: string) => ({
    email,
  })
)();

export const setStudentAcademicYearAction = createAction(
  "student/SET_ACADEMIC_YEAR",
  (academicYear: number) => ({
    academicYear,
  })
)();

export const setStudentGraduationYearAction = createAction(
  "student/SET_GRADUATION_YEAR",
  (graduationYear: number) => ({
    graduationYear,
  })
)();

export const setStudentMajorAction = createAction(
  "student/SET_USER_MAJOR",
  (major: string | null) => ({
    major,
  })
)();

export const setStudentConcentrationAction = createAction(
  "student/SET_CONCENTRATION",
  (concentration: string | null) => ({
    concentration,
  })
)();

export const setStudentCoopCycleAction = createAction(
  "student/SET_COOP_CYCLE",
  (coopCycle: string | null) => ({
    coopCycle,
  })
)();

export const setStudentCatalogYearAction = createAction(
  "student/SET_CATALOG",
  (catalogYear: number | null) => ({
    catalogYear,
  })
)();

export const setStudentExamCreditsAction = createAction(
  "student/SET_EXAM_CREDITS",
  (examCredits: TransferableExam[]) => ({ examCredits })
)();

export const resetStudentAction = createAction("student/RESET", () => void 0)();

export const addTransferClassAction = createAction(
  "student/ADD_TRANSFER",
  (courses: ScheduleCourse[]) => ({
    courses,
  })
)();

export const removeTransferClassAction = createAction(
  "student/REMOVE_TRANSFER_CLASS",
  (course: ScheduleCourse) => ({
    course,
  })
)();

export const setCompletedCoursesAction = createAction(
  "student/SET_COMPLETED_COURSES",
  (completedCourses: ScheduleCourse[]) => ({ completedCourses })
)();

export const setCompletedRequirementsAction = createAction(
  "student/SET_COMPLETED_REQUIREMENTS",
  (completedRequirements: IRequiredCourse[]) => ({ completedRequirements })
)();

export const setTransferCoursesAction = createAction(
  "student/SET_TRANSFER_COURSES",
  (transferCourses: ScheduleCourse[]) => ({ transferCourses })
)();
