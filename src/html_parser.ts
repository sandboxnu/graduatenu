/**
 * HTML Degree Audit parser built for Northeastern University's degree audit.
 * By Jacob Chvatal for Northeastern Sandbox.
 *
 * Filters through a Northeastern degree audit, extracting its relevant information
 * to an easy to work with JSON file tracking major, graduation date,
 * classes and NUPaths taken and in progress as well as requirements to take.
 */

import { ICompleteCourse, ICompleteCourses, IInitialScheduleRep, IOldRequirement, IRequiredCourses, NUPath  } from "./course_types";

class AuditToJSON {

    // protected designation is for possible access by external class in same package without export
    protected majors: string[];
    protected minors: string[];

    protected auditYear: number;
    protected gradDate: string;

    protected completeNUPaths: NUPath[];
    protected completeCourses: ICompleteCourses;

    protected ipNUPaths: NUPath[];
    protected ipCourses: ICompleteCourses;

    protected requiredNUPaths: NUPath[];
    protected requiredCourses: IRequiredCourses;

    /**
     * Extracts relevant data from a Northeastern degree audit.
     * @param audit - The stringified data contained within a 'Degree Audit.html' input file.
     */
    public constructor(audit: string) {
        // iterate line by line, identifying characteristics of the degree audit to
        // begin looking for specific elements of the degree audit to parse to JSON format if present

        // TODO: filter out all HTML tags here, making text identifiers independent of them
        const lines: string[] = audit.split("\n");

        for (let i: number = 0; i < lines.length; i++) {
            if (contains(lines[i], "(>OK |>IP |>NO )")) {
                this.get_nupaths(lines[i]);
            } else if (contains(lines[i], "(FL|SP|S1|S2|SM)")) {
                this.add_course_taken(lines[i]);
            } else if (contains(lines[i], "CATALOG YEAR")) {
                this.add_year(lines[i]);
            } else if (contains(lines[i], "Course List")) {
                this.add_courses_to_take(lines, i, "");
            } else if (contains(lines[i], "GRADUATION DATE:")) {
                this.add_grad_date(lines[i]);
            } else if (contains(lines[i], "Major")) {
                this.add_major(lines[i]);
            }
        }
    }

    /**
     * Encapsulates all of the information parsed from the degree
     * audit into a single JavaScript object.
     * @returns a JavaScript object with all of the degree audit data this class possesses.
     */
    public exportData(): IInitialScheduleRep {
        const json = {} as IInitialScheduleRep;
        json.completed = {
            courses: this.completeCourses,
            nupaths: this.completeNUPaths,
        };

        json.inprogress = {
            courses: this.ipCourses,
            nupaths: this.ipNUPaths,
        };

        json.requirements = {
            courses: this.requiredCourses,
            nupaths: this.requiredNUPaths,
        };

        json.data = {
            auditYear: this.auditYear,
            gradDate: this.gradDate,
            majors: this.majors,
            minors: this.minors,
        };

        return json;
    }

    /**
     * Gets the major associated with this degree audit.
     * @param line - The line at which the major can be found.
     */
    private add_major(line: string): void {
        this.majors.push(line.substring(line.search('\">') + 2, line.search(" - Major")));
    }

    /**
     * Gets the year this degree audit was created.
     * @param line - The line containing the year.
     */
    private add_year(line: string): void {
        const yearInd = line.search("CATALOG YEAR:") + "CATALOG YEAR: ".length;
        this.auditYear = parseInt(line.substring(yearInd, yearInd + 4), 10);
    }

    /**
     * Gets the expected graduation date of the degree audit.
     * @param line - The line which contains the graduation date desired.
     */
    private add_grad_date(line: string): void {
        const dateInd = line.search("GRADUATION DATE: ") + "GRADUATION DATE: ".length;
        this.gradDate = line.substring(dateInd, dateInd + 7);
    }

