import {
  Schedule,
  ScheduleYear,
  ScheduleTerm,
  ScheduleCourse
} from "graduate-common"

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