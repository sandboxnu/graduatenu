import { IRequiredCourse, Requirement } from "@graduate/common";

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
  requirements.reduce(
    (acc: IRequiredCourse[], req: Requirement) => [
      ...acc,
      ...getCoursesInRequirement(req),
    ],
    []
  );
