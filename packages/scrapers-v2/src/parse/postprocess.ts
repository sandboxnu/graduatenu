import { HRow, HRowType } from "../tokenize/types";
import {
  IAndCourse2,
  IOrCourse2,
  IRequiredCourse,
  Requirement2,
} from "@graduate/common";

// grab the wrapper of the row type enum from tokenize types
type GetRow<RowType> = HRow & { type: RowType };
// sometimes produces a list, if a row token maps to multiple requirements
type Processor<RowType> = (
  tokens: [GetRow<RowType>]
) => Requirement2 | Requirement2[];

// utility for parsing a list of simple courses to IRequiredCourse
const convertCourses = (
  cs: Array<{ subject: string; classId: number }>
): IRequiredCourse[] => {
  return cs.map((c) => ({ ...c, type: "COURSE" }));
};

export const processCourse: Processor<
  HRowType.PLAIN_COURSE | HRowType.OR_COURSE
> = (tokens): IRequiredCourse => {
  const { subject, classId } = tokens[0];
  return { type: "COURSE", classId, subject };
};

export const processRangeLB: Processor<HRowType.RANGE_LOWER_BOUNDED> = (
  tokens
) => {
  const { classIdStart, subject } = tokens[0];
  return {
    type: "RANGE",
    subject,
    idRangeStart: classIdStart,
    idRangeEnd: 9999,
    exceptions: [],
  };
};

export const processRangeLBE: Processor<
  HRowType.RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS
> = (tokens) => {
  const { subject, classIdStart, exceptions: es } = tokens[0];
  const exceptions = convertCourses(es);
  return {
    type: "RANGE",
    subject,
    idRangeStart: classIdStart,
    idRangeEnd: 9999,
    exceptions,
  };
};

export const processRangeB: Processor<HRowType.RANGE_BOUNDED> = (tokens) => {
  const { subject, classIdStart, classIdEnd } = tokens[0];
  return {
    type: "RANGE",
    subject,
    idRangeStart: classIdStart,
    idRangeEnd: classIdEnd,
    exceptions: [],
  };
};

export const processRangeBE: Processor<
  HRowType.RANGE_BOUNDED_WITH_EXCEPTIONS
> = (tokens) => {
  const { subject, classIdStart, classIdEnd, exceptions: es } = tokens[0];
  const exceptions = convertCourses(es);
  return {
    type: "RANGE",
    subject,
    idRangeStart: classIdStart,
    idRangeEnd: classIdEnd,
    exceptions,
  };
};

export const processRangeU: Processor<HRowType.RANGE_UNBOUNDED> = (tokens) => {
  const { subjects } = tokens[0];
  return subjects.map((subject) => ({
    type: "RANGE",
    subject,
    idRangeStart: 0,
    idRangeEnd: 9999,
    exceptions: [],
  }));
};

export const processOr = (
  tokens: [Requirement2, Requirement2[]]
): IOrCourse2 => {
  const [req, ors] = tokens;
  return { type: "OR", courses: [req, ...ors] };
};

export const processOrOfAnd: Processor<
  HRowType.OR_OF_AND_COURSE | HRowType.AND_COURSE
> = (tokens) => {
  const { courses: cs } = tokens[0];
  const courses = convertCourses(cs);
  return {
    type: "AND",
    courses,
  };
};

export const processAnd = (tokens: [IAndCourse2[]]): IAndCourse2 => {
  const courses = [];
  for (const { courses: cs } of tokens[0]) {
    courses.push(...cs);
  }
  return {
    type: "AND",
    courses,
  };
};
