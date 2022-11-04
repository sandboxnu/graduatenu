import {
  CoReqWarnings,
  courseToString,
  INEUAndPrereq,
  INEUOrPrereq,
  INEUPrereq,
  INEUPrereqCourse,
  INEUPrereqError,
  PreReqWarnings,
  Schedule2,
  ScheduleTerm2,
  TermError,
} from "@graduate/common";

export const getCoReqWarnings = (
  schedule: Schedule2<unknown>
): CoReqWarnings => {
  const errors: CoReqWarnings = {
    type: "coreq",
    years: schedule.years.map((year) => ({
      year: year.year,
      fall: getCoReqWarningsSem(year.fall),
      spring: getCoReqWarningsSem(year.spring),
      summer1: getCoReqWarningsSem(year.summer1),
      summer2: getCoReqWarningsSem(year.summer2),
    })),
  };
  return errors;
};

export const getCoReqWarningsSem = (
  term: ScheduleTerm2<unknown>
): TermError => {
  const seen: Set<string> = new Set();
  const coReqErrors: TermError = {};
  for (const course of term.classes) {
    seen.add(courseToString(course));
  }
  for (const course of term.classes) {
    if (course.coreqs && course.coreqs.values.length !== 0)
      coReqErrors[courseToString(course)] = getReqErrors(course.coreqs, seen);
  }
  return coReqErrors;
};

export const getPreReqWarnings = (
  schedule: Schedule2<unknown>
): PreReqWarnings => {
  const seen: Set<string> = new Set();
  const preReqErrors: PreReqWarnings = {
    type: "prereq",
    years: schedule.years.map((year) => ({
      year: year.year,
      fall: getPreReqWarningSem(year.fall, seen),
      spring: getPreReqWarningSem(year.spring, seen),
      summer1: getPreReqWarningSem(year.summer1, seen),
      summer2: getPreReqWarningSem(year.summer2, seen),
    }))
  }
  return preReqErrors;
};

export const getPreReqWarningSem = (
  term: ScheduleTerm2<unknown>,
  seen: Set<string>
): TermError => {
  const preReqs: TermError = {};
  for (const course of term.classes) {
    if (course.prereqs && course.prereqs.values.length !== 0) {
      preReqs[courseToString(course)] = getReqErrors(course.prereqs, seen);
    }
  }
  for (const course of term.classes) {
    seen.add(courseToString(course));
  }

  return preReqs;
};

const getReqErrors = (
  reqs: INEUPrereq,
  seen: Set<string>
): INEUPrereqError | undefined => {
  if (isSingleCourse(reqs)) {
    const singleReq = reqs as INEUPrereqCourse;
    return seen.has(courseToString(singleReq))
      ? undefined
      : {
          type: "course",
          subject: singleReq.subject,
          classId: singleReq.classId,
        };
  } else if (isAndCourse(reqs)) {
    const andReq = reqs as INEUAndPrereq;
    const required = andReq.values
      .map((req) => getReqErrors(req, seen))
      .filter(isError);
    if (required.length === 0) return undefined;
    return {
      type: "and",
      missing: required,
    };
  } else if (isOrCourse(reqs)) {
    const orReq = reqs as INEUOrPrereq;
    const missing = orReq.values.map((req) => getReqErrors(req, seen));
    // There is a course that fulfils this or case
    if (missing.includes(undefined)) {
      return undefined;
      // Else this or case is not satisfied
    } else {
      return {
        type: "or",
        missing: missing.filter(isError),
      };
    }
  }
};

const isSingleCourse = (course: INEUPrereq): course is INEUPrereqCourse => {
  return (course as INEUPrereqCourse).subject !== undefined;
};

const isAndCourse = (course: INEUPrereq): course is INEUAndPrereq => {
  return (course as INEUAndPrereq).type === "and";
};

const isOrCourse = (course: INEUPrereq): course is INEUOrPrereq => {
  return (course as INEUOrPrereq).type === "or";
};

const isError = (
  error: INEUPrereqError | undefined
): error is INEUPrereqError => {
  return !!error;
};
