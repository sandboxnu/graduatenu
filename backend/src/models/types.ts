/**
 * This file contains types that are used only in the backend directory of this project.
 */

import { Requirement, ISubjectRange } from "../../../frontend/src/models/types";

/**
 * Enumeration of valid sections types.
 */
export enum SectionType {
  AND,
  OR,
  RANGE,
}

/**
 * Enumeration of valid row types.
 */
export enum RowType {
  AndRow,
  OrRow,
  SubjectRangeRow,
  RequiredCourseRow,
}

/**
 * Enumeration of valid subheader types.
 */
export enum SubHeaderReqType {
  IAndCourse,
  IOrCourse,
  ICourseRange,
}

export type ScraperRequirement = Requirement | ISubjectRange;

/**
 * An object that represents a credit range.
 */
export interface CreditsRange {
  numCreditsMin: number;
  numCreditsMax: number;
}