    /**
     * Gets a NUPath associated with this degree audit.
     * @param line - The line that contains a NUPath mentioned in the audit.
     */
    private get_nupaths(line: string): void {
        const nupathInd: number = line.indexOf("(") + 1;
        const toAdd = line.substring(nupathInd, nupathInd + 2) as NUPath;

        if (contains(line, ">OK ")) {
            if (!this.completeNUPaths.includes(toAdd)) {
                this.completeNUPaths.push(toAdd);
            }
        } else if (contains(line, ">IP ")) {
            if (!this.ipNUPaths.includes(toAdd)) {
                this.ipNUPaths.push(toAdd);
            }
        } else if (contains(line, ">NO ")) {
            if (!this.completeNUPaths.includes(toAdd)) {
                this.completeNUPaths.push(toAdd);
            }
        }
    }

    /**
     * Determines the termId parameter of a course with the season and year of the course.
     * @param season - The season of the course ('FL', 'SP', 'S1', 'S2', 'SM')
     * @param year - The year during which the course occurs (i.3. 2018, 2019)
     * @returns a six-digit integer representing the termId.
     * @throws err if the given year is not part of the enumeration specified.
     */
    private get_termid(season: string, year: number): number {
        // Makes the assumption that all years will be in the 21st century
        // As different technology will likely be used in 81 years, this is a valid assumption
        let termid: string = "20" + year;

        switch (season) {
            case "FL":
                // Spring term as per SearchNEU conventions
                termid = "20" + Number(year) + 1;
                termid = termid + "10"; break;
            case "SP":
                termid = termid + "30"; break;
            case "S1":
                termid = termid + "40"; break;
            case "S2":
                termid = termid + "60"; break;
            case "SM":
                termid = termid + "50"; break;
            default:
                throw new Error("The given season was not a member of the enumeration required.");
        }

        return parseInt(termid, 10);
    }

    /**
     * Determines whether an array already contains a course.
     * Two courses are the same when they have the same subject, classId (e.g. CS1200),
     * and are taken during the same term (e.g. 201810)
     * @param arr - The array of courses which could contain the course.
     * @param course - The course which could be in the array.
     * @returns whether the array contains the course.
     */
    private contains_course(arr: ICompleteCourse[], course: ICompleteCourse): boolean {
        for (const row of arr) {
            if (row.classId === course.classId && row.subject === course.subject
                && row.termId === course.termId && row.name === course.name) {
                return true;
            }
        }

        return false;
    }

    /**
     * Adds the courses taken so far to the current JSON file.
     * @param line - The line which contains the course taken.
     */
    private add_course_taken(line: string): void {
        const course = {} as ICompleteCourse;
        const courseString: string = line.substring(line.search("(FL|SP|S1|S2|SM)"));

         // ap courses that do not count for credit do not count for corresponding college courses
        if (contains(courseString, "(NO AP|NO IB)")) {
            return;
        }

        course.classId = parseInt(courseString.substring(9, 13), 10);
        course.creditHours = parseFloat(courseString.substring(18, 22));

        if (isNaN(course.classId) || course.classId == null
        || isNaN(course.creditHours) || course.creditHours == null) {
            return;
            // not a valid course if the course id is not a number
        }

        // identifies all of the course parameters with some spacing heuristics and regex magic
        course.hon = contains(line, "\(HON\)");
        course.subject = courseString.substring(4, 9).replace(/\s/g, "");
        course.name = courseString.substring(30, courseString.search("</font>"))
        .replace(/\s/g, "").replace("&amp;", "&").replace("(HON)", "").replace(";X", "");
        course.season = courseString.substring(0, 2);
        course.year = parseInt(courseString.substring(2, 4), 10);
        course.termId = this.get_termid(course.season, course.year);

        // determines whether the course is 'in progress' or completed and sorts accordingly
        if (contains(courseString, " IP ")) {
            if (!this.contains_course(this.ipCourses, course)) {
                this.ipCourses.push(course);
            }
        } else if (!this.contains_course(this.completeCourses, course)) {
            this.completeCourses.push(course);
        }
    }

