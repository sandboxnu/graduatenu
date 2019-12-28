import { createAction } from "typesafe-actions";
import {
  ScheduleCourse,
  DNDScheduleCourse,
  DNDScheduleTerm,
  Status,
  SeasonWord,
  Schedule,
  DNDSchedule,
} from "../../models/types";
import { ICompletedCoursesMap } from "../reducers/scheduleReducer";

export const addClassesAction = createAction(
  "schedule/ADD_CLASSES",
  (courses: ScheduleCourse[], semester: DNDScheduleTerm) => ({
    courses,
    semester,
  })
)();

export const removeClassAction = createAction(
  "schedule/REMOVE_CLASS",
  (course: DNDScheduleCourse, semester: DNDScheduleTerm) => ({
    course,
    semester,
  })
)();

export const changeSemesterStatusAction = createAction(
  "schedule/CHANGE_STATUS",
  (newStatus: Status, year: number, season: SeasonWord) => ({
    newStatus,
    year,
    season,
  })
)();

export const updateSemesterAction = createAction(
  "schedule/UPDATE_SEMESTER",
  (year: number, season: SeasonWord, newSemester: DNDScheduleTerm) => ({
    year,
    season,
    newSemester,
  })
)();

export const setScheduleAction = createAction(
  "schedule/SET_SCHEDULE",
  (schedule: Schedule) => ({ schedule })
)();

export const setDNDScheduleAction = createAction(
  "schedule/SET_DND_SCHEDULE",
  (schedule: DNDSchedule) => ({ schedule })
)();

export const addCompletedCourses = createAction(
  "schedule/ADD_COMPLETED_COURSES",
  (completedCourses: ScheduleCourse[]) => ({ completedCourses })
)();

export const setCompletedCourses = createAction(
  "schedule/SET_COMPLETED_COURSES",
  (completedCourses: ScheduleCourse[]) => ({ completedCourses })
)();

export const setCompletedCoursesFromMap = createAction(
  "schedule/SET_COMPLETED_COURSES_FROM_MAP",
  (completedCourses: ICompletedCoursesMap) => ({ completedCourses })
)();

export const removeCompletedCoursesAction = createAction(
  "schedule/REMOVE_COMPLETED_COURSES",
  (completedCourse: DNDScheduleCourse) => ({ completedCourse })
)();
