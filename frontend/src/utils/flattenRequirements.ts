import { IRequiredCourse, Requirement } from "../../../common/types";

/**
 * Given a Requirement, accumulate an array of all of its unique courses.
 * @param req the Requirement to flatten
 */
const flattenRequirementCourses = (req: Requirement): Set<IRequiredCourse> => {
  switch (req.type) {
    case "CREDITS":
    case "OR":
    case "AND": {
      return flattenRequirements(req.courses);
    }
    case "RANGE": {
      // COMBAK: Refactor this flattener to also return a list of "ranges"
      return new Set();
    }
    case "COURSE": {
      return new Set([req]);
    }
  }
};

/**
 * Given an array of Requirements, accumulate an array of all of their unique courses.
 * @param requirements the requirements to flatten
 */
export const flattenRequirements = (
  requirements: Requirement[]
): Set<IRequiredCourse> =>
  requirements.reduce((acc: Set<IRequiredCourse>, req: Requirement) => {
    flattenRequirementCourses(req).forEach(
      (requiredCourse: IRequiredCourse) => {
        acc.add(requiredCourse);
      }
    );

    return acc;
  }, new Set<IRequiredCourse>());
