import { IPlanData  } from "../models/types";
import { AppState } from "./reducers/state";
import { CourseWarning, IWarning, DNDScheduleTerm } from "../models/types";
import { Major, Schedule, ScheduleTerm } from "@graduate/common";
import { findMajorFromName } from "../utils/plan-helpers";
import { convertTermIdToSeason, getCreditsTakenInSchedule } from "../utils";

/**
 * Utility functions to help extract data from the AppState
 * All functions in this file should end with "FromState" for explicitness
 */

/**
 * Get the current user from state
 * @param state the AppState
 */
// Caution! Will error if there is not a user
export const getStudentFromState = (state: AppState) =>
  state.studentState.student!;

export const getDoesAdvisorExistInState = (state: AppState) =>
  !!state.advisorState.advisor;

export const getDoesStudentExistInState = (state: AppState) =>
  !!state.studentState.student;

export const getUserIdFromState = (state: AppState) =>
  getStudentFromState(state).id;

export const safelyGetUserIdFromState = (state: AppState) =>
  getStudentFromState(state)?.id;

export const safelyGetStudentFullNameFromState = (state: AppState) =>
  getStudentFromState(state)?.fullName;

export const getUserFullNameFromState = (state: AppState) =>
  getStudentFromState(state).fullName;

export const getUserPrimaryPlanIdFromState = (state: AppState) =>
  getStudentFromState(state).primaryPlanId;

/**
 * Get the list of completed requirements from the AppState
 * @param state the AppState
 */
export const getCompletedRequirementsFromState = (state: AppState) =>
  state.studentState.completedRequirements;

/**
 * Get the list of completed courses from the AppState
 * @param state the AppState
 */
export const getCompletedCoursesFromState = (state: AppState) =>
  getStudentFromState(state).completedCourses;

/**
 * Get the initial completed course schedule
 * @param state the AppState
 */
export const getCompletedCourseScheduleFromState = (state: AppState) =>
  state.studentState.completedCourseSchedule;

/**
 * Get the initial completed course counter
 * @param state the AppState
 */
export const getCompletedCourseCounterFromState = (state: AppState) =>
  state.studentState.completedCourseCounter;

/**
 * Get the list of transfer courses from the AppState
 * @param state the AppState
 */
export const safelyGetTransferCoursesFromState = (state: AppState) =>
  getStudentFromState(state)?.transferCourses || [];

/**
 * Get the selected major object from the AppState
 * @param state the AppState
 */
export const getUserMajorFromState = (state: AppState): Major | undefined =>
  findMajorFromName(
    getStudentFromState(state).major,
    getMajorsFromState(state),
    getUserCatalogYearFromState(state)
  );

/**
 * Get the selected concentration from the AppState
 * @param state the AppState
 */
export const getUserConcentrationFromState = (state: AppState): string | null =>
  getStudentFromState(state).concentration || null;

export const getUserCatalogYearFromState = (state: AppState): number | null =>
  getStudentFromState(state).catalogYear;

/**
 * Get the selected major name from the AppState
 * @param state the AppState
 */
export const getUserMajorNameFromState = (state: AppState): string | null =>
  getStudentFromState(state).major;

export const getUserCoopCycleFromState = (state: AppState): string | null =>
  getStudentFromState(state).coopCycle;

export const getAcademicYearFromState = (state: AppState) =>
  getStudentFromState(state).academicYear;

export const getGraduationYearFromState = (state: AppState) =>
  getStudentFromState(state).graduationYear;

/**
 * Get the warnings generated from the AppState
 * @param state the AppState
 */
export const getWarningsFromState = (state: AppState): IWarning[] =>
  getActivePlanFromState(state).warnings;

/**
 * Get the list of majors from the AppState
 * @param state the AppState
 */
export const getMajorsFromState = (state: AppState): Major[] =>
  state.majorState.majors;

/**
 * Get the majors loading flag from the AppState
 * @param state the AppState
 */
export const getMajorsLoadingFlagFromState = (state: AppState): boolean =>
  state.majorState.isFetchingMajors;

/**
 * Get the majors loading error message from the AppState
 * @param state the AppState
 */
export const getMajorsErrorFromState = (state: AppState): string =>
  state.majorState.majorsError;

/**
 * Get the list of plans from the AppState
 * @param state the AppState
 */
export const getPlansFromState = (
  state: AppState
): Record<string, Schedule[]> => state.plansState.plans;

/**
 * Get the plans loading flag from the AppState
 * @param state the AppState
 */
export const getPlansLoadingFlagFromState = (state: AppState): boolean =>
  state.plansState.isFetchingPlans;

/**
 * Get the plans loading error message from the AppState
 * @param state the AppState
 */
export const getPlansErrorFromState = (state: AppState): string =>
  state.plansState.plansError;

/**
 * Get the plans loading error message from the AppState
 * @param state the AppState
 */
export const getTakenCreditsFromState = (state: AppState): number =>
  getCreditsTakenInSchedule(getActivePlanScheduleFromState(state)!);

/**
 * Get the course specific warnings from the AppState
 * @param state the AppState
 */
