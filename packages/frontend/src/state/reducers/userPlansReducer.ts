import {
  expandAllYearsForActivePlanAction,
  incrementCurrentClassCounterForActivePlanAction,
  renameCourseInActivePlanAction,
  setActivePlanCatalogYearAction,
  setActivePlanConcentrationAction,
  setActivePlanNameAction,
  setActivePlanStatusAction,
  setCurrentClassCounterForActivePlanAction,
  toggleYearExpandedForActivePlanAction,
  updateActivePlanFetchingAction,
  updateActivePlanTimestampAction,
} from "../actions/userPlansActions";
import { DNDSchedule, DNDScheduleYear, IPlanData } from "../../models/types";
import produce from "immer";
import { getType } from "typesafe-actions";
import { StudentAction, UserPlansAction } from "../actions";
import {
  addCoursesToActivePlanAction,
  addNewPlanAction,
  changeSemesterStatusForActivePlanAction,
  deletePlan,
  removeClassFromActivePlanAction,
  setActivePlanAction,
  setActivePlanCoopCycleAction,
  setActivePlanDNDScheduleAction,
  setActivePlanMajorAction,
  setActivePlanScheduleAction,
  setUserPlansAction,
  undoRemoveClassFromActivePlanAction,
  updateActivePlanAction,
  updateSemesterForActivePlanAction,
} from "../actions/userPlansActions";
import { resetStudentAction } from "../actions/studentActions";
import {
  alterScheduleToHaveCorrectYears,
  clearSchedule,
  convertTermIdToSeason,
  convertToDNDCourses,
  convertToDNDSchedule,
  fillInSchedule,
  isYearInPast,
  planToString,
  produceWarnings,
} from "../../utils";
import { Schedule } from "@graduate/common";
import { updatePlanForUser } from "../../services/PlanService";

export type ActivePlanAutoSaveStatus =
  | "Up To Date"
  | "Waiting to Update"
  | "Updating";

export interface UserPlansState {
  activePlan?: string;
  plans: {
    [key: string]: IPlanData;
  };
  fifthYearCache: {
    /*
     * A plan name to 5th year schedule map. Used to save 5th year schedule when switching
     * schedule from 5 years to 4 years.
     */
    [key: string]: DNDScheduleYear;
  };
  closedYears: { [key: string]: number[] }; // map plan name to closedYearsList
  pastSchedule?: DNDSchedule; // used for undo
  activePlanStatus: ActivePlanAutoSaveStatus;
  isUpdating: boolean;
}

const initialState: UserPlansState = {
  activePlan: undefined,
  plans: {},
  fifthYearCache: {},
  closedYears: {},
  pastSchedule: undefined,
  activePlanStatus: "Up To Date",
  isUpdating: false,
};

