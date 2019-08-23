
/**
 * HTML Degree Audit parser built for Northeastern University's degree audit.
 * By Jacob Chvatal for Northeastern Sandbox.
 *
 * Filters through a Northeastern degree audit, extracting its relevant information
 * to an easy to work with JSON file tracking major, graduation date,
 * classes and NUPaths taken and in progress as well as requirements to take.
 */

import * as fs from "fs";

interface AuditMapping {
    [key:string] : Function;
}

class AuditToJSON {

    // double majors?
    protected majors: Array<string>;
    protected minors: Array<string>;

    protected auditYear: number;
    protected gradDate: string;

    protected completeNUPaths: Array<string>;
    protected completeCourses: Array<Course>;

    protected ipNUPaths: Array<string>;
    protected ipCourses: Array<Course>;

    protected requiredNUPaths: Array<string>;
    protected requiredCourses: Array<Course>;

    /**
     * Extracts relevant data from a Northeastern degree audit.
     * @param {String} audit     The stringified data contained within a 'Degree Audit.html' input file.
     */
    public constructor(audit: string) {
        // iterate line by line, identifying characteristics of the degree audit to
        // begin looking for specific elements of the degree audit to parse to JSON format if present
        let lines :Array<string> = audit.split('\n');

        let auditMapping: AuditMapping = {
            'Major': this.add_major,
            'CATALOG YEAR': this.add_year,
            'GRADUATION DATE:': this.add_grad_date,
            '(FL|SP|S1|S2|SM)': this.add_course_taken,
            '(>OK |>IP |>NO )': this.get_nupaths,
            'Course List': this.add_courses_to_take
        }

        // If a key matches an indicator associated with a desired piece of info,
        // call its associated function to retrieve its info
        for(let i: number = 0; i < lines.length; i++) {
            Object.keys(auditMapping).forEach((key: string) => {
                if(contains(lines[i], key)) {
                    auditMapping[key](lines[i]);
                }
            })
        }
    }

    /**
     * Gets the major associated with this degree audit.
     * @param {string} line  The line at which the major can be found.
     */
    private add_major(line: string) :void {
        this.majors.push(line.substring(line.search('\">') + 2, line.search(' - Major'))); 
    }

    /**
     * Gets the year this degree audit was created.
     * @param {String} line     The line containing the year.
     */
    private add_year(line: String) :void {
        this.auditYear = parseInt(line.substring(line.search('CATALOG YEAR:') + 'CATALOG YEAR: '.length, line.search('CATALOG YEAR:') + 'CATALOG YEAR: '.length + 4));
    }

    /**
     * Gets the expected graduation date of the degree audit.
     * @param {String} line The line which contains the graduation date desired.
     */
    private add_grad_date(line: string) :void {
        this.gradDate = line.substring(line.search('GRADUATION DATE: ') + 'GRADUATION DATE: '.length, line.search('GRADUATION DATE: ') + 'GRADUATION DATE:  '.length + 7);
    }

    /**
     * Gets a NUPath associated with this degree audit.
     * @param {string} line  The line that contains a NUPath mentioned in the audit.
     */
    private get_nupaths(line: string) :void {
        let nupathInd: number = line.indexOf("(") + 1;
        let toAdd = line.substring(nupathInd, nupathInd + 2);
        
        if(!json.completed.nupaths.includes(toAdd)) {
            switch(toAdd) {
                case '>OK ':
                    json.completed.nupaths.push(toAdd);	
                case '>IP ':
                    json.inprogress.nupaths.push(toAdd);
                case '>NO ':
                    json.requirements.nupaths.push(toAdd);
            }
        }
    }

    /**
     * Determines the termId parameter of a course with the season and year of the course.
     * @param {string} season   The season of the course ('FL', 'SP', 'S1', 'S2', 'SM')
     * @param {number} year     The year during which the course occurs (i.3. 2018, 2019)
     * @return {number}         A six-digit integer representing the termId.
     * @throws err              if the given year is not part of the enumeration specified.
     */
    private get_termid(season: string, year: number) :number {
        // Makes the assumption that all years will be in the 21st century
        // As different technology will likely be used in 81 years, this is a valid assumption
        let termid :string = "20" + year;
        
        /**
        let termToNumber = {
            "FL": "10", // Fall term: associated year is considered the same year as the following 
            "SP": "30", // Spring term
            "S1": "40", // Summer 1 term
            "S2": "60", // Summer 2 term
            "SM": "50"  // Full Summer term (typically reserved for graduate courses)
        };
         */

        switch(season) {
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
                throw "The given season was not a member of the enumeration required."
        }

        return parseInt(termid);
    }

    /**
     * Determines whether an array already contains a course.
     * Two courses are the same when they have the same subject, classId (e.g. CS1200), and are taken during the same term (e.g. 201810)
     * @param {Array} arr   The array of courses which could contain the course.
     * @param {Object} course The course which could be in the array.
     * @return whether the array contains the course.
     */
    private contains_course(arr, course) {
        for(let i: number = 0; i < arr.length; i++) {
            if(arr[i].classId === course.classId && arr[i].subject === course.subject && arr[i].termId === course.termId && arr[i].name === course.name) { 
                return true;
            }
        }

        return false;
}

