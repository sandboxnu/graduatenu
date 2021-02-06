import { IRequiredCourse, Requirement } from "../../../common/types";

/**
 * Accumulate a Set of all unique courses within a given Requirement.
 * NOTE: This currently does not work for ICourseRanges.
 *
 * @param req the Requirement to retrieve the courses of
 */
const getCoursesInRequirement = (req: Requirement): Set<IRequiredCourse> => {
  switch (req.type) {
    case "CREDITS":
    case "OR":
    case "AND": {
      return flattenRequirements(req.courses);
    }
    case "RANGE": {
      // TODO: Implement a solution for accumulating range courses as well.
      return new Set();
    }
    case "COURSE": {
      return new Set([req]);
    }
  }
};

/**
 * Flatten a given array of Requirements into a Set of all their contained courses.
 *
 * @param requirements the requirements to flatten
 */
export const flattenRequirements = (
  requirements: Requirement[]
): Set<IRequiredCourse> =>
  requirements.reduce((acc: Set<IRequiredCourse>, req: Requirement) => {
    getCoursesInRequirement(req).forEach(acc.add, acc);

    return acc;
  }, new Set<IRequiredCourse>());
