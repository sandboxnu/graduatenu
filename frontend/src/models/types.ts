import {
  Schedule,
  ScheduleYear,
  ScheduleTerm,
  ScheduleCourse
} from "graduate-common"

/**
 * Describes an abbreviation for one of Northeastern's NUPath academic breadth requirements.
 * Each two-character NUPath directly corresponds to Northeastern's abbreviation of the requirement.
 */
export enum NUPathEnum {
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

export interface DNDSchedule extends Schedule {
  yearMap: {
    [key: number]: DNDScheduleYear;
  };
}

export interface DNDScheduleYear extends ScheduleYear {
  fall: DNDScheduleTerm;
  spring: DNDScheduleTerm;
  summer1: DNDScheduleTerm;
  summer2: DNDScheduleTerm;
}

export interface DNDScheduleTerm extends ScheduleTerm {
  classes: DNDScheduleCourse[];
}

export interface DNDScheduleCourse extends ScheduleCourse {
  dndId: string;
}

/**
 * A Warning.
 */
export interface IWarning {
  message: string;
  termId: number;
}


/**
 * A CourseWarning, specific to a single course, in a single term(id).
 */
export interface CourseWarning extends IWarning {
  subject: string;
  classId: string;
}

/**
 * A Container for different types of warnings.
 */
export interface WarningContainer {
  normalWarnings: IWarning[];
  courseWarnings: CourseWarning[];
}

/**
 * An Unsatisfied Major Requirement Group.
 */
export interface IRequirementGroupWarning {
  message: string;
  requirementGroup: string;
}