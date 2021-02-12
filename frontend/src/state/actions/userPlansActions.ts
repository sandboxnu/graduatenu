import { create } from "lodash";
import { createAction } from "typesafe-actions";
import {
  Schedule,
  ScheduleCourse,
  SeasonWord,
  Status,
} from "../../../../common/types";
import {
  DNDSchedule,
  DNDScheduleCourse,
  DNDScheduleTerm,
  IPlanData,
  ITemplatePlan,
} from "../../models/types";
import { ActivePlanAutoSaveStatus } from "../reducers/userPlansReducer";

export const setActivePlanAction = createAction(
  "userPlans/SET_ACTIVE_PLAN",
  (activePlan: string, userId: number, academicYear: number) => ({
    activePlan,
    userId,
    academicYear,
  })
)();

export const addNewPlanAction = createAction(
  "userPlans/ADD_NEW_PLAN",
  (plan: IPlanData | ITemplatePlan, academicYear?: number) => ({
    plan,
    academicYear,
  })
)();

export const setUserPlansAction = createAction(
  "userPlans/SET_USER_PLANS",
  (plans: IPlanData[], academicYear: number) => ({ plans, academicYear })
)();

export const updateActivePlanAction = createAction(
  "userPlans/UPDATE_ACTIVE_PLAN",
  (plan: Partial<IPlanData>) => ({ plan })
)();

export const updateActivePlanTimestampAction = createAction(
  "userPlans/UPDATE_ACTIVE_PLAN_TIMESTAMP",
  (timestamp: Date) => ({ timestamp })
)();

export const deletePlan = createAction(
  "userPlans/DELETE_PLAN",
  (name: string) => ({ name })
)();

// TODO: remove this and do the DND conversion in setActivePlanScheduleAction (if possible)
export const setActivePlanDNDScheduleAction = createAction(
  "userPlans/SET_ACTIVE_PLAN_DND_SCHEDULE",
  (schedule: DNDSchedule, transferCourses: ScheduleCourse[]) => ({
    schedule,
    transferCourses,
  })
)();

export const setActivePlanMajorAction = createAction(
  "userPlans/SET_ACTIVE_PLAN_MAJOR",
  (major: string | null) => ({ major })
)();

export const setActivePlanConcentrationAction = createAction(
  "userPlans/SET_ACTIVE_PLAN_CONCENTRATION",
  (concentration: string | null) => ({ concentration })
)();

export const setActivePlanCoopCycleAction = createAction(
  "userPlans/SET_ACTIVE_PLAN_COOP_CYCLE",
  (
    coopCycle: string | null,
    academicYear: number,
    graduationYear: number,
    allPlans?: Record<string, Schedule[]>
  ) => ({
    coopCycle,
    academicYear,
    graduationYear,
    allPlans,
  })
)();

export const setActivePlanCatalogYearAction = createAction(
  "schedule/SET_ACTIVE_PLAN_CATALOG_YEAR",
  (catalogYear: number | null, allPlans?: Record<string, Schedule[]>) => ({
    catalogYear,
    allPlans,
  })
)();

export const setActivePlanScheduleAction = createAction(
  "userPlans/SET_ACTIVE_PLAN_SCHEDULE",
  (schedule: Schedule, transferCourses: ScheduleCourse[]) => ({
    schedule,
    transferCourses,
  })
)();

export const addCoursesToActivePlanAction = createAction(
  "userPlans/ADD_COURSES_TO_ACTIVE_PLAN",
  (
    courses: ScheduleCourse[],
    semester: DNDScheduleTerm,
    transferCourses: ScheduleCourse[]
  ) => ({
    courses,
    semester,
    transferCourses,
  })
)();

export const removeClassFromActivePlanAction = createAction(
  "userPlans/REMOVE_CLASS_FROM_ACTIVE_PLAN",
  (
    course: DNDScheduleCourse,
    semester: DNDScheduleTerm,
    transferCourses: ScheduleCourse[]
  ) => ({
    course,
    semester,
    transferCourses,
  })
)();

export const undoRemoveClassFromActivePlanAction = createAction(
  "userPlans/UNDO_REMOVE_CLASS_FROM_ACTIVE_PLAN",
  () => void 0
)();

export const changeSemesterStatusForActivePlanAction = createAction(
  "userPlans/CHANGE_SEMESTER_STATUS_FOR_ACTIVE_PLAN",
  (
    newStatus: Status,
    year: number,
    season: SeasonWord,
    transferCourses: ScheduleCourse[]
  ) => ({
    newStatus,
    year,
    season,
    transferCourses,
  })
)();

export const updateSemesterForActivePlanAction = createAction(
  "userPlans/UPDATE_SEMESTER_FOR_ACTIVE_PLAN",
  (
    year: number,
    season: SeasonWord,
    newSemester: DNDScheduleTerm,
    transferCourses: ScheduleCourse[]
  ) => ({
    year,
    season,
    newSemester,
    transferCourses,
  })
)();

export const setCurrentClassCounterForActivePlanAction = createAction(
  "userPlans/SET_CURRENT_CLASS_COUNTER_FOR_ACTIVE_PLAN",
  (currentClassCounter: number) => ({ currentClassCounter })
)();

export const incrementCurrentClassCounterForActivePlanAction = createAction(
  "userPlans/INCREMENT_CURRENT_CLASS_COUNTER_FOR_ACTIVE_PLAN",
  () => void 0
)();

export const toggleYearExpandedForActivePlanAction = createAction(
  "userPlans/TOGGLE_YEAR_EXPANDED_FOR_ACTIVE_PLAN",
  (index: number) => ({ index })
)();

export const expandAllYearsForActivePlanAction = createAction(
  "userPlans/EXPAND_ALL_YEARS_FOR_ACTIVE_PLAN",
  () => void 0
)();

export const setActivePlanStatusAction = createAction(
  "userPlans/SET_ACTIVE_PLAN_STATUS",
  (status: ActivePlanAutoSaveStatus) => ({ status })
)();
