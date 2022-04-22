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
  | RangeWithExceptions<BoundedRangeRow<HRowType.RANGE_BOUNDED>>
  | RangeWithExceptions<UnboundedRangeRow<HRowType.RANGE_UNBOUNDED>>
  | BoundedRangeRow<HRowType.RANGE_BOUNDED>;

// the different outputs we have, by TYPE
export enum HRowType {
  HEADER = "HEADER",
  SUBHEADER = "SUBHEADER",
  COMMENT = "COMMENT",
  OR_COURSE = "OR_COURSE",
  AND_COURSE = "AND_COURSE",
  PLAIN_COURSE = "PLAIN_COURSE",
  RANGE_BOUNDED = "RANGE_BOUNDED",
  RANGE_UNBOUNDED = "RANGE_UNBOUNDED",
  RANGE_3 = "RANGE_3",
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
  title: string;
}

export interface MultiCourseRow<T> {
  type: T;
  description: string;
  hour: number;
  // may contain duplicates
  courses: Array<{ title: string; description: string }>;
}

// export interface RangeRow<T> {
//   type: T;
//   hour: number;
//   subjects: string,
//   classIdStart: number,
//   classIdEnd: number
// }

export interface BoundedRangeRow<T> {
  type: T;
  hour: number;
  subjects: string;
  classIdStart: number;
  classIdEnd: number;
}

export interface UnboundedRangeRow<T> {
  type: T;
  hour: number;
  subjects: Array<string>;
}

export type RangeWithExceptions<S> = S & {
  rangeType: "WITH_EXCEPTIONS";
  exceptions: Array<{
    subject: string;
    classId: number;
  }>;
};
