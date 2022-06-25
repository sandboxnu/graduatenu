import {
  CourseRow,
  HRowType,
  RangeBoundedRow,
  RangeLowerBoundedRow,
  RangeUnboundedRow,
  WithExceptions,
} from "../tokenize/types";
import { IOrCourse2, IRequiredCourse, Requirement2 } from "@graduate/common";

export const processCourse = (tokens: [CourseRow<any>]): IRequiredCourse => {
  const { classId, subject } = tokens[0];
  return { type: "COURSE", classId, subject };
};

export const processOr = (
  tokens: [Requirement2, ...CourseRow<HRowType.OR_COURSE>[]]
): IOrCourse2 => {
  const [req, ...ors] = tokens;
  const parsedOrs = ors.map((c) => processCourse([c]));
  return { type: "OR", courses: [req, ...parsedOrs] };
};

const Range = (
  subject: string,
  idRangeStart: number,
  idRangeEnd: number,
  exceptions = []
) => {
  return {
    exceptions,
    idRangeEnd,
    idRangeStart,
    subject,
    type: "RANGE",
  };
};
export const processRange = ([range]: [
  | RangeLowerBoundedRow<HRowType.RANGE_LOWER_BOUNDED>
  | WithExceptions<
      RangeLowerBoundedRow<HRowType.RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS>
    >
  | RangeBoundedRow<HRowType.RANGE_BOUNDED>
  | WithExceptions<RangeBoundedRow<HRowType.RANGE_BOUNDED_WITH_EXCEPTIONS>>
  | RangeUnboundedRow<HRowType.RANGE_UNBOUNDED>
]) /*: ICourseRange2*/ => {
  switch (range.type) {
    case HRowType.RANGE_UNBOUNDED:
      break;
    case HRowType.RANGE_LOWER_BOUNDED:
      break;
    case HRowType.RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS:
      break;
    case HRowType.RANGE_BOUNDED:
      break;
    case HRowType.RANGE_BOUNDED_WITH_EXCEPTIONS:
      break;
  }
};
