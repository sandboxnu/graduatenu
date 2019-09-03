// functions to help convert parsed audit json to user readable data.

// todo: remaining current issues:
// potentially simplify choices for IRequirement(s) that have more than 1 requirement.
// credit requirement should ONLY be on ranges.

// the following code assumes that ranges have a credits required.

import { IAndCourse, ICourseRange, INEUCourse, IOrCourse, IRequirement, IScheduleCourse, ISimpleRequiredCourse } from "./course_types";

interface IUserChoice {
  choices: Array<IAndCourse | IOrCourse | ICourseRange | ISimpleRequiredCourse>;
  credits?: number;
  isRange?: boolean;
}

/**
 * Parses an IRequirement to a choice or a course, to show to the user.
 * @param req The IRequirement to parse.
 */
const parseRequirement = (req: IRequirement): Array<IUserChoice | IScheduleCourse> => {

  // Pray we have only one item.
  if (req.courses.length === 1) {
    return parseRequiredCourse(req.courses[0]);
  }

  // If we have more than one item, we need to wait for the user to choose.
  // todo: or do we? May be able to logic something out here.
  return [{choices: req.courses}];
};

/**
 * Parses a IRequiredCourse to prepare to show to the user.
 * @param rcourse The IRequiredCourse to parse.
 */
const parseRequiredCourse = (rCourse: IAndCourse | IOrCourse | ICourseRange | ISimpleRequiredCourse):
Array<IUserChoice | IScheduleCourse> => {

  // We have a IOrCourse, IAndCourse, ICourseRange, or ISimpleRequiredCourse.
  // Assume that credits only matter if we have a ICourseRange.
  switch (rCourse.type) {
    case "AND":
      return parseRequiredAnd(rCourse);
    case "OR":
      return parseRequiredOr(rCourse);
    case "RANGE":
      return parseRequiredRange(rCourse);
    case "COURSE":
      return parseRequiredSimple(rCourse);
  }
};

/**
 * Parses an IANDCourse to present to the user.
 * @param req The IAndCourse to parse.
 */
const parseRequiredAnd = (req: IAndCourse): Array<IUserChoice | IScheduleCourse> => {

  // We have an AND. Every branch must be completed, but this also means we can "flatten" the results.
  // Assume credits only matter if we have a range.
  const results = req.courses.map((subReq) => (parseRequiredCourse(subReq)));

  // Array.prototype.flat() not yet supported on typescript :(
  // return results.flat();
  return results.reduce((acc, val) => acc.concat(val), []);
};

/**
 * Parses an IORCourse to present to the user.
 * @param req The IORCourse requirement to parse.
 */
const parseRequiredOr = (req: IOrCourse): Array<IUserChoice | IScheduleCourse> => {

  // We have an OR. Not every branch needs to be completed.
  // Make the user choose.
  return [{choices: req.courses}];
};

/**
 * Parses an ICourseRange to present to the user.
 * @param req The ICourseRange requirement to parse.
 */
const parseRequiredRange = (req: ICourseRange): Array<IUserChoice | IScheduleCourse> => {

  // We have a selection. Make the user choose.
  return [{choices: [req], isRange: true}];
};

/**
 * Parses an ISimpleRequiredCourse to present to the user.
 * @param req The ISimpleRequiredCourse to parse.
 */
const parseRequiredSimple = (req: ISimpleRequiredCourse): Array<IUserChoice | IScheduleCourse> => {

  // We have a simple course. Return its equivalent.
  return [{subject: req.subject, classId: req.classId}];
};
