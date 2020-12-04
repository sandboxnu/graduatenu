import {
  Schedule,
  ScheduleYear,
  ScheduleTerm,
  ScheduleCourse,
  INEUAndPrereq,
  INEUOrPrereq,
  INEUPrereqCourse,
  ICourseRange,
  IOrCourse,
  TransferableExam,
  IRequiredCourse,
} from "../../../common/types";

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
 * Represents a schedule with loading and error information
 */
export interface ScheduleSlice {
  id?: number;
  currentClassCounter: number;
  isScheduleLoading: boolean; // not used right now
  scheduleError: string; // not used right now
  schedule: DNDSchedule;
  warnings: IWarning[];
  courseWarnings: CourseWarning[];
  major: string;
  coopCycle: string;
}

/**
 * Represents a schedule, in its present and past state
 */
export interface PastPresentSchedule {
  past?: ScheduleSlice;
  present: ScheduleSlice;
}

/**
 * Represents a schedule with a string name, for better display of plans dropdown
 */
export interface NamedSchedule {
  name: string;
  schedule: PastPresentSchedule;
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

/**
 * Given the {@function courseCode} returns true if the course has been taken.
 */
export interface CourseTakenTracker {
  contains: (input: string) => boolean;
  addCourses: (toAdd: ScheduleCourse[] | INEUCourse[], termId: number) => void;
  addCourse: (toAdd: ScheduleCourse | INEUCourse, termId: number) => void;
  getTermIds: (course: string) => number[];
}

/**
 * A model for data pertaining to a User object.
 */
export interface IUserData {
  id?: number;
  email: string;
  fullName: string;
  academicYear?: number;
  graduationYear?: number;
  major?: string;
  coopCycle?: string;
  nuId: string;
  isAdvisor: boolean;
  examCredits: TransferableExam[];
  transferCourses: ScheduleCourse[];
  completedCourses: ScheduleCourse[];
}

/**
 * A model for data pertaining to a user login object.
 */

export interface ILoginData {
  email: string;
  password: string;
}

/**
 * A model for data pertaining to a Plan object.
 */
export interface IPlanData {
  id: number;
  name: string;
  linkSharingEnabled: boolean;
  schedule: DNDSchedule;
  major: string;
  coopCycle: string;
  warnings: IWarning[];
  courseWarnings: CourseWarning[];
  courseCounter: number;
}

/**
 * A model for data pertaining to a create plan request.
 */
export interface ICreatePlanData {
  name: string;
  link_sharing_enabled: boolean;
  schedule: DNDSchedule;
  major: string;
  coop_cycle: string;
  course_counter: number;
}
/*
 * Data needed to update a user
 */
export interface IUpdateUser {
  token: string;
  id: number;
}

/**
 * A model for data pertaining to a User object.
 */
export interface IUpdateUserData {
  email?: string;
  major?: string;
  username?: string;
  academic_year?: number;
  graduation_year?: number;
  coop_cycle?: string;
  nu_id?: string;
  courses_transfer?: ISimplifiedCourseDataAPI[];
  courses_completed?: ISimplifiedCourseDataAPI[];
}

/**
 * A model for data pertaining to a User object.
 */
export interface IUpdateUserPassword {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

/**
 * A model for simplified course data
 */
export interface ISimplifiedCourseData {
  subject: string;
  classId: string | number;
}

/**
 * A model for simplified course data for API
 */
export interface ISimplifiedCourseDataAPI {
  subject: string;
  course_id: string;
  semester?: string;
  completion?: string;
}

/** ------------------------------------------------------------------------
 *
 *            OLD STUFF FOLLOWS ! This stuff is big outdated and is only
 *    used by the json converter, loader, and parser, and html parser.
 *
 *  -------------------------------------------------------------------------
 */

/**
 * Describes a completed Course with all of the course information provided by the Northeastern degree audit.
 * @param hon - True if this course is Honors, false otherwise.
 * @param subject - The subject of this course (such as Computer Science - "CS" - or Psychology)
 * @param classId - The number used to identify the course along with the subject.
 * @param name - The unique name of this course.
 * @param creditHours - The number of credit hours this course is worth.
 * @param season - The season during which this course was taken.
 * @param year - The year during which this course was taken.
 * @param termId - Northeastern's identifier for the term during which this course was taken.
 */
export interface ICompleteCourse {
  hon: boolean;
  subject: string;
  classId: number;
  name: string;
  creditHours: number;
  season: SeasonEnum;
  year: number;
  termId: number;
}

/**
 * A catch-all interface for the old requirement format.
 * todo: This will be replaced with the future representations (found below).
 */
export interface IOldRequirement {
  classId: number;
  subject?: string;
  num_required?: number;
  classId2?: number;
  list?: number[];
}

/**
 * Represents an initial schedule representation as crafted via the degree audit.
 * @param completed - The completed courses and NUPaths.
 * @param inprogress - The in-progress courses and NUPaths.
 * @param requirements - The requirements for courses and NUPaths yet to be satisfied.
 * @param data - Supplemental information about the student's academic path.
 * @param majors - The major(s) the student intends to obtain degrees for.
 * @param minors - The minor(s) the student intends to obtain.
 * @param auditYear - The year the degree audit was created.
 * @param gradDate - The expected graduation date of the student.
 * @param nupaths - The NUPaths required or satisfied.
 * @param courses - The courses required or satisfied.
 */
export interface IInitialScheduleRep {
  completed: {
    nupaths: NUPathEnum[];
    courses: ICompleteCourse[];
  };
  inprogress: {
    courses: ICompleteCourse[];
    nupaths: NUPathEnum[];
  };
  requirements: {
    courses: IOldRequirement[];
    nupaths: NUPathEnum[];
  };
  data: {
    majors: string[];
    minors: string[];
    auditYear: number;
    gradDate: Date;
  };
}

// json_loader.ts types for ScheduleNEU json file reading.

/**
 * Represents an object containing a bunch of child classMaps.
 * Additionally contains classMaps, under property <termId>. Value of type INEUClassMap.
 * @param mostRecentSemester The most recent termId (relative to the present).
 * @param allTermIds A list of all the termIds contained in the intermediate map object.
 */
export interface INEUParentMap {
  mostRecentSemester: number;
  allTermIds: number[];
  classMapMap: { [key: string]: INEUClassMap };
}

/**
 * A SearchNEU-style classMap. Holds course data for a certain termId.
 * Keys are in format: "neu.edu/<termId>/<subject>/<classId>" with value type INEUCourse.
 * Contains additional misc. information. See raw JSON.
 * @param termId The termId of this term.
 */
export interface INEUClassMap {
  termId: number;
  classMap: { [key: string]: INEUCourse };
}

/**
 * A SearchNEU-style course, holding verbose information.
 * @param crns A list of the CRNS of the course.
 * @param prereqs A prereq object, if the course has prereqs.
 * @param coreqs A prereq object, if hte course has coreqs.
 * @param maxCredits The max credits available for this course.
 * @param minCredits The min credits available for this course.
 * @param desc A description of the course.
 * @param classId The course #.
 * @param prettyUrl A URL to a pretty version of the course info.
 * @param name The name of the course.
 * @param url A URL to the course info.
 * @param lastUpdateTime The last time the course was updated.
 * @param termId The term id of the course. Format <4digityear><season>.
 * @param host The host domain.
 * @param subject The subject of the course.
 * @param optPrereqsFor Courses that this course is an optional prerequisite for.
 * @param prereqsFor Courses that this course is a prerequisite for.
 */
export interface INEUCourse {
  crns: string[];
  prereqs?: INEUAndPrereq | INEUOrPrereq;
  coreqs?: INEUAndPrereq | INEUOrPrereq;
  maxCredits: number;
  minCredits: number;
  desc: string;
  classId: number;
  prettyUrl: string;
  name: string;
  url: string;
  lastUpdateTime: number;
  termId: number;
  host: string;
  subject: string;
  optPrereqsFor?: INEUPrereqCourse[];
  prereqsFor?: INEUPrereqCourse[];
}

// types for json_parser.ts

/**
 * A Schedule.
 * @param completed The completed courses.
 * @param scheduled The scheduled courses.
 */
export interface ISchedule {
  completed: ICompleteCourse[];
  scheduled: string[][];
  // todo: scheduled: IScheduleCourse[][];
}

/**
 * A scheduled course.
 * @param classId The course number of the scheduled course.
 * @param subject The subject of the scheduled course.
 */
export interface IScheduleCourse {
  classId: number;
  subject: string;
}

// types for json_converter.ts

/**
 * A UserChoice is one of OR or RANGE.
 */
export type UserChoice = ICourseRange | IOrCourse;
