import { AppState } from "./reducers/state";
import {
  DNDSchedule,
  CourseWarning,
  IWarning,
  DNDScheduleTerm,
  NamedSchedule,
  ScheduleSlice,
} from "../models/types";
import {
  Major,
  Schedule,
  IRequiredCourse,
  ScheduleCourse,
} from "../../../common/types";

/**
 * Utility functions to help extract data from the AppState
 */

/**
 * Get a users JWT token from the AppState
 * @param state the AppState
 */
export const getTokenFromState = (state: AppState): string | undefined =>
  state.user.token;

/**
 * Get a users id number from the AppState
 * @param state the AppState
 */
export const getUserId = (state: AppState): number | undefined =>
  state.user.userId;

/**
 * Get a users plan name from the AppState
 * @param state the AppState
 */
export const getPlanNameFromState = (state: AppState): string | undefined =>
  state.user.planName;

/**
 * Get a users list of plan ids from the AppState
 * @param state the AppState
 */
export const getPlanIdsFromState = (state: AppState): number[] =>
  state.user.planIds;

/**
 * Get a users plan link sharing status from the AppState
 * @param state the AppState
 */
export const getLinkSharingFromState = (state: AppState): boolean =>
  state.user.linkSharing;

/**
 * Get a users fullname from the AppState
 * @param state the AppState
 */
export const getFullNameFromState = (state: AppState): string =>
  state.user.fullName;

/**
 * Get a users coop cycle from the AppState
 * @param state the AppState
 */
export const getUserCoopCycleFromState = (state: AppState): string =>
  state.user.coopCycle;

/* Get a users academic year from the AppState
 * @param state the AppState
 */
export const getAcademicYearFromState = (state: AppState): number =>
  state.user.academicYear;

/* Get a users academic year from the AppState
 * @param state the AppState
 */
export const getGraduationYearFromState = (state: AppState): number =>
  state.user.graduationYear;

/**
 * Get the schedule object from the AppState
 * @param state the AppState
 */
export const getScheduleFromState = (state: AppState): DNDSchedule =>
  state.schedule.present.schedule;

/**
 * Get the list of completed requirements from the AppState
 * @param state the AppState
 */
export const getCompletedRequirementsFromState = (
  state: AppState
): IRequiredCourse[] => state.schedule.present.completedRequirements;

/**
 * Get the list of transfer courses from the AppState
 * @param state the AppState
 */
export const getTransferCoursesFromState = (
  state: AppState
): ScheduleCourse[] => state.schedule.present.transferCourses;

/**
 * Get the selected planName from the AppState
 * @param state the AppState
 */
export const getPlanStrFromState = (state: AppState): string | undefined =>
  state.user.planStr;

/**
 * Get the selected major object from the AppState
 * @param state the AppState
 */
export const getDeclaredMajorFromState = (state: AppState): Major | undefined =>
  state.user.declaredMajor;

/**
 * Get the user email from the AppState
 * @param state the AppState
 */
export const getEmail = (state: AppState): string => state.user.email;
/**
 * Get the warnings generated from the AppState
 * @param state the AppState
 */
export const getWarningsFromState = (state: AppState): IWarning[] =>
  state.schedule.present.warnings;

/**
 * Get the list of majors from the AppState
 * @param state the AppState
 */
export const getMajors = (state: AppState): Major[] => state.majorState.majors;

/**
 * Get the majors loading flag from the AppState
 * @param state the AppState
 */
export const getMajorsLoadingFlag = (state: AppState): boolean =>
  state.majorState.isFetchingMajors;

/**
 * Get the majors loading error message from the AppState
 * @param state the AppState
 */
export const getMajorsError = (state: AppState): string =>
  state.majorState.majorsError;

/**
 * Get the list of plans from the AppState
 * @param state the AppState
 */
export const getPlans = (state: AppState): Record<string, Schedule[]> =>
  state.plansState.plans;

/**
 * Get the plans loading flag from the AppState
 * @param state the AppState
 */
export const getPlansLoadingFlag = (state: AppState): boolean =>
  state.plansState.isFetchingPlans;

/**
 * Get the plans loading error message from the AppState
 * @param state the AppState
 */
export const getPlansError = (state: AppState): string =>
  state.plansState.plansError;

/**
 * Get the plans loading error message from the AppState
 * @param state the AppState
 */
export const getTakenCredits = (state: AppState): number =>
  state.schedule.present.creditsTaken;

/**
 * Get the course specific warnings from the AppState
 * @param state the AppState
 */
export const getCourseWarningsFromState = (
  state: AppState,
  semester: DNDScheduleTerm
): CourseWarning[] =>
  state.schedule.present.courseWarnings.filter(
    w => w.termId === semester.termId
  );

/**
 * Get the current schedule from the Appstate
 * @param state the AppState
 */
export const getScheduleDataFromState = (state: AppState): ScheduleSlice => {
  return state.schedule.present;
};

/**
 * Get the current schedule's major from the AppState
 * @param state the AppState
 */
export const getScheduleMajorFromState = (state: AppState): string => {
  return getScheduleDataFromState(state).major;
};

/**
 * Get the current schedule's coop cycle from the AppState
 * @param state the AppState
 */
export const getScheduleCoopCycleFromState = (state: AppState): string => {
  return getScheduleDataFromState(state).coopCycle;
};

/**
 * Get the list of schedule names from the AppState
 * @param state the AppState
 */
export const getSchedulesFromState = (state: AppState): NamedSchedule[] =>
  Object.values(state.schedules.schedules);

/**
 * Get the active schedule from the AppState
 * @param state the AppState
 */
export const getActiveScheduleFromState = (state: AppState): NamedSchedule => {
  return state.schedules.schedules[state.schedules.activeSchedule!];
};

/**
 * Checks if user is logged in
 */
export const isUserLoggedIn = (state: AppState): boolean => {
  return state.user.userId !== undefined && state.user.token !== undefined;
};

export const getClosedYearsFromState = (state: AppState): Set<number> => {
  return new Set(state.schedule.present.closedYears);
};

/**
 * Get the active current class counter from the AppState
 * @param state the AppState
 */
export const getCurrentClassCounterFromState = (state: AppState): number => {
  return state.schedule.present.currentClassCounter;
};

/**
 * Get whether the current user is an advisor or not
 * @param state the AppState
 */
export const getIsAdvisorFromState = (state: AppState): boolean | undefined => {
  return state.user.isAdvisor;
};
