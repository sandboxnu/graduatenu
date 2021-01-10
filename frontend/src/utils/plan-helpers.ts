import { IUpdatePlanData, IPlanData } from "./../models/types";
import { Major, Schedule } from "../../../common/types";
import { planToString } from "./schedule-helpers";

/**
 * Finds a major from the given list of majors with the given name.
 * @param name    the name of the major being searched
 * @param majors  the list of majors to filter through
 */
export function findMajorFromName(
  name: string | null | undefined,
  majors: Major[]
): Major | undefined {
  let major: Major | undefined = majors.find(major => major.name === name);
  if (!major) {
    return undefined;
  }
  return major;
}

/**
 *
 * @param allPlans
 * @param major
 * @param coopCycle
 */
export function findExamplePlanFromCoopCycle(
  allPlans: Record<string, Schedule[]>,
  major: string,
  coopCycle: string
): Schedule | undefined {
  const currentPlan = allPlans[major].find(
    (p: Schedule) => planToString(p) === coopCycle
  )!;
  return currentPlan;
}

export function convertPlanToUpdatePlanData(
  plan: IPlanData,
  userId: number
): IUpdatePlanData {
  return {
    name: plan.name,
    link_sharing_enabled: plan.linkSharingEnabled,
    major: plan.major,
    coop_cycle: plan.coopCycle,
    course_counter: plan.courseCounter,
    last_viewed: plan.lastViewed,
    warnings: plan.warnings,
    course_warnings: plan.courseWarnings,
    catalog_year: plan.catalogYear,
    schedule: plan.schedule,
    last_viewer: userId,
  };
}
