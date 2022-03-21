// functions to help convert parsed audit json to user readable data.

// todo: remaining current issues:
// potentially simplify choices for Requirement(s) that have more than 1 requirement.
// credit requirement should ONLY be on ranges.

// the following code assumes that ranges have a credits required.

import {
  IAndCourse,
  ICourseRange,
  IOrCourse,
  IRequiredCourse,
  IScheduleCourse,
  Requirement,
  UserChoice,
} from "@graduate/common";

/**
 * Parses a Requirement to a choice or a course, to show to the user.
 * @param req The Requirement to parse.
 */
export const parseRequirement = (
  req: Requirement
): Array<UserChoice | IScheduleCourse> => {
  // We have a IOrCourse, IAndCourse, ICourseRange, or ISimpleRequiredCourse.
  // Assume that credits only matter if we have a ICourseRange.
  switch (req.type) {
    case "AND":
      return parseRequiredAnd(req);
    case "OR":
      return parseRequiredOr(req);
    case "RANGE":
      return parseRequiredRange(req);
    case "COURSE":
      return parseRequiredSimple(req);
    case "CREDITS":
      throw new Error("unimplemented!");
  }
};

/**
 * Parses an IANDCourse to present to the user.
 * @param req The IAndCourse to parse.
 */
const parseRequiredAnd = (
  req: IAndCourse
): Array<UserChoice | IScheduleCourse> => {
  // We have an AND. Every branch must be completed, but this also means we can "flatten" the results.
  const results = req.courses.map((subReq) => parseRequirement(subReq));

  // Array.prototype.flat() not yet supported on typescript :(
  // return results.flat();
  // Array.prototype.reduce: [Y, X => Y], Y => Y
  return results.reduce((acc, val) => acc.concat(val), []);
};

/**
 * Parses an IORCourse to present to the user.
 * @param req The IORCourse requirement to parse.
 */
const parseRequiredOr = (
  req: IOrCourse
): Array<UserChoice | IScheduleCourse> => {
  // We have an OR. Not every branch needs to be completed.
  // Make the user choose.
  return [req];
};

/**
 * Parses an ICourseRange to present to the user.
 * @param req The ICourseRange requirement to parse.
 */
const parseRequiredRange = (
  req: ICourseRange
): Array<UserChoice | IScheduleCourse> => {
  // We have a selection. Make the user choose.
  return [req];
};

/**
 * Parses an ISimpleRequiredCourse to present to the user.
 * @param req The ISimpleRequiredCourse to parse.
 */
const parseRequiredSimple = (
  req: IRequiredCourse
): Array<UserChoice | IScheduleCourse> => {
  // We have a simple course. Return its equivalent.
  return [{ subject: req.subject, classId: req.classId }];
};
