/**
 * The response from the server is either an error or the data requested for.
 */
export type ServerResponse<ExpectedData> =
  | ServerErrorResponse
  | ServerDataResponse<ExpectedData>;

/**
 * Structure of a data response from the server.
 */
export interface ServerDataResponse<Data> {
  statusCode: number;
  data: Data;
}

/**
 * Structure of an error response from the server.
 */
export interface ServerErrorResponse {
  statusCode: number;
  error: string;
  message: string | string[];
}

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

export type NUPath = keyof typeof NUPathEnum;
export type Status = keyof typeof StatusEnum;
export type Season = keyof typeof SeasonEnum;
export type SeasonWord = "fall" | "spring" | "summer1" | "summer2";

/**
 * Represents a degree requirement that has not yet been satisfied.
 */
export type Requirement =
  | IOrCourse
  | IAndCourse
  | ICourseRange
  | IRequiredCourse
  | ICreditRangeCourse;

export interface ICreditRangeCourse {
  type: "CREDITS";
  minCredits: number;
  maxCredits: number;
  courses: Requirement[];
}

// TODO: with interfaces, the additional type parameter may not be necessary
/**
 * An 'OR' set of courses.
 * @param courses: A list of courses, one of which can be taken to satisfy this requirement.
 */
export interface IOrCourse {
  type: "OR";
  courses: Requirement[];
}

/**
 * An 'AND' series of courses.
 * @param courses - A list of courses, all of which must be taken to satisfy this requirement.
 */
export interface IAndCourse {
  type: "AND";
  courses: Requirement[];
}

/**
 * A variety of ranges of courses, one or more of which can be taken to satisfy
 * the number of credits required.
 * @param creditsRequired - The number of credits required to be taken from the provided ranges.
 * @param ranges - The ranges of courses from which courses can be selected.
 */
export interface ICourseRange {
  type: "RANGE";
  creditsRequired: number;
  // Potentially add a min/max to ICourseRange
  ranges: ISubjectRange[];
}

/**
 * A range of courses within a single subject.
 * @param subject - The subject the course range is concerned with.
 * @param idRangeStart - The classId at the start of the course range.
 * @param idRangeEnd - The classId at the end of the course range.
 */
export interface ISubjectRange {
  subject: string;
  idRangeStart: number;
  idRangeEnd: number;
}

/**
 * A single required course.
 * @param classId - The numeric ID of the course.
 * @param subject - The subject that the course is concerned with, such as CS (Computer Science).
 */
export interface IRequiredCourse {
  type: "COURSE";
  classId: number;
  subject: string;
}

/**
 * A SearchNEU prerequisite object.
 */
export type INEUPrereq = INEUAndPrereq | INEUOrPrereq | INEUPrereqCourse;
/**
 * A SearchNEU AND prerequisite object.
 * @param type The type of the SearchNEU prerequisite.
 * @param values The prerequisites that must be completed for this prereq. to be marked as done.
 */
export interface INEUAndPrereq {
  type: "and";
  values: INEUPrereq[];
}

/**
 * A SearchNEU OR prerequisite object.
 * @param type The type of the SearchNEU prerequisite.
 * @param values The prerequisites of which one must be completed for this prerequisite to be marked as done.
 */
export interface INEUOrPrereq {
  type: "or";
  values: INEUPrereq[];
}

/**
 * A SearchNEU prerequisite course.
 * @param classId The course number of this prerequisite course.
 * @param subject The subject of this prerequisite course.
 * @param missing True if the class is missing.
 */
export interface INEUPrereqCourse {
  classId: string;
  subject: string;
  missing?: true;
}

//                                       NEW MAJOR OBJECT HERE
/**
 * A Major, containing all the requirements.
 * @param name The name of the major.
 * @param requirementSections A list of the sections of requirements.
 * @param totalCreditsRequired Total credits required to graduate with this major.
 * @param yearVersion The catalog version year of this major.
 * @param concentrations The possible concentrations within this major.
 */
export interface Major2 {
  name: string;
  requirementSections: Section[];
  totalCreditsRequired: number;
  yearVersion: number;
  concentrations: Concentrations;
}

