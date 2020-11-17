import { createAction } from "typesafe-actions";
import {
  DNDScheduleCourse,
  DNDScheduleTerm,
  DNDSchedule,
  NamedSchedule,
} from "../../models/types";
import {
  ScheduleCourse,
  Status,
  SeasonWord,
  Schedule,
  Major,
  IRequiredCourse,
} from "../../../../common/types";

export const addClassesAction = createAction(
  "schedule/ADD_CLASSES",
  (courses: ScheduleCourse[], semester: DNDScheduleTerm) => ({
    courses,
    semester,
  })
)();

export const addTransferClassAction = createAction(
  "schedule/ADD_TRANSFER",
  (courses: ScheduleCourse[]) => ({
    courses,
  })
)();

export const removeClassAction = createAction(
  "schedule/REMOVE_CLASS",
  (course: DNDScheduleCourse, semester: DNDScheduleTerm) => ({
    course,
    semester,
  })
)();

export const undoRemoveClassAction = createAction(
  "schedule/UNDO_REMOVE_CLASS",
  () => void 0
)();

export const removeTransferClassAction = createAction(
  "schedule/REMOVE_TRANSFER_CLASS",
  (course: ScheduleCourse) => ({
    course,
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

export const setScheduleMajor = createAction(
  "schedule.SET_SCHEDULE_MAJOR",
  (major?: Major) => ({ major })
)();

export const setScheduleMajorCoop = createAction(
  "schedule.SET_SCHEDULE_MAJOR_COOP",
  (major: string, coop: string) => ({ major, coop })
)();

export const setCatalogYearAction = createAction(
  "schedule/SET_CATALOG_YEAR",
  (catalogYear?: number) => ({ catalogYear })
)();

export const setCoopCycle = createAction(
  "schedule/SET_COOP_CYCLE",
  (coopCycle: string, schedule?: Schedule) => ({ coopCycle, schedule })
)();

export const setDNDScheduleAction = createAction(
  "schedule/SET_DND_SCHEDULE",
  (schedule: DNDSchedule) => ({ schedule })
)();

export const setCompletedCourses = createAction(
  "schedule/SET_COMPLETED_COURSES",
  (completedCourses: ScheduleCourse[]) => ({ completedCourses })
)();

export const setCompletedRequirements = createAction(
  "schedule/SET_COMPLETED_REQUIREMENTS",
  (completedRequirements: IRequiredCourse[]) => ({ completedRequirements })
)();

export const setTransferCourses = createAction(
  "schedule/SET_TRANSFER_COURSES",
  (transferCourses: ScheduleCourse[]) => ({ transferCourses })
)();

export const setNamedSchedule = createAction(
  "schedule/SET_NAMED_SCHEDULE",
  (namedSchedule: NamedSchedule) => ({ namedSchedule })
)();

export const toggleYearExpanded = createAction(
  "schedule/TOGGLE_YEAR_EXPANDED",
  (index: number) => ({ index })
)();

export const setClosedYearsToYearsInThePast = createAction(
  "schedule/SET_CLOSED_YEARS_TO_YEARS_IN_THE_PAST",
  (academicYear: number) => ({ academicYear })
)();

export const setCurrentClassCounter = createAction(
  "schedule/SET_CURRENT_CLASS_COUNTER",
  (currentClassCounter: number) => ({ currentClassCounter })
)();

export const incrementCurrentClassCounter = createAction(
  "schedule/INCREMENT_CURRENT_CLASS_COUNTER",
  () => void 0
)();
