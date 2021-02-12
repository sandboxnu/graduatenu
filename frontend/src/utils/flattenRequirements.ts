import { IRequiredCourse, Requirement } from "../../../common/types";

/**
 * Accumulate an array of all unique courses within a given Requirement.
 * NOTE: This currently does not work for ICourseRanges.
 *
 * @param req the Requirement to retrieve the courses of
 */
const getCoursesInRequirement = (req: Requirement): IRequiredCourse[] => {
  switch (req.type) {
    case "CREDITS":
    case "OR":
    case "AND": {
      return flattenRequirements(req.courses);
    }
    case "RANGE": {
      // TODO: Implement a solution for accumulating range courses as well.
      return [];
    }
    case "COURSE": {
      return [req];
    }
  }
};

/**
 * Flatten a given array of Requirements into an array of all their unique contained courses.
 *
 * @param requirements the requirements to flatten
 */
export const flattenRequirements = (
  requirements: Requirement[]
): IRequiredCourse[] =>
  Array.from(
    requirements.reduce((acc: Set<IRequiredCourse>, req: Requirement) => {
      getCoursesInRequirement(req).forEach(acc.add, acc);

      return acc;
    }, new Set<IRequiredCourse>())
  );
