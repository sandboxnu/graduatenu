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
  type: CourseRowType;
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

export type TextRowType =
  | HRowType.COMMENT
  | HRowType.HEADER
  | HRowType.SUBHEADER;
export type CourseRowType = HRowType.OR_COURSE | HRowType.PLAIN_COURSE;
export type MultiCourseRowType = HRowType.AND_COURSE;

export enum HRowType {
  HEADER = "HEADER",
  SUBHEADER = "SUBHEADER",
  COMMENT = "COMMENT",
  OR_COURSE = "OR_COURSE",
  AND_COURSE = "AND_COURSE",
  PLAIN_COURSE = "PLAIN_COURSE",
}
