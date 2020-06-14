/**
 * This file contains types that are used only in the backend directory of this project.
 */

import { Requirement, ISubjectRange } from "graduate-common";

/**
 * Describes an abbreviation for one of Northeastern's NUPath academic breadth requirements.
 * Each two-character NUPath directly corresponds to Northeastern's abbreviation of the requirement.
 */
export enum NUPath {
  ND = "ND",
  EI = "EI",
  IC = "IC",
  FQ = "FQ",
  SI = "SI",
  AD = "AD",
  DD = "DD",
  ER = "ER",
  WF = "WF",
  WD = "WD",
  WI = "WI",
  EX = "EX",
  CE = "CE",
}

/**
 * Represents one of the seasons in which a student can take a course, as abbreviated by Northeastern.
 */
export enum SeasonEnum {
  FL = "FL",
  SP = "SP",
  S1 = "S1",
  S2 = "S2",
  SM = "SM",
}

/**
 * A Status is one of on CO-OP, CLASSES, or INACTIVE
 */
export enum StatusEnum {
  COOP = "COOP",
  CLASSES = "CLASSES",
  INACTIVE = "INACTIVE",
  HOVERINACTIVE = "HOVERINACTIVE",
  HOVERCOOP = "HOVERCOOP",
}

/**
 * Enumeration of valid sections types.
 */
export enum SectionType {
  AND,
  OR,
  RANGE,
}

/**
 * Enumeration of valid subsection types.
 */
export enum SubSectionType {
  COURSES,
  CREDIT,
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
