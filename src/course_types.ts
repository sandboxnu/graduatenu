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
    season: string;
    year: number;
    termId: number;
}

/**
 * A catch-all interface for the old requirement format.
 * This will be replaced with the future representations (found below).
 */
export interface IOldRequirement {
    classId?: number;
    subject?: string;
    classId2?: number;
    list?: IOldRequirement[];
}

// These are future representations that are not yet used or implemented. They will be used in the future.
/**
 * A course(s) required for the student that have not yet been taken.
 * @param creditsRequired - The number of credit hours required to be taken.
 * @param courses - One or more courses able to be used to satisfy the credit requirement.
 */
export interface IRequirement {
    creditsRequired: number;
    courses: IRequiredCourse[];
}

// TODO: with interfaces, the additional type parameter may not be necessary
/**
 * Describes a course with incomplete course information that has not yet been taken.\
 * @param type - The type of course this is.
 */
export interface IRequiredCourse {
    type: string;
}

/**
 * An 'OR' set of courses.
 * @param courses: A list of courses, one of which can be taken to satisfy this requirement.
 */
export interface IOrCourse extends IRequiredCourse {
    type: "OR";
    courses: IRequiredCourse[];
}

/**
 * An 'AND' series of courses.
 * @param courses - A list of courses, all of which must be taken to satisfy this requirement.
 */
export interface IAndCourse extends IRequiredCourse {
    type: "AND";
    courses: IRequiredCourse[];
}

/**
 * A range of courses within a single subject.
 * @param subject - The subject the course range is concerned with.
 * @param idRangeStart - The classId at the start of the course range.
 * @param idRangeEnd - The classId at the end of the course range.
 */
export interface ICourseRange extends IRequiredCourse {
    type: "RANGE";
    subject: string;
    idRangeStart: number;
    idRangeEnd: number;
}

/**
 * A single required course.
 * @param classId - The numeric ID of the course.
 * @param subject - The subject that the course is concerned with, such as CS (Computer Science).
 */
export interface ISimpleRequiredCourse extends IRequiredCourse {
    type: "COURSE";
    classId: number;
    subject: string;
}

/**
 * A list of courses already taken, complete with all of the information available on the degree audit.
 */
export interface ICompleteCourses extends Array<ICompleteCourse> {}

/**
 * A list of requirements as yet to be fulfilled.
 * The OldRequirement stipulation will be replaced with the Requirement interface in the future.
 */
export interface IRequiredCourses extends Array<IOldRequirement> {}

/**
 * Encapsulates the completed courses and NUPath requirements.
 * @param courses - Courses that the student has completed.
 * @param nupaths - NUPaths that the completed courses satisfy.
 */
export interface ICompleted {
    courses: ICompleteCourses;
    nupaths: NUPath[];
}

/**
 * Encapsulates the courses and NUPaths that will be satisfied by the student's current and/or scheduled courses.
 * @param courses - The courses the student is currently taking or has scheduled for.
 * @param nupaths - The NUPaths that will be satisfied by the in-progress courses.
 */
export interface IP {
    courses: ICompleteCourses;
    nupaths: NUPath[];
}

/**
 * Encapsulates the requirements to be met.
 * @param courses - The course requirements that have not yet been met.
 * @param nupaths - The NUPaths that have not yet been satisfied.
 */
export interface IRequirements {
    courses: IRequiredCourses;
    nupaths: NUPath[];
}

/**
 * Encapsulates supplemental degree audit information that isn't a course or NUPath.
 * @param majors - The major(s) the student intends to obtain degrees for.
 * @param minors - The minor(s) the student intends to obtain.
 * @param auditYear - The year the degree audit was created.
 * @param gradDate - The expected graduation date of the student.
 */
export interface ISupplementalInfo {
    majors: string[];
    minors: string[];
    auditYear: number;
    gradDate: string;
}

/**
 * Represents an initial schedule representation as crafted via the degree audit.
 * @param completed - The completed courses and NUPaths.
 * @param inprogress - The in-progress courses and NUPaths.
 * @param requirements - The requirements for courses and NUPaths yet to be satisfied.
 * @param data - Supplemental information about the student's academic path.
 */
export interface IInitialScheduleRep {
    completed: ICompleted;
    inprogress: IP;
    requirements: IRequirements;
    data: ISupplementalInfo;
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
    [key: string]: any;
}

/**
 * A SearchNEU-style classMap. Holds course data for a certain termId.
 * Keys are in format: "neu.edu/<termId>/<subject>/<classId>" with value type INEUCourse.
 * Contains additional misc. information. See raw JSON.
 * @param termId The termId of this term.
 */
export interface INEUClassMap {
    termId: number;
    [key: string]: any;
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
    classId: string;
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

/**
 * A SearchNEU AND prerequisite object.
 * @param type The type of the SearchNEU prerequisite.
 * @param values The prerequisites that must be completed for this prereq. to be marked as done.
 */
export interface INEUAndPrereq {
    type: "and";
    values: Array<INEUAndPrereq | INEUOrPrereq | INEUPrereqCourse>;
}

/**
 * A SearchNEU OR prerequisite object.
 * @param type The type of the SearchNEU prerequisite.
 * @param values The prerequisites of which one must be completed for this prerequisite to be marked as done.
 */
export interface INEUOrPrereq {
    type: "or";
    values: Array<INEUAndPrereq | INEUOrPrereq | INEUPrereqCourse>;
}

/**
 * A SearchNEU prerequisite course.
 * @param classId The course number of this prerequisite course.
 * @param subject The subject of this prerequisite course.
 */
export interface INEUPrereqCourse {
    classId: string;
    subject: string;
}

// types for json_parser.ts

/**
 * A Schedule.
 * @param completed The completed courses.
 * @param scheduled The scheduled courses.
 */
export interface ISchedule {
    completed: ICompleteCourse[];
    scheduled: IScheduleCourse[];
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
