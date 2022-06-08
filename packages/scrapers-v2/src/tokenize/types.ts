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
  entries: HRow[];
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
  | TextRow<HRowType.COMMENT>
  | TextRow<HRowType.HEADER>
  | TextRow<HRowType.SUBHEADER>
  // course rows
  | CourseRow<HRowType.OR_COURSE>
  | CourseRow<HRowType.PLAIN_COURSE>
  // multi course rows
  | MultiCourseRow<HRowType.AND_COURSE>
  // range rows
  | RangeLowerBoundedRow<HRowType.RANGE_LOWER_BOUNDED>
  | WithExceptions<
      RangeLowerBoundedRow<HRowType.RANGE_LOWER_BOUNDED_WITH_EXCEPTIONS>
    >
  | RangeBoundedRow<HRowType.RANGE_BOUNDED>
  | WithExceptions<RangeBoundedRow<HRowType.RANGE_BOUNDED_WITH_EXCEPTIONS>>
  | RangeUnboundedRow<HRowType.RANGE_UNBOUNDED>;

// an enum to give a unique discriminator to each of the above cases
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
  RANGE_BOUNDED_WITH_EXCEPTIONS = "RANGE_BOUNDED_WITH_EXCEPTIONS",

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
