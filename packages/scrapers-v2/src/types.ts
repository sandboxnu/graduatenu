/**
 * Catalog Representations:
 *
 * { catalog { <courseList> ... } }
 * { courseList <desc> <comment> <courseBody> } - table
 * { courseBody { <courseRow | textRow> ...} }
 *    textRow:
 *      { areaHeader <comment> <hour> }
 *      { commentRow <comment> <hour> }
 *      { subHeader  <comment> <hour> }
 *
 *    courseRow:
 *      { courseRow <codehol> <hour> }
 *      { orCourseRow <codehol> <hour> }
 *
 */

export type HTMLCatalog = {
  yearVersion: number;
  majorName: string;
  prgramRequiredHours: number;
  courseLists: HTMLCatalogCourseList[];
};

export type HTMLCatalogCourseList = {
  description: string;
  courseBody: HTMLCatalogCourseListBodyRow[];
};

export type HTMLCatalogCourseListBodyRow =
  | HTMLCatalogCourseListBodyRowSingle
  | HTMLCatalogCourseListBodyRowMany;

export interface HTMLCatalogCourseListBodyRowText {
  type:
    | CourseListBodyRowType.COMMENT
    | CourseListBodyRowType.HEADER
    | CourseListBodyRowType.SUBHEADER;
  description: string;
  hour: number;
}
export interface HTMLCatalogCourseListBodyRowSingle {
  type: CourseListBodyRowType.OR_COURSE | CourseListBodyRowType.PLAIN_COURSE;
  description: string;
  hour: number;
  courseTitle: string;
}
export interface HTMLCatalogCourseListBodyRowMany {
  description: string;
  hour: number;
  // maps from title to description
  courses: Record<string, string>;
}

export enum CourseListBodyRowType {
  HEADER = "HEADER",
  SUBHEADER = "SUBHEADER",
  COMMENT = "COMMENT",
  OR_COURSE = "OR_COURSE",
  AND_COURSE = "AND_COURSE",
  PLAIN_COURSE = "PLAIN_COURSE",
}
