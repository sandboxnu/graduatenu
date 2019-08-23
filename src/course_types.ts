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
 */
export interface RequiredCourses extends Array<Requirement>{};