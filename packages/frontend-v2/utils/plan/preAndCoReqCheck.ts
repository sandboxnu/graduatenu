import { courseError, INEUAndPrereq, INEUOrPrereq, INEUPrereq, INEUPrereqCourse, INEUPrereqError, ScheduleTerm2 } from "@graduate/common";


export const getCoReqWarnings = (term: ScheduleTerm2<null>) => {
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
    return {
      type: "or",
      missing: orCoReq.values.map(req => getReqErrors(req, seen)).filter(isError)
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