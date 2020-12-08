import { ICreatePlanData, IPlanData } from "./../models/types";
import { Major } from "../../../common/types";

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

export function convertPlanToCreatePlanData(plan: IPlanData): ICreatePlanData {
  return {
    ...plan,
    link_sharing_enabled: plan.linkSharingEnabled,
    coop_cycle: plan.coopCycle,
    course_counter: plan.courseCounter,
    last_viewed: plan.lastViewed,
  };
}
