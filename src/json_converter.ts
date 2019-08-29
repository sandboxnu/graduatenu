// functions to help convert parsed audit json to user readable data.

// todo: remaining current issues:
// potentially simplify choices for IRequirement(s) that have more than 1 requirement.
// credit requirement should ONLY be on ranges.

// the following code assumes that ranges have a credits required.

import { IAndCourse, INEUCourse, IRequiredCourse, IRequirement, IOrCourse, ICourseRange, ISimpleRequiredCourse } from "./course_types";

/**
 * Represents a discrete choice.
 */
class UserChoice {

  private choices: IRequiredCourse[];
  private credits?: number;

  public constructor(choices: IRequiredCourse[], credits: number) {
    this.choices = choices;
    this.credits = credits;
  }
}

/**
 * Parses an IRequirement to a choice or a course, to show to the user.
 * @param req The IRequirement to parse.
 */
const parseRequirement = (req: IRequirement): Array<UserChoice | INEUCourse> => {

  // Pray we have only one item.
  if (req.courses.length === 1) {
    return parseRequiredCourse(req.courses[0]);
  }

  // If we have more than one item, we need to wait for the user to choose.
  // todo: or do we? May be able to logic something out here.
  return [new UserChoice(req.courses)];
};

/**
 * Parses a IRequiredCourse to prepare to show to the user.
 * @param rcourse The IRequiredCourse to parse.
 * @param creds The number of credits required.
 */
const parseRequiredCourse = (rCourse: IRequiredCourse, creds: number): Array<UserChoice | INEUCourse> => {

  // We have a IOrCourse, IAndCourse, ICourseRange, or ISimpleRequiredCourse.
  // Assume that credits only matter if we have a ICourseRange.
  switch (rCourse.type) {
    case "AND":
      return parseRequiredAnd(rCourse);
    case "OR":
      return parseRequiredOr(rCourse);
    case "RANGE":
      return parseRequiredRange(rCourse, creds);
    case "COURSE":
      return parseRequiredSimple(rCourse);
  }
};

/**
 * Parses an IANDCourse to present to the user.
 * @param req The IAndCourse to parse.
 * @param creds The number of credits remaining.
 */
const parseRequiredAnd = (req: IAndCourse): Array<UserChoice | INEUCourse> => {

  // We have an AND. Every branch must be completed, but this also means we can "flatten" the results.
  // Assume credits only matter if we have a range.
  const results = req.courses.map((subReq) => (parseRequiredCourse(subReq, 0)));

  // Array.prototype.flat() not yet supported on typescript :(
  // return results.flat();
  return results.reduce((acc, val) => acc.concat(val), []);
};

/**
 * Parses an IORCourse to present to the user.
 * @param req The IORCourse requirement to parse.
 * @param creds The number of remaining credits.
 */
const parseRequiredOr = (req: IOrCourse, creds: number): Array<UserChoice | INEUCourse> => {

  // We have an OR. Not every branch needs to be completed.
  // Make the user choose.
  return [new UserChoice(req.courses, creds)];
};

const parseRequiredRange = (req: ICourseRange, creds: number): Array<UserChoice | INEUCourse> => {

  // We have a selection. Make the user choose.
  return [new UserChoice([req], creds)];
};

const parseRequiredSimple = (req: ISimpleRequiredCourse, creds: number): Array<UserChoice | INEUCourse> => {

  // We have a simple course. Return its equivalent.
  return []
}
// final function.