/**
 * A Section, containing its related requirements.
 * @param title The title of the section.
 * @param requirements A list of the requirements within this section.
 * @param minRequirementCount The minimum number of requirements (counts from requirements)
 *        that are accepted for the section to be fulfilled.
 */
export interface Section {
  title: string;
  requirements: Requirement2[];
  minRequirementCount: number;
}

/**
 * Represents a degree requirement that allows a Section to be completed.
 */
export type Requirement2 =
  | IXofManyCourse
  | IAndCourse2
  | IOrCourse2
  | ICourseRange2
  | IRequiredCourse
  | Section;

/**
 * Represents a requirement where X number of credits need to be completed from a list of courses.
 * @param type The type of requirement.
 * @param numCreditsMin The minimum number of credits needed to fulfill a given section.
 * @param courses The list of requirements that the credits can be fulfilled from.
 */
export interface IXofManyCourse {
  type: "XOM";
  numCreditsMin: number;
  courses: Requirement2[];
}

/**
 * Represents an 'AND' series of requirements.
 * @param type The type of requirement.
 * @param courses The list of requirements, all of which must be taken to satisfy this requirement.
 */
export interface IAndCourse2 {
  type: "AND";
  courses: Requirement2[];
}

/**
 * Represents an 'OR' set of requirements.
 * @param type The type of requirement.
 * @param courses The list of requirements, one of which can be taken to satisfy this requirement.
 */
export interface IOrCourse2 {
  type: "OR";
  courses: Requirement2[];
}

/**
 * Represents a requirement that specifies a range of courses.
 * @param type The type of requirement.
 * @param creditsRequired The number of credits taken from the range for this requirement to be fulfilled.
 * @param subject The subject area of the range of courses.
 * @param idRangeStart The course ID for the starting range of course numbers.
 * @param idRangeEnd The course ID for the ending range of course numbers.
 * @param exceptions The requirements within the mentioned range that do not count towards fulfulling this requirement.
 */
export interface ICourseRange2 {
  type: "RANGE";
  creditsRequired: number;
  subject: string;
  idRangeStart: number;
  idRangeEnd: number;
  exceptions: Requirement2[];
}

/**
 * A Concentrations, contains all of the available concentrations for the major and their respective requirements.
 * @param minOptions The minimum number of concentrations required for the major.
 * @param concentrationOptions The list of sections representing all of the available concentrations in the major.
 */
export interface Concentrations2 {
  minOptions: number;
  concentrationOptions: Section[];
}

//                                   END NEW MAJOR OBJECT HERE

// types added for new data representation stuff.

/**
 * A Major, containing all the requirements.
 * @param name The name of the major.
 * @param requirementGroups a list of the sections of this major
 * @param requirementGroupMap an object containing the sections of this major.
 * @param yearVersion Which major version the user has, based on the year.
 * @param isLanguageRequired True if a language is required.
 * @param totalCreditsRequired The total number of credit-hours required for the major.
 * @param nupaths The nupaths required for the major.
 */
export interface Major {
  name: string;
  requirementGroups: string[];
  requirementGroupMap: { [key: string]: IMajorRequirementGroup };
  yearVersion: number;
  isLanguageRequired: boolean;
  totalCreditsRequired: number;
  nupaths: NUPathEnum[];
  concentrations: Concentrations;
}

/**
 * A list of concentration options and the min/max number of concentrations they can do
 * @param minOptions Minimum required concentrations
 * @param maxOptions Maximum number of concentrations they can take
 * @param concentrationOptions All of the concentrations that they can choose from
 */
export interface Concentrations {
  minOptions: number;
  maxOptions: number;
  concentrationOptions: Concentration[];
}

/**
 * A single Concentration and it's requirements
 * @param name The name of the concentration
 * @param requirementGroups a list of the sections of this concentration
 * @param requirementGroupMap an object containing the sections of this concentration
 */
export interface Concentration {
  name: string;
  requirementGroups: string[];
  requirementGroupMap: { [key: string]: IMajorRequirementGroup };
}

/**
 * A generic Major requirment group.
 */
