import { createAction } from "typesafe-actions";
import {
  TransferableExam,
  IRequiredCourse,
  ScheduleCourse,
} from "../../../../common/types";
import { IUserData } from "../../models/types";

export const setUserAction = createAction(
  "user/SET_USER",
  (user: IUserData) => ({
    user,
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

export const setUserMajorAction = createAction(
  "user/SET_USER_MAJOR",
  (major: string) => ({
    major,
  })
)();

export const setUserCoopCycleAction = createAction(
  "user/SET_COOP_CYCLE",
  (coopCycle: string) => ({
    coopCycle,
  })
)();

export const setExamCreditsAction = createAction(
  "user/SET_EXAM_CREDITS",
  (examCredits: TransferableExam[]) => ({ examCredits })
)();

export const resetUserAction = createAction("user/RESET_USER", () => void 0)();

export const addTransferClassAction = createAction(
  "user/ADD_TRANSFER",
  (courses: ScheduleCourse[]) => ({
    courses,
  })
)();

export const removeTransferClassAction = createAction(
  "user/REMOVE_TRANSFER_CLASS",
  (course: ScheduleCourse) => ({
    course,
  })
)();

export const setCompletedCoursesAction = createAction(
  "user/SET_COMPLETED_COURSES",
  (completedCourses: ScheduleCourse[]) => ({ completedCourses })
)();

export const setCompletedRequirementsAction = createAction(
  "user/SET_COMPLETED_REQUIREMENTS",
  (completedRequirements: IRequiredCourse[]) => ({ completedRequirements })
)();

export const setTransferCoursesAction = createAction(
  "user/SET_TRANSFER_COURSES",
  (transferCourses: ScheduleCourse[]) => ({ transferCourses })
)();
