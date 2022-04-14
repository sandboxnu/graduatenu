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

export type HRow = TextRow | CourseRow | MultiCourseRow;

export interface TextRow {
  type: TextRowType;
  description: string;
  hour: number;
}

export interface CourseRow {
  // represents COURSE_TYPE output
  type: CourseRowType; // tells us which case (PLAIN or OR)
  description: string;
  hour: number;
  title: string;
}

export interface MultiCourseRow {
  type: MultiCourseRowType;
  description: string;
  hour: number;
  // may contain duplicates
  courses: Array<{ title: string; description: string }>;
}

export interface RangeCourseRow {
  type: HRowType.RANGE_COURSE;
  exceptions: Array<{ subject: string; courseId: number }>;
  subjects: Array<string>;
  start: number;
  end: number;
}

export type TextRowType =
  | HRowType.COMMENT
  | HRowType.HEADER
  | HRowType.SUBHEADER;
export type CourseRowType = HRowType.OR_COURSE | HRowType.PLAIN_COURSE;
export type MultiCourseRowType = HRowType.AND_COURSE;

// the different cases we handle for parsing, by SHAPE
export enum RowParseType {
  TEXT = "TEXT",
  OR_COURSE = "OR_COURSE",
  PLAIN_COURSE = "PLAIN_COURSE",
  MULTI_COURSE = "MULTI_COURSE",
  RANGE_1 = "RANGE_1",
  RANGE_2 = "RANGE_2",
  RANGE_3 = "RANGE_3", // all map to HRowType.RANGE_COURSE
}

// the different outputs we have, by TYPE
export enum HRowType {
  HEADER = "HEADER",
  SUBHEADER = "SUBHEADER",
  COMMENT = "COMMENT",
  OR_COURSE = "OR_COURSE",
  AND_COURSE = "AND_COURSE",
  PLAIN_COURSE = "PLAIN_COURSE",
  RANGE_COURSE = "RANGE_COURSE",
}