    /**
    * Adds the courses taken so far to the current JSON file.
    * @param {string} line  The line which contains the course taken.
    */
    private add_course_taken(line: string) :void {
        let course = {} as TakenCourse;
        let courseString = line.substring(line.search('(FL|SP|S1|S2|SM)'));
        course.hon = contains(line, '\(HON\)');

        // ap courses that do not count for credit do not count for corresponding college courses
        if(contains(courseString, '(NO AP|NO IB)')) {
            return;
        }    

        course.subject = courseString.substring(4, 9).replace(/\s/g, '');
        course.classId = courseString.substring(9, 13);
        course.name = courseString.substring(30, courseString.search('</font>')).replace(/\s/g, '').replace('&amp;', '&').replace('(HON)','').replace(';X','');

        // locates the rest of the parameters with some regex magic
        course.creditHours = courseString.substring(18, 22);
        course.season = courseString.substring(0, 2);
        course.year = courseString.substring(2, 4);

        course.termId = get_termid(course.season, course.year);
        // determines whether the course is 'in progress' or completed and sorts accordingly

        if(isNaN(course.classId) || course.classId == null || isNaN(course.creditHours) || course.credithours == null) {
            return; 
            // not a valid course if the course id is not a number
        }

        if(contains(courseString, ' IP ')) {
        if(!contains_course(json.inprogress.classes, course)) {
            json.inprogress.classes.push(course);		
        }
        
        } else if(!contains_course(json.completed.classes, course)) {
            json.completed.classes.push(course);    
        }
    }

     // TODO: fix this up
    /**
     * Adds the courses required by the degree audit to be taken to the JSON.
     * @param {String} line  The line which contains these required courses.
     */
    private add_courses_to_take(lines, j, subjectType) {
        let courseList = lines[j].substring(lines[j].search('Course List') + 13).replace(/<font>/g, '').replace(/<font class="auditPreviewText">/g, '').replace(/\*\*\*\*/g, '').replace(/\s/g, '').split('</font>');

        // last two elements are always empty, as each of these lines ends with two </font> tags
        courseList.pop();
        courseList.pop();

        let type: string = subjectType;
        let courses = [];
        let seenEnumeration: boolean = false;
        for(let i: number = 0; i < courseList.length; i++) {
            let course = { } as RequiredCourse;

            // called on next line to pick up future courses if relevant
            if(contains(courseList[i],'&amp;')) {
                add_courses_to_take(json, lines, j + 1, type);
            }

            // remove the potential and sign
            courseList[i] = courseList[i].replace(/&amp;/g, '');

            // if the course is not empty [ it contains some info ]
            if(!(courseList[i] === '')) {

                let maybeCourseNumber = courseList[i].substring(0, 4);

                // THREE CASES
                // IT'S A NUMBER: IT IS A COURSE WITH THE PREVIOUS TYPE LISTED, use the type as previously defined'
                if(!isNaN(maybeCourseNumber)) {
                    course.subject = type;

                    // determines whether we're looking at an enumeration (list of required courses of which 1+ should be taken)
                    if(contains(lines[j - 1], ' of the following courses')) {

                        if(courses[courses.length - 1].list == null) {
                            courses[courses.length - 1].list = [courses[courses.length - 1].classId, maybeCourseNumber];
                            courses[courses.length - 1].num_required = lines[j - 1].substring(lines[j - 1].search('Complete') + 'Complete ('.length, lines[j - 1].search('Complete') + 'Complete ('.length+1); 
                            delete courses[courses.length - 1].classId;

                        } else {
                            courses[courses.length - 1].list.push(maybeCourseNumber);
                        }

                    } else if(contains(lines[j - 2], ' of the following courses')) { 

                        // there is always a line of white space after course requirements, so picking up a course number
                        // from a line two previous to this one is not an issue
                        if(courses[courses.length - 1].list == null) {
                            courses[courses.length - 1].list = [courses[courses.length - 1].classId, maybeCourseNumber];
                            courses[courses.length - 1].num_required = lines[j - 2].substring(lines[j - 2].search('Complete') + 'Complete ('.length, lines[j - 2].search('Complete') + 'Complete ('.length+1); 
                            delete courses[courses.length - 1].classId;
                        } else {
                            courses[courses.length - 1].list.push(maybeCourseNumber);
                        }

                        // else, it is another required course with the previous type
                    } else {
                        course.classId = maybeCourseNumber;
                        course.subject = type;
                        courses.push(course);
                    }
                }

                // ITS 'TO12' OR TO AND 2 NUMBERS: a range of courses
                else if(maybeCourseNumber.substring(0, 2) === 'TO') {
                    courses[courses.length - 1].classId2 = courseList[i].substring(2, 7);
                }

                // its part of a course name along with part of the number (e.g. ENGL or CS10))
                else {
                    let subjEnd = 4;
                    while(contains(maybeCourseNumber.substring(0, subjEnd), '[0-9]')) {
                        subjEnd = subjEnd - 1;
                    }

                    type = maybeCourseNumber.substring(0, subjEnd);
                    course.subject = type;
                    course.classId = courseList[i].substring(subjEnd, subjEnd + 4);
                    courses.push(course);
                }
            }
        }
        json.requirements.classes = [].concat(json.requirements.classes, courses);
    }
}


/**
 * Determines whether a function contains a number.
 * @param {string} n  The String which could contain a number.
 * https://stackoverflow.com/questions/5778020/check-whether-an-input-string-contains-a-number-in-javascript#28813213
 */
function hasNumber(n: string) :boolean {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Determines whether a line of text contains a pattern to match.
 * @param {string} text			The text which may contain the pattern.
 * @param {string} lookfor	    The text to match or pattern to look for in the code.
 * @return {boolean} 	        True if the text contains or matches lookfor, false otherwise.
 */
function contains(text: string, lookfor: string): boolean {
    return -1 != text.search(lookfor);
}

module.exports.audit_to_json = audit_to_json;