export const userPlansReducer = (
  state: UserPlansState = initialState,
  action: UserPlansAction | StudentAction
) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case getType(setActivePlanAction): {
        const { activePlan, userId, academicYear } = action.payload;
        draft.activePlan = activePlan;

        const timeNow = new Date();
        draft.plans[draft.activePlan!].lastViewed = timeNow;

        // will happen asynchronously
        updatePlanForUser(userId, draft.plans[draft.activePlan!].id, {
          last_viewed: timeNow,
        });

        return closePastYears(draft, academicYear);
      }
      case getType(updateActivePlanAction): {
        const { plan } = action.payload;

        // only update the fields included in the passed in plan
        draft.plans[draft.activePlan!] = {
          ...draft.plans[draft.activePlan!],
          ...plan,
        };

        draft.isUpdating = false;

        return draft;
      }
      case getType(updateActivePlanFetchingAction): {
        // only update the fields included in the passed in plan
        draft.isUpdating = true;

        return draft;
      }
      case getType(updateActivePlanTimestampAction): {
        draft.plans[draft.activePlan!].updatedAt = action.payload.timestamp;
        return draft;
      }
      case getType(addNewPlanAction): {
        const { plan, academicYear } = action.payload;

        draft.plans[plan.name] = plan as IPlanData;
        draft.activePlan = plan.name;

        return academicYear
          ? closePastYears(draft, academicYear)
          : openAllYears(draft);
      }
      case getType(setUserPlansAction): {
        const { plans, academicYear, transferCourses } = action.payload;

        const planMap: { [key: string]: IPlanData } = {};
        plans.forEach((plan: IPlanData) => {
          planMap[plan.name] = plan;
        });

        draft.plans = planMap;

        const index = indexOfLastViewedPlan(plans);
        draft.activePlan = plans[index]?.name;

        const container = produceWarnings(
          plans[index]?.schedule,
          transferCourses
        );

        draft.plans[draft.activePlan!].warnings = container.normalWarnings;
        draft.plans[draft.activePlan!].courseWarnings =
          container.courseWarnings;
        return closePastYears(draft, academicYear);
      }
      case getType(deletePlan): {
        const name = action.payload.name;
        if (Object.values(draft.plans)) delete draft.plans[name];
        if (draft.activePlan === name)
          draft.activePlan = Object.values(draft.plans)[0].name;
        return draft;
      }
      case getType(setActivePlanDNDScheduleAction): {
        draft.plans[draft.activePlan!].schedule = action.payload.schedule;

        const container = produceWarnings(
          JSON.parse(JSON.stringify(action.payload.schedule)), // deep copy of schedule, because schedule is modified
          action.payload.transferCourses
        );

        draft.plans[draft.activePlan!].warnings = container.normalWarnings;
        draft.plans[draft.activePlan!].courseWarnings =
          container.courseWarnings;

        return draft;
      }
      case getType(setActivePlanNameAction): {
        const { name } = action.payload;
        // current active plan object
        const plan = draft.plans[draft.activePlan!];
        // current closed Years array
        const closedYears = draft.closedYears[draft.activePlan!];
        plan.name = name;
        // delete old entry from plans map and closedYears map
        if (Object.values(draft.plans)) delete draft.plans[draft.activePlan!];
        if (Object.values(draft.closedYears))
          delete draft.closedYears[draft.activePlan!];
        // update activePlan and add back the plans and closedYears into maps
        draft.activePlan = name;
        draft.plans[draft.activePlan] = plan;
        draft.closedYears[draft.activePlan] = closedYears;

        return draft;
      }
      case getType(setActivePlanScheduleAction): {
        const schedule = JSON.parse(JSON.stringify(action.payload.schedule)); /// deep copy of schedule, because schedule is modified
        const [newSchedule, newCounter] = convertToDNDSchedule(
          JSON.parse(JSON.stringify(schedule)),
          draft.plans[draft.activePlan!].courseCounter
        );
        draft.plans[draft.activePlan!].schedule = newSchedule;
        draft.plans[draft.activePlan!].courseCounter = newCounter;

        const container = produceWarnings(
          schedule,
          action.payload.transferCourses
        );

        draft.plans[draft.activePlan!].warnings = container.normalWarnings;
        draft.plans[draft.activePlan!].courseWarnings =
          container.courseWarnings;

        return draft;
      }
      case getType(setActivePlanMajorAction): {
        const { major } = action.payload;
        const activePlan = draft.plans[draft.activePlan!];

        activePlan.major = major;
        activePlan.coopCycle = null;
        activePlan.concentration = null;

        return draft;
      }
      case getType(setActivePlanConcentrationAction): {
        const { concentration } = action.payload;
        draft.plans[draft.activePlan!].concentration = concentration;

        return draft;
      }
      case getType(setActivePlanCoopCycleAction): {
        const { coopCycle, allPlans, academicYear } =
          action.payload;

        if (!coopCycle) {
          return;
        }

        if (!allPlans) {
          return draft;
        }

        // active plan name should always be defined
        const activePlanName = draft.activePlan;

        if (!activePlanName) {
          return draft;
        }

        const activePlan = draft.plans[activePlanName];
        const previousSchedule = draft.plans[activePlanName].schedule;

        // find plan with the active plan's major and provided coopCycle
        const plan = allPlans[activePlan.major!].find(
          (p: Schedule) => planToString(p) === coopCycle
        );

        if (plan) {
          const [newSchedule] = convertToDNDSchedule(
            plan,
            activePlan.courseCounter
          );
          draft.plans[activePlanName].schedule =
            alterScheduleToHaveCorrectYears(newSchedule, academicYear);
        }

        // remove all classes
        draft.plans[activePlanName].schedule = clearSchedule(
          draft.plans[activePlanName!].schedule
        );

        // fill in the empty schedule using the previous schedule and the cache for the fifth year
        const { filledInSchedule, updatedFifthYearCache } = fillInSchedule(
          previousSchedule,
          draft.plans[activePlanName].schedule,
          draft.fifthYearCache[activePlanName]
        );

        draft.plans[activePlanName].schedule = filledInSchedule;

        // if the 5th year was removed, store it in the cache
        if (updatedFifthYearCache) {
          draft.fifthYearCache[activePlanName] = updatedFifthYearCache;
        }

        draft.plans[activePlanName].courseCounter = 0;

        // clear all warnings
        draft.plans[activePlanName].warnings = [];
        draft.plans[activePlanName].courseWarnings = [];

        // set the coop cycle
        draft.plans[activePlanName].coopCycle = coopCycle;

        return draft;
      }
      case getType(setActivePlanCatalogYearAction): {
        const { catalogYear } = action.payload;
        draft.plans[draft.activePlan!].catalogYear = catalogYear;
        draft.plans[draft.activePlan!].major = "";
        draft.plans[draft.activePlan!].coopCycle = "";
        return draft;
      }
      case getType(addCoursesToActivePlanAction): {
        const { courses, semester } = action.payload;
        const season = convertTermIdToSeason(semester.termId);

        const [dndCourses, newCounter] = convertToDNDCourses(
          courses,
          draft.plans[draft.activePlan!].courseCounter
        );

        draft.plans[draft.activePlan!].courseCounter = newCounter;

        draft.plans[draft.activePlan!].schedule.yearMap[semester.year][
          season
        ].classes.push(...dndCourses);

        const container = produceWarnings(
          JSON.parse(JSON.stringify(draft.plans[draft.activePlan!].schedule)), // deep copy of schedule, because schedule is modified
          action.payload.transferCourses
        );

        draft.plans[draft.activePlan!].warnings = container.normalWarnings;
        draft.plans[draft.activePlan!].courseWarnings =
          container.courseWarnings;

        return draft;
      }
      case getType(removeClassFromActivePlanAction): {
        const { course, semester } = action.payload;
        const season = convertTermIdToSeason(semester.termId);

        // save prev state with a deep copy
        draft.pastSchedule = JSON.parse(
          JSON.stringify(draft.plans[draft.activePlan!])
        );

        draft.plans[draft.activePlan!].schedule.yearMap[semester.year][
          season
        ].classes = draft.plans[draft.activePlan!].schedule.yearMap[
          semester.year
        ][season].classes.filter((c) => c.dndId !== course.dndId);

        const container = produceWarnings(
          JSON.parse(JSON.stringify(draft.plans[draft.activePlan!].schedule)), // deep copy of schedule, because schedule is modified
          action.payload.transferCourses
        );

        draft.plans[draft.activePlan!].warnings = container.normalWarnings;
        draft.plans[draft.activePlan!].courseWarnings =
          container.courseWarnings;

        return draft;
      }
      case getType(undoRemoveClassFromActivePlanAction): {
        draft.plans[draft.activePlan!] = JSON.parse(
          JSON.stringify(draft.pastSchedule)
        );
        draft.pastSchedule = undefined;
        return draft;
      }
      case getType(renameCourseInActivePlanAction): {
        const { dndId, semester, newName } = action.payload;
        const season = convertTermIdToSeason(semester.termId);

        // save prev state with a deep copy
        draft.pastSchedule = JSON.parse(
          JSON.stringify(draft.plans[draft.activePlan!])
        );

        const coursesToRename = draft.plans[draft.activePlan!].schedule.yearMap[
          semester.year
        ][season].classes.filter((c) => c.dndId == dndId);

        if (coursesToRename) {
          coursesToRename[0].name = newName;
        }
        return draft;
      }
      case getType(changeSemesterStatusForActivePlanAction): {
        const { newStatus, year, season } = action.payload;
        draft.plans[draft.activePlan!].schedule.yearMap[year][season].status =
          newStatus;

        const container = produceWarnings(
          JSON.parse(JSON.stringify(draft.plans[draft.activePlan!].schedule)), // deep copy of schedule, because schedule is modified
          action.payload.transferCourses
        );

        draft.plans[draft.activePlan!].warnings = container.normalWarnings;
        draft.plans[draft.activePlan!].courseWarnings =
          container.courseWarnings;

        return draft;
      }
      case getType(updateSemesterForActivePlanAction): {
        const { year, season, newSemester } = action.payload;
        draft.plans[draft.activePlan!].schedule.yearMap[year][season] =
          newSemester;

        const container = produceWarnings(
          JSON.parse(JSON.stringify(draft.plans[draft.activePlan!].schedule)), // deep copy of schedule, because schedule is modified
          action.payload.transferCourses
        );

        draft.plans[draft.activePlan!].warnings = container.normalWarnings;
        draft.plans[draft.activePlan!].courseWarnings =
          container.courseWarnings;

        return draft;
      }
      case getType(setCurrentClassCounterForActivePlanAction): {
        draft.plans[draft.activePlan!].courseCounter =
          action.payload.currentClassCounter;
        return draft;
      }
      case getType(incrementCurrentClassCounterForActivePlanAction): {
        draft.plans[draft.activePlan!].courseCounter++;
        return draft;
      }
      case getType(toggleYearExpandedForActivePlanAction): {
        const idx = action.payload.index;
        if (draft.closedYears[draft.activePlan!].includes(idx)) {
          draft.closedYears[draft.activePlan!] = draft.closedYears[
            draft.activePlan!
          ].filter((year) => year !== idx);
        } else {
          draft.closedYears[draft.activePlan!].push(idx);
        }
        return draft;
      }
      case getType(expandAllYearsForActivePlanAction): {
        draft.closedYears[draft.activePlan!] = [];
        return draft;
      }
      case getType(resetStudentAction): {
        return initialState;
      }
      case getType(setActivePlanStatusAction): {
        draft.activePlanStatus = action.payload.status;
        return draft;
      }
    }
  });
};

function openAllYears(draft: UserPlansState) {
  draft.closedYears[draft.activePlan!] = [];
  return draft;
}

function closePastYears(draft: UserPlansState, academicYear: number) {
  draft.closedYears[draft.activePlan!] = [];

  const numYears = draft.plans[draft.activePlan!]?.schedule.years.length;
  for (let i = 0; i < numYears; i++) {
    if (isYearInPast(i, academicYear)) {
      draft.closedYears[draft.activePlan!].push(i);
    }
  }
  return draft;
}

function indexOfLastViewedPlan(plans: IPlanData[]): number {
  let index = 0;
  let maxDate: Date | null = null;
  plans.forEach((plan: IPlanData, i: number) => {
    if (maxDate === null || plan.lastViewed > maxDate) {
      maxDate = plan.lastViewed;
      index = i;
    }
  });
  return index;
}
