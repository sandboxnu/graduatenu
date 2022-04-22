/**
 * Catalog Representations:
 *
 * { document { <section> ... } }
 * { section <desc> <comment> <row[]> }
 * { row { <textRow | courseRow | multiCourseRow> ...} }
 *    textRow:
 *      { areaHeader <comment> <hour> }
 *      { commentRow <comment> <hour> }
 *      { subHeader  <comment> <hour> }
 *
 *    courseRow:
 *      { courseRow <code> <hour> }
 *      { orCourseRow <code> <hour> }
 *
 *    multiCourseRow:
 *      { andCourseRow <hour> { <code, description> ... } }
 *
 *    rangeRow:
 *      { boundedRangeRow <hour> <subject> <startId> <endId> }
 *      { unboundedRangeRow <hour> <subj> }
 *      { lowerBoundedRangeRow <hour> <subject> <startId> }
 */

export type HDocument = {
  yearVersion: number;
  majorName: string;
  programRequiredHours: number;
  sections: HSection[];
};

export type HSection = {
  description: string;
  entries: HRow[];
};

export type HRow =
  | TextRow<HRowType.COMMENT>
  | TextRow<HRowType.HEADER>
  | TextRow<HRowType.SUBHEADER>
  | CourseRow<HRowType.OR_COURSE>
  | CourseRow<HRowType.PLAIN_COURSE>
  | MultiCourseRow<HRowType.AND_COURSE>
  | RangeLowerBoundedRow<HRowType.RANGE_LOWER_BOUNDED>
  | WithExceptions<
      RangeLowerBoundedRow<HRowType.RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS>
    >
  | RangeBoundedRow<HRowType.RANGE_BOUNDED>
  | RangeUnboundedRow<HRowType.RANGE_UNBOUNDED>;

// the different outputs we have, by TYPE
export enum HRowType {
  HEADER = "HEADER",
  SUBHEADER = "SUBHEADER",
  COMMENT = "COMMENT",
  OR_COURSE = "OR_COURSE",
  AND_COURSE = "AND_COURSE",
  PLAIN_COURSE = "PLAIN_COURSE",

  RANGE_LOWER_BOUNDED = "RANGE_LOWER_BOUNDED",
  RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS = "RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS",

  RANGE_BOUNDED = "RANGE_BOUNDED",
  RANGE_UNBOUNDED = "RANGE_UNBOUNDED",
}

export interface TextRow<T> {
  type: T;
  description: string;
  hour: number;
}

export interface CourseRow<T> {
  type: T;
  description: string;
  hour: number;
  subject: string;
  classId: number;
}

export interface MultiCourseRow<T> {
  type: T;
  description: string;
  hour: number;
  // may contain duplicates
  courses: Array<{ subject: string; classId: number; description: string }>;
}

export interface RangeBoundedRow<T> {
  type: T;
  hour: number;
  subject: string;
  classIdStart: number;
  classIdEnd: number;
}

export interface RangeUnboundedRow<T> {
  type: T;
  hour: number;
  subjects: Array<string>;
}

export interface RangeLowerBoundedRow<T> {
  type: T;
  hour: number;
  subject: string;
  classIdStart: number;
}

export type WithExceptions<S> = S & {
  exceptions: Array<{
    subject: string;
    classId: number;
  }>;
};
