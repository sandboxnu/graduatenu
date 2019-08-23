/**
 * Describes a generic Course offered by Northeastern.
 */
export interface Course {}

/**
 * Describes a completed Course with all of the course information 
 * provided by the Northeastern degree audit.
 * @param hon - True if this course is Honors, false otherwise.
 * @param subject - The subject of this course (such as Computer Science - "CS" - or Psychology)
 * @param classId - The number used to identify the course along with the subject.
 * @param name - The unique name of this course.
 * @param creditHours - The number of credit hours this course is worth.
 * @param season - The season during which this course was taken.
 * @param year - The year during which this course was taken.
 * @param termId - Northeastern's identifier for the term during which this course was taken.
 */
export interface CompleteCourse extends Course {
    hon: boolean,
    subject: string,
    classId: number,
    name: string,
    creditHours: number,
    season: string,
    year: number,
    termId: number
}

/**
 * A catch-all interface for the old requirement format.
 * This will be replaced with the future representations (found below).
 */
export interface OldRequirement {
    classId?: number,
    subject?: string,
    classId2?: number,
    list?: Array<OldRequirement>,
}


// These are future representations that are not yet used or implemented. They will be used in the future.

/**
 * A course(s) required for the student that have not yet been taken.
 * @param creditsRequired - The number of credit hours required to be taken.
 * @param courses - One or more courses able to be used to satisfy the credit requirement.
 */
export interface Requirement {
    creditsRequired: number,
    courses: Array<RequiredCourse>;
}

// TODO: with interfaces, the additional type parameter may not be necessary
/**
 * Describes a course with incomplete course information that has not yet been taken.\
 * @param type - The type of course this is.
 */
export interface RequiredCourse extends Course {
    type: string
}

/**
 * An 'OR' set of courses.
 * @param courses: A list of courses, one of which can be taken to satisfy this requirement.
 */
export interface OrCourse extends RequiredCourse {
    type: "OR",
    courses: Array<RequiredCourse>;
}

/**
 * An 'AND' series of courses.
 * @param courses - A list of courses, all of which must be taken to satisfy this requirement.
 */
export interface AndCourse extends RequiredCourse {
    type: "AND",
    courses: Array<RequiredCourse>;
}

/**
 * A range of courses within a single subject.
 * @param subject - The subject the course range is concerned with.
 * @param idRangeStart - The classId at the start of the course range.
 * @param idRangeEnd - The classId at the end of the course range.
 */
export interface CourseRange extends RequiredCourse {
    type: "RANGE";
    subject: string,
    idRangeStart: number,
    idRangeEnd: number
}

/**
 * A single required course.
 * @param classId - The numeric ID of the course.
 * @param subject - The subject that the course is concerned with, such as CS (Computer Science).
 */
export interface SimpleRequiredCourse extends RequiredCourse {
    type: "COURSE",
    classId: number,
    subject: string
}

/**
 * A list of two-character abbreviations for Northeastern's NUPath academic breadth requirements.
 */
export interface NUPaths extends Array<string>{};

/**
 * A list of courses already taken, complete with all of the information available on the degree audit.
 */
export interface CompleteCourses extends Array<CompleteCourse>{};

/**
 * A list of requirements as yet to be fulfilled.
 * The OldRequirement stipulation will be replaced with the Requirement interface in the future.
 */
export interface RequiredCourses extends Array<OldRequirement>{};

/**
 * Encapsulates the completed courses and NUPath requirements.
 * @param courses - Courses that the student has completed.
 * @param nupaths - NUPaths that the completed courses satisfy.
 */
export interface Completed {
    courses: CompleteCourses,
    nupaths: NUPaths
}

/**
 * Encapsulates the courses and NUPaths that will be satisfied by the student's current and/or scheduled courses.
 * @param courses - The courses the student is currently taking or has scheduled for.
 * @param nupaths - The NUPaths that will be satisfied by the in-progress courses.
 */
export interface IP {
    courses: CompleteCourses,
    nupaths: NUPaths
}

/**
 * Encapsulates the requirements to be met.
 * @param courses - The course requirements that have not yet been met.
 * @param nupaths - The NUPaths that have not yet been satisfied.
 */
export interface Requirements {
    courses: RequiredCourses,
    nupaths: NUPaths
}

/**
 * Encapsulates supplemental degree audit information that isn't a course or NUPath.
 * @param majors - The major(s) the student intends to obtain degrees for.
 * @param minors - The minor(s) the student intends to obtain.
 * @param auditYear - The year the degree audit was created.
 * @param gradDate - The expected graduation date of the student.
 */
export interface SupplementalInfo {
    majors: Array<string>,
    minors: Array<string>,
    auditYear: number,
    gradDate: string
}

/**
 * Represents an initial schedule representation as crafted via the degree audit.
 * @param completed - The completed courses and NUPaths.
 * @param inprogress - The in-progress courses and NUPaths.
 * @param requirements - The requirements for courses and NUPaths yet to be satisfied.
 * @param data - Supplemental information about the student's academic path.
 */
export interface InitialScheduleRep {
    completed: Completed,
    inprogress: IP,
    requirements: Requirements,
    data: SupplementalInfo
}