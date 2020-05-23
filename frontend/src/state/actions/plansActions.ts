import { Schedule } from "graduate-common";
import { createAction } from "typesafe-actions";

/**
 * Action creators
 */

/**
 * an action that tells the store that a fetch for plans was initiated.
 */
export const fetchPlansPendingAction = createAction(
  "plans/FETCH_PLANS_PENDING",
  () => ({})
)();

/**
 * an action that tells the store that plans were successfully fetched.
 */
export const fetchPlansSuccessAction = createAction(
  "plans/FETCH_PLANS_SUCCESS",
  // Record: TS utility that maps properties of one type to another.
  (plans: Record<string, Schedule[]>) => ({
    plans,
  })
)();

/**
 * an action that tells the store that there was an error when fetching plans.
 */
export const fetchPlansErrorAction = createAction(
  "plans/FETCH_PLANS_ERROR",
  (plansError: string) => ({
    plansError,
  })
)();
