import {
  setCurrentClassCounterForActivePlanAction,
  incrementCurrentClassCounterForActivePlanAction,
  toggleYearExpandedForActivePlanAction,
  setActivePlanCatalogYearAction,
  setActivePlanStatusAction,
} from "./../actions/userPlansActions";
import { DNDSchedule, IPlanData } from "../../models/types";
import produce from "immer";
import { getType } from "typesafe-actions";
import { UserPlansAction, UserAction } from "../actions";
import {
  setActivePlanAction,
  addNewPlanAction,
  deletePlan,
  setUserPlansAction,
  updateActivePlanAction,
  setActivePlanDNDScheduleAction,
  setActivePlanMajorAction,
  setActivePlanCoopCycleAction,
  setActivePlanScheduleAction,
  addCoursesToActivePlanAction,
  removeClassFromActivePlanAction,
  undoRemoveClassFromActivePlanAction,
  changeSemesterStatusForActivePlanAction,
  updateSemesterForActivePlanAction,
} from "../actions/userPlansActions";
import { resetUserAction } from "../actions/userActions";
import {
  clearSchedule,
  convertTermIdToSeason,
  convertToDNDCourses,
  convertToDNDSchedule,
  isYearInPast,
  planToString,
  produceWarnings,
} from "../../utils";
import { Schedule } from "../../../../common/types";
import { updatePlanForUser } from "../../services/PlanService";
import { getAuthToken } from "../../utils/auth-helpers";

export type ActivePlanAutoSaveStatus =
  | "Up To Date"
  | "Waiting to Update"
  | "Updating";

export interface UserPlansState {
  activePlan?: string;
  plans: { [key: string]: IPlanData };
  closedYears: { [key: string]: number[] }; // map plan name to closedYearsList
  pastSchedule?: DNDSchedule; // used for undo
  activePlanStatus: ActivePlanAutoSaveStatus;
}

const initialState: UserPlansState = {
  activePlan: undefined,
  plans: {},
  closedYears: {},
  pastSchedule: undefined,
  activePlanStatus: "Up To Date",
};

export const userPlansReducer = (
  state: UserPlansState = initialState,
  action: UserPlansAction | UserAction
) => {
  return produce(state, draft => {
    switch (action.type) {
      case getType(setActivePlanAction): {
        const { activePlan, userId, academicYear } = action.payload;
        draft.activePlan = activePlan;

        const timeNow = new Date();
        draft.plans[draft.activePlan!].lastViewed = timeNow;

        // will happen asynchronously
        updatePlanForUser(
          userId,
          getAuthToken(),
          draft.plans[draft.activePlan!].id,
          {
            last_viewed: timeNow,
          }
        );

        return closePastYears(draft, academicYear);
      }
      case getType(updateActivePlanAction): {
        const { plan } = action.payload;

        // only update the fields included in the passed in plan
        draft.plans[draft.activePlan!] = {
          ...draft.plans[draft.activePlan!],
          ...plan,
        };

        return draft;
      }
      case getType(addNewPlanAction): {
        const { plan, academicYear } = action.payload;

        draft.plans[plan.name] = plan;
        draft.activePlan = plan.name;
        return closePastYears(draft, academicYear);
      }
      case getType(setUserPlansAction): {
        const { plans, academicYear } = action.payload;

        const planMap: { [key: string]: IPlanData } = {};
        plans.forEach((plan: IPlanData) => {
          planMap[plan.name] = plan;
        });

        draft.plans = planMap;

        const index = indexOfLastViewedPlan(plans);
        draft.activePlan = plans[index].name;
        return closePastYears(draft, academicYear);
      }
      case getType(resetUserAction): {
        draft = initialState;
        return draft;
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
          JSON.parse(JSON.stringify(action.payload.schedule)) // deep copy of schedule, because schedule is modified
        );

        draft.plans[draft.activePlan!].warnings = container.normalWarnings;
        draft.plans[draft.activePlan!].courseWarnings =
          container.courseWarnings;

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

        const container = produceWarnings(schedule);

        draft.plans[draft.activePlan!].warnings = container.normalWarnings;
        draft.plans[draft.activePlan!].courseWarnings =
          container.courseWarnings;

        return draft;
      }
      case getType(setActivePlanMajorAction): {
        const { major } = action.payload;

        draft.plans[draft.activePlan!].major = major;

        return draft;
      }
      case getType(setActivePlanCoopCycleAction): {
        const {
          coopCycle,
          allPlans,
          academicYear,
          graduationYear,
        } = action.payload;

        if (!allPlans) {
          return draft;
        }

        const activePlan = draft.plans[draft.activePlan!];

        const plan = allPlans[activePlan.major!].find(
          (p: Schedule) => planToString(p) === coopCycle
        );

        if (!plan) {
          return draft;
        }

        const [newSchedule, newCounter] = convertToDNDSchedule(
          plan,
          activePlan.courseCounter
        );

        // remove all classes
        draft.plans[draft.activePlan!].schedule = clearSchedule(
          newSchedule,
          academicYear,
          graduationYear
        );
        draft.plans[draft.activePlan!].courseCounter = 0;

        // clear all warnings
        draft.plans[draft.activePlan!].warnings = [];
        draft.plans[draft.activePlan!].courseWarnings = [];

        // set the coop cycle
        draft.plans[draft.activePlan!].coopCycle = coopCycle;

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
          JSON.parse(JSON.stringify(draft.plans[draft.activePlan!].schedule)) // deep copy of schedule, because schedule is modified
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
        ][season].classes.filter(c => c.dndId !== course.dndId);

        const container = produceWarnings(
          JSON.parse(JSON.stringify(draft.plans[draft.activePlan!].schedule)) // deep copy of schedule, because schedule is modified
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
      case getType(changeSemesterStatusForActivePlanAction): {
        const { newStatus, year, season } = action.payload;
        draft.plans[draft.activePlan!].schedule.yearMap[year][
          season
        ].status = newStatus;

        const container = produceWarnings(
          JSON.parse(JSON.stringify(draft.plans[draft.activePlan!].schedule)) // deep copy of schedule, because schedule is modified
        );

        draft.plans[draft.activePlan!].warnings = container.normalWarnings;
        draft.plans[draft.activePlan!].courseWarnings =
          container.courseWarnings;

        return draft;
      }
      case getType(updateSemesterForActivePlanAction): {
        const { year, season, newSemester } = action.payload;
        draft.plans[draft.activePlan!].schedule.yearMap[year][
          season
        ] = newSemester;

        const container = produceWarnings(
          JSON.parse(JSON.stringify(draft.plans[draft.activePlan!].schedule)) // deep copy of schedule, because schedule is modified
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
          ].filter(year => year !== idx);
        } else {
          draft.closedYears[draft.activePlan!].push(idx);
        }
        return draft;
      }
      case getType(resetUserAction): {
        return initialState;
      }
      case getType(setActivePlanStatusAction): {
        draft.activePlanStatus = action.payload.status;
        return draft;
      }
    }
  });
};

function closePastYears(draft: UserPlansState, academicYear: number) {
  draft.closedYears[draft.activePlan!] = [];

  const numYears = draft.plans[draft.activePlan!].schedule.years.length;
  for (var i = 0; i < numYears; i++) {
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
