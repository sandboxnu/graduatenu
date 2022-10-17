import { courseError, INEUAndPrereq, INEUOrPrereq, INEUPrereq, INEUPrereqCourse, INEUPrereqError, preReqWarnings, Schedule2, ScheduleTerm2 } from "@graduate/common";

export const getCoReqWarnings = (term: ScheduleTerm2<unknown>) => {
  const seen: Set<string> = new Set();
  const coReqErrors: courseError = {}
  for (const course of term.classes) {
    seen.add(course.subject + course.classId);
  }

  for (const course of term.classes) {
    // Course has coreqs
    if (course.coreqs)
      coReqErrors[course.subject + course.classId] = getReqErrors(course.coreqs, seen);
  }
  return coReqErrors;
}

export const getPreReqWarnings = (schedule: Schedule2<unknown>) => {
  const preReqErrors: preReqWarnings = {}
  const seen: Set<string> = new Set();
  for (const year of schedule.years) {
    preReqErrors[year.year].fall = getPreReqWarningSem(year.fall, seen);
    preReqErrors[year.year].spring = getPreReqWarningSem(year.spring, seen);
    preReqErrors[year.year].summer1 = getPreReqWarningSem(year.summer1, seen);
    preReqErrors[year.year].summer2 = getPreReqWarningSem(year.summer2, seen);
  }
  return preReqErrors
}

export const getPreReqWarningSem = (term: ScheduleTerm2<unknown>, seen: Set<string>) => {
  const preReqs: courseError = {}
  for (const course of term.classes) {
    // Course has prereqs
    if (course.prereqs)
      preReqs[course.subject + course.classId] = getReqErrors(course.prereqs, seen);
  }

  for (const course of term.classes) {
    seen.add(course.subject + course.classId)
  }
  return preReqs;
}

const getReqErrors = (coreq: INEUPrereq, seen: Set<string>): INEUPrereqError | undefined => {
  // Single course
  if (isSingleCourse(coreq)) {
    const singleCoReq = coreq as INEUPrereqCourse;
    return seen.has(singleCoReq.subject + singleCoReq.classId) ? undefined : {
      type: "course",
      subject: singleCoReq.subject,
      classId: singleCoReq.classId
    }
  } else if (isAndCourse(coreq)) {
    const andCoReq = coreq as INEUAndPrereq;
    return {
      type: "and",
      missing: andCoReq.values.map(req => getReqErrors(req, seen)).filter(isError)
    }
  } else if (isOrCourse(coreq)) {
    const orCoReq = coreq as INEUOrPrereq;
    const missing = orCoReq.values.map(req => getReqErrors(req, seen));
    // There is a course that fulfils this or case
    if (missing.includes(undefined)) {
      return undefined
    // Else this or case is not satisfied
    } else {
      return {
        type: "or",
        missing: missing.filter(isError)
      }
    }
  }
}

const isSingleCourse = (course: INEUPrereq): course is INEUPrereqCourse => {
  return (course as INEUPrereqCourse).classId !== undefined
}


const isAndCourse = (course: INEUPrereq): course is INEUAndPrereq => {
  return (course as INEUAndPrereq).type === 'and'
}

const isOrCourse = (course: INEUPrereq): course is INEUOrPrereq => {
  return (course as INEUOrPrereq).type !== 'or'
}

const isError = (error: INEUPrereqError | undefined): error is INEUPrereqError => {
  return !!error
}