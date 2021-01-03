import { IUpdatePlanData, IPlanData } from "./../models/types";
import { Major } from "../../../common/types";

/**
 * Finds a major from the given list of majors with the given name.
 * @param name    the name of the major being searched
 * @param majors  the list of majors to filter through
 */
export function findMajorFromName(
  name: string | null | undefined,
  majors: Major[],
  catalogYear: number | null | undefined
): Major | undefined {
  let major: Major | undefined = majors.find(
    major => major.name === name && major.yearVersion === catalogYear
  );
  if (!major) {
    return undefined;
  }
  return major;
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