export const getCourseWarningsFromState = (
  state: AppState,
  semester: DNDScheduleTerm
): CourseWarning[] => {
  if (
    !getActivePlanFromState(state) ||
    !getActivePlanFromState(state).courseWarnings
  ) {
    return [];
  }
  return getActivePlanFromState(state)!.courseWarnings.filter(
    (w) => w.termId === semester.termId
  );
};

/**
 * Gets the name of the course with the dndId in a certain semester in the active plan
 * @param state the current state
 * @param dndId the id of the course to search for
 * @param semester the semester the course exists in
 * @returns the name of that course or empty string if can't find
 */
export const getCourseNameFromState = (
  state: AppState,
  dndId?: string,
  semester?: ScheduleTerm
): string | undefined => {
  if (dndId && semester) {
    const season = convertTermIdToSeason(semester.termId);
    const coursesWithGivenDndId = getActivePlanFromState(
      state
    )!.schedule.yearMap[semester.year][season].classes.filter(
      (c) => c.dndId == dndId
    );
    if (coursesWithGivenDndId) {
      return coursesWithGivenDndId[0].name;
    }
  }
};

/**
 * Get the current schedule's major from the AppState
 * @param state the AppState
 */
export const getActivePlanMajorFromState = (state: AppState) => {
  return getActivePlanFromState(state).major;
};

/**
 * Get the current schedule's catalog yearr from the AppState
 * @param state the AppState
 */
export const safelyGetActivePlanCatalogYearFromState = (state: AppState) => {
  return getActivePlanFromState(state)?.catalogYear;
};

/**
 * Get the current schedule's coop cycle from the AppState
 * @param state the AppState
 */
export const getActivePlanCoopCycleFromState = (state: AppState) => {
  return getActivePlanFromState(state).coopCycle;
};

/**
 * Get the list of schedule names from the AppState
 * @param state the AppState
 */
export const getUserPlansFromState = (state: AppState): IPlanData[] =>
  Object.values(state.userPlansState.plans);

/**
 * Get the active schedule from the AppState
 * @param state the AppState
 */
export const getActivePlanFromState = (state: AppState): IPlanData => {
  return state.userPlansState.plans[state.userPlansState.activePlan!];
};

export const getActivePlanScheduleFromState = (state: AppState) => {
  return getActivePlanFromState(state).schedule;
};

export const getIsUpdatingFromState = (state: AppState): boolean => {
  return state.userPlansState.isUpdating;
};

export const getClosedYearsFromState = (state: AppState) => {
  return new Set(
    state.userPlansState.closedYears[state.userPlansState.activePlan!]
  );
};

/**
 * Get the active current class counter from the AppState
 * @param state the AppState
 */
export const getCurrentClassCounterFromState = (state: AppState) => {
  return getActivePlanFromState(state).courseCounter;
};

/**
 * Get whether the current user is an advisor or not
 * @param state the AppState
 */
export const getIsAdvisorFromState = (state: AppState) => {
  return state.advisorState.advisor?.id;
};

export const getActivePlanStatusFromState = (state: AppState) => {
  return state.userPlansState.activePlanStatus;
};

/*
 * SAFE GET FUNCTIONS
 * Should only need to use these where there is not guaranteed to have a user
 */

export const safelyGetActivePlanFromState = (state: AppState) => {
  if (!state.userPlansState.activePlan) {
    return undefined;
  }
  return state.userPlansState.plans[state.userPlansState.activePlan];
};

export const safelyGetActivePlanIdFromState = (state: AppState) => {
  return safelyGetActivePlanFromState(state)?.id;
};

export const getActivePlanNameFromState = (state: AppState) => {
  return state.userPlansState.activePlan;
};

export const safelyGetActivePlanMajorFromState = (state: AppState) =>
  safelyGetActivePlanFromState(state)?.major;

export const safelyGetActivePlanMajorObjectFromState = (state: AppState) =>
  findMajorFromName(
    safelyGetActivePlanMajorFromState(state),
    getMajorsFromState(state),
    safelyGetActivePlanCatalogYearFromState(state)
  );

export const safelyGetActivePlanConcentrationFromState = (state: AppState) =>
  safelyGetActivePlanFromState(state)?.concentration || null;

export const safelyGetActivePlanCoopCycleFromState = (state: AppState) =>
  safelyGetActivePlanFromState(state)?.coopCycle;

export const safelyGetWarningsFromState = (state: AppState) =>
  safelyGetActivePlanFromState(state)?.warnings || [];

export const safelyGetActivePlanScheduleFromState = (state: AppState) =>
  safelyGetActivePlanFromState(state)?.schedule;

export const safelyGetAcademicYearFromState = (state: AppState) =>
  state.studentState.student?.academicYear;

export const safelyGetGraduationYearFromState = (state: AppState) =>
  state.studentState.student?.graduationYear;

export const getFolderExpandedFromState = (state: AppState, index: number) =>
  !state.advisorState.closedFolders.includes(index);

export const getAdvisorUserIdFromState = (state: AppState) =>
  state.advisorState.advisor!.id;

export const safelyGetAdvisorUserIdFromState = (state: AppState) =>
  state.advisorState.advisor?.id;

export const getAdvisorFullNameFromState = (state: AppState) =>
  state.advisorState.advisor!.fullName;

export const safelyGetAdvisorFullNameFromState = (state: AppState) =>
  state.advisorState.advisor?.fullName;
