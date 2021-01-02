import { createAction } from "typesafe-actions";
import {
  TransferableExam,
  IRequiredCourse,
  ScheduleCourse,
} from "../../../../common/types";
import { IUserData } from "../../models/types";

export const setStudentAction = createAction(
  "student/SET_USER",
  (student: IUserData) => ({
    student,
  })
)();

export const setAcademicYearAction = createAction(
  "student/SET_ACADEMIC_YEAR",
  (academicYear: number) => ({
    academicYear,
  })
)();

export const setGraduationYearAction = createAction(
  "student/SET_GRADUATION_YEAR",
  (graduationYear: number) => ({
    graduationYear,
  })
)();

export const setUserMajorAction = createAction(
  "student/SET_USER_MAJOR",
  (major: string | null) => ({
    major,
  })
)();

export const setUserCoopCycleAction = createAction(
  "student/SET_COOP_CYCLE",
  (coopCycle: string | null) => ({
    coopCycle,
  })
)();

export const setUserCatalogYearAction = createAction(
  "student/SET_CATALOG",
  (catalogYear: number | null) => ({
    catalogYear,
  })
)();

export const setExamCreditsAction = createAction(
  "student/SET_EXAM_CREDITS",
  (examCredits: TransferableExam[]) => ({ examCredits })
)();

export const resetUserAction = createAction(
  "student/RESET_USER",
  () => void 0
)();

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
