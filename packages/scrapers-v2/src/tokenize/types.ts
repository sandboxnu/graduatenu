/**
 * An HTML document (catalog page) has a few identifiable features, along with a
 * bunch of sections.
 */
export type HDocument = {
  yearVersion: number;
  majorName: string;
  programRequiredHours: number;
  sections: HSection[];
};

/** An HTML section (of a document) has a description, and a list of rows that it contains. */
export type HSection = {
  description: string;
  entries: HToken[];
};

/**
 * An HTML row (abbreviated HRow) consists of four main different types of row:
 *
 * - TextRow: a row containing text. either an areaHeader, comment, or subHeader.
 * - CourseRow: a single course, that may have an "OR" annotation
 * - MultiCourseRow: multiple courses (2+). currently only AND courses appear as
 *   multiCourseRows
 * - RangeRow: either bounded, unbounded, or only bounded on the bottom (sometimes
 *   with exceptions)
 */
export type HRow =
  // text rows
  | TextRowNoHours<HRowType.COMMENT>
  | TextRow<HRowType.COMMENT_HOUR>
  | CountAndHoursRow<HRowType.COMMENT_COUNT>
  | TextRow<HRowType.HEADER>
  | TextRow<HRowType.SUBHEADER>
  // course rows
  | CourseRow<HRowType.OR_COURSE>
  | CourseRow<HRowType.PLAIN_COURSE>
  // multi course rows
  | MultiCourseRow<HRowType.AND_COURSE>
  | MultiCourseRow<HRowType.OR_OF_AND_COURSE>
  // range rows
  | RangeLowerBoundedRow<HRowType.RANGE_LOWER_BOUNDED>
  | WithExceptions<
      RangeLowerBoundedRow<HRowType.RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS>
    >
  | RangeBoundedRow<HRowType.RANGE_BOUNDED>
  | WithExceptions<RangeBoundedRow<HRowType.RANGE_BOUNDED_WITH_EXCEPTIONS>>
  | RangeUnboundedRow<HRowType.RANGE_UNBOUNDED>;

export type HToken = HRow | RowIndent | RowDedent;

// an enum to give a unique discriminator to each of the above cases
// the different outputs we have, by TYPE
export enum HRowType {
  HEADER = "HEADER",
  SUBHEADER = "SUBHEADER",
  COMMENT = "COMMENT",
  COMMENT_COUNT = "COMMENT_COUNT",
  COMMENT_HOUR = "COMMENT_HOUR",

  OR_COURSE = "OR_COURSE",
  AND_COURSE = "AND_COURSE",
  OR_OF_AND_COURSE = "OR_OF_AND_COURSE",
  PLAIN_COURSE = "PLAIN_COURSE",

  RANGE_LOWER_BOUNDED = "RANGE_LOWER_BOUNDED",
  RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS = "RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS",

  RANGE_BOUNDED = "RANGE_BOUNDED",
  RANGE_BOUNDED_WITH_EXCEPTIONS = "RANGE_BOUNDED_WITH_EXCEPTIONS",

  RANGE_UNBOUNDED = "RANGE_UNBOUNDED",

  ROW_INDENT = "ROW_INDENT",
  ROW_DEDENT = "ROW_DEDENT",
}

export type RowIndent = { type: HRowType.ROW_INDENT };
export type RowDedent = { type: HRowType.ROW_DEDENT };

export interface CommonFields<T> {
  type: T;
  hour: number;
}

export interface TextRowNoHours<T> {
  type: T;
  description: string;
}

export interface TextRow<T> extends CommonFields<T> {
  description: string;
}

export interface CountAndHoursRow<T> extends CommonFields<T> {
  description: string;
  parsedCount: number;
}

export interface CourseRow<T> extends CommonFields<T> {
  description: string;
  subject: string;
  classId: number;
}

export interface MultiCourseRow<T> extends CommonFields<T> {
  description: string;
  // may contain duplicates
  courses: Array<{ subject: string; classId: number; description: string }>;
}

export interface RangeBoundedRow<T> extends CommonFields<T> {
  subject: string;
  classIdStart: number;
  classIdEnd: number;
}

export interface RangeUnboundedRow<T> extends CommonFields<T> {
  subjects: Array<string>;
}

export interface RangeLowerBoundedRow<T> extends CommonFields<T> {
  subject: string;
  classIdStart: number;
}

export type WithExceptions<S> = S & {
  exceptions: Array<{
    subject: string;
    classId: number;
  }>;
};