     // TODO: fix this up
     // not going to elaborate upon types until completing the issue for fixing this function's format
    /**
     * Adds the courses required by the degree audit to be taken to the JSON.
     * @param line - The line which contains these required courses.
     */
    private add_courses_to_take(lines: string[], j: number, subjectType: string): void {
        const courseList = lines[j].substring(lines[j].search("Course List") + 13).replace(/<font>/g, "")
        .replace(/<font class="auditPreviewText">/g, "").replace(/\*\*\*\*/g, "").replace(/\s/g, "").split("</font>");

        // last two elements are always empty, as each of these lines ends with two </font> tags
        courseList.pop();
        courseList.pop();

        let type: string = subjectType;
        const courses = [];
        const seenEnumeration: boolean = false;
        for (let i: number = 0; i < courseList.length; i++) {
            const course = { } as IOldRequirement;

            // called on next line to pick up future courses if relevant
            if (contains(courseList[i], "&amp;")) {
                this.add_courses_to_take(lines, j + 1, type);
            }

            // remove the potential and sign
            courseList[i] = courseList[i].replace(/&amp;/g, "");

            // if the course is not empty [ it contains some info ]
            if (!(courseList[i] === "")) {

                const maybeCourseNumber = courseList[i].substring(0, 4);

                // THREE CASES
                // IT'S A NUMBER: IT IS A COURSE WITH THE PREVIOUS TYPE LISTED, use the type as previously defined'
                if (!isNaN(parseInt(maybeCourseNumber, 10))) {
                    // TODO: this parsing may not work
                    course.subject = type;

                    // determines whether we're looking at an enumeration
                    // (list of required courses of which 1+ should be taken)
                    if (contains(lines[j - 1], " of the following courses")) {

                        if (courses[courses.length - 1].list == null) {
                            courses[courses.length - 1].list = [courses[courses.length - 1].classId, maybeCourseNumber];
                            courses[courses.length - 1].num_required = lines[j - 1].substring(lines[j - 1].search("Complete") + "Complete (".length, lines[j - 1].search("Complete") + "Complete (".length + 1);
                            delete courses[courses.length - 1].classId;

                        } else {
                            courses[courses.length - 1].list.push(maybeCourseNumber);
                        }

                    } else if (contains(lines[j - 2], " of the following courses")) {

                        // there is always a line of white space after course requirements,
                        // so picking up a course number from a line two previous to this one is not an issue
                        if (courses[courses.length - 1].list == null) {
                            courses[courses.length - 1].list = [courses[courses.length - 1].classId, maybeCourseNumber];
                            courses[courses.length - 1].num_required = lines[j - 2].substring(lines[j - 2].search("Complete") + "Complete (".length, lines[j - 2].search("Complete") + "Complete (".length + 1);
                            delete courses[courses.length - 1].classId;
                        } else {
                            courses[courses.length - 1].list.push(maybeCourseNumber);
                        }

                        // else, it is another required course with the previous type
                    } else {
                        course.classId = parseInt(maybeCourseNumber, 10);
                        course.subject = type;
                        courses.push(course);
                    }
                } else if (maybeCourseNumber.substring(0, 2) === "TO") {
                    courses[courses.length - 1].classId2 = parseInt(courseList[i].substring(2, 7), 10);
                } else {
                    let subjEnd = 4;
                    while (contains(maybeCourseNumber.substring(0, subjEnd), "[0-9]")) {
                        subjEnd = subjEnd - 1;
                    }

                    type = maybeCourseNumber.substring(0, subjEnd);
                    course.subject = type;
                    course.classId = parseInt(courseList[i].substring(subjEnd, subjEnd + 4), 10);
                    courses.push(course);
                }
            }
        }
        this.requiredCourses = [].concat(this.requiredCourses, courses);
    }
}

/**
 * Determines whether a function contains a number.
 * @param {string} n  The String which could contain a number.
 * https://stackoverflow.com/questions/5778020/check-whether-an-input-string-contains-a-number-in-javascript#28813213
 */
function hasNumber(n: string): boolean {
    return !isNaN(parseFloat(n)) && isFinite(parseFloat(n));
}

/**
 * Determines whether a line of text contains a pattern to match.
 * @param text -The text which may contain the pattern.
 * @param lookfor - The text to match or pattern to look for in the code.
 * @returns true if the text contains or matches lookfor, false otherwise.
 */
function contains(text: string, lookfor: string): boolean {
    return -1 !== text.search(lookfor);
}

/**
 * Convenience function to collect relevant information from a degree audit to JS Object form.
 * @param path - The path to the degree audit HTML file.
 * @returns a JavaScript object with all of the relevant data from the degree audit.
 */
export function audit_to_json(path: string): IInitialScheduleRep {
    return new AuditToJSON(path).exportData();
}