export type IMajorRequirementGroup = ANDSection | ORSection | RANGESection;

/**
 * A section that must have everything completed in it.
 * @param type the type of the section
 * @param requirements the requirements of the section
 * @param name the name of the section
 */
export interface ANDSection {
  type: "AND";
  requirements: Requirement[];
  name: string;
}

/**
 * A section that has a credit requirement
 * @param type the type of this requirement
 * @param requirements the possible choices for earning credits
 * @param numCreditsMin the minimum number of credits needed to satisfy this major
 * @param numCreditsMax the maximum number of credits needed to satisfy this major
 * @param name the name of this section
 */
export interface ORSection {
  type: "OR";
  requirements: Requirement[];
  numCreditsMin: number;
  numCreditsMax: number;
  name: string;
}

/**
 * A section that has a credit requirement, that can be fulfilled by taking courses in any of the range requirements.
 * @param type the type of this requirement
 * @param requirements the possible choices for earning credits
 * @param numCreditsMin the minimum number of credits needed to satisfy this major
 * @param numCreditsMax the maximum number of credits needed to satisfy this major
 * @param name the name of this section
 */
export interface RANGESection {
  type: "RANGE";
  requirements: ICourseRange;
  numCreditsMin: number;
  numCreditsMax: number;
  name: string;
}

/**
 * A Schedule
 * @param years a list of the years of this object
 * @param yearMap an object containing the year objects of this schedule
 * @param id the id number of this schedule
 */
export interface Schedule {
  years: number[];
  yearMap: {
    [key: number]: ScheduleYear;
  };
}

/**
 * A ScheduleYear, representing a year of a schedule
 * @param year the year
 * @param fall the fall term
 * @param spring the spring term
 * @param summer1 the summer 1 term
 * @param summer2 the summer 2 term
 * @param isSummerFull true if the summer1 should hold the classes for summer full.
 */
export interface ScheduleYear {
  year: number;
  fall: ScheduleTerm;
  spring: ScheduleTerm;
  summer1: ScheduleTerm;
  summer2: ScheduleTerm;
  isSummerFull: boolean;
}

/**
 * A ScheduleTerm, representing a term of a scheudle
 * @param season the season of this term
 * @param year the year of this term
 * @param termId the termId of this term
 * @param id the unique id of this term
 * @param status the status of this term, on coop, classes, or inactive.
 * @param classes a list of the classes of this term.
 */
export interface ScheduleTerm {
  season: Season | SeasonEnum;
  year: number;
  termId: number;
  status: Status | StatusEnum;
  classes: ScheduleCourse[];
}

/**
 * A course of a schedule
 * @param classId the classId of this course
 * @param subject the subject of this course
 * @param prereqs the prerequisites for this course
 * @param coreqs the corequisites for this course
 * @param numCreditsMin the minimum number of credits this course gives
 * @param numCreditsMax the maximum number of credits this course gives
 */
export interface ScheduleCourse {
  name: string;
  classId: string;
  subject: string;
  prereqs?: INEUAndPrereq | INEUOrPrereq;
  coreqs?: INEUAndPrereq | INEUOrPrereq;
  numCreditsMin: number;
  numCreditsMax: number;
  semester?: string | null;
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
 * An enumeration of the different kinds of transferable exams available.
 */
export enum TransferableExamTypeEnum {
  AP = "AP",
  IB = "IB",
}

export type TransferableExamType = keyof typeof TransferableExamTypeEnum;

/**
 * A transferable exam available for transfer credit, with the courses and semester
 * hours it counts for.
 * @param name the name of this exam
 * @param mappableCourses the NEU courses which this credit counts for
 * @param semesterHours the number of semester hours which this credit counts for
 */
export interface TransferableExam {
  name: string;
  type: TransferableExamType;
  mappableCourses: IRequiredCourse[];
  semesterHours: number;
}

/**
 * A subject group of AP exams available for transfer.
 * @param name the name of this group of exams
 * @param transferableExams an array of exams which are within this group
 */
export interface TransferableExamGroup {
  name: string;
  transferableExams: TransferableExam[];
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
  season: Season;
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
