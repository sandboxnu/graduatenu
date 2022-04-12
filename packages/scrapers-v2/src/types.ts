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

export interface HTMLCatalogCourseListBodyRow {
  description: string;
  hour: number;
  courseTitle?: string;
  type: CourseListBodyRowType;
}

export enum CourseListBodyRowType {
  HEADER = "HEADER",
  SUBHEADER = "SUBHEADER",
  COMMENT = "COMMENT",
  OR_COURSE = "OR_COURSE",
  PLAIN_COURSE = "PLAIN_COURSE",
}
