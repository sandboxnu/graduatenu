/**
 * HTML Degree Audit parser built for Northeastern University's degree audit.
 * By Jacob Chvatal for Northeastern Sandbox.
 *
 * Filters through a Northeastern degree audit, extracting its relevant information
 * to an easy to work with JSON file tracking major, graduation date,
 * classes and NUPaths taken and in progress as well as requirements to take.
 */

const fs = require('fs');

// location of the input file
const INPUT = '../Web\ Audit.html';

// location of the output file
const OUTPUT = 'parsed_audit.json';

/**
 * Gets the major associated with this degree audit.
 * @param json  The json file to which the major should be added.
 * @param line  The line at which the major can be found.
 */
function identify_major(json, line) {
    json.data.major = line.substring(line.search('>') + 1, line.search(' - Major'));
}

/**
 * Gets the year this degree audit was created.
 * @param json  The json file to which the major should be added.
 * @param line  The line containing the year.
 */
function get_year(json, line) {
    json.data.year = line.substring(line.search('CATALOG YEAR:') + 'CATALOG YEAR: '.length, line.search('CATALOG YEAR:') + 'CATALOG YEAR: '.length + 4);
}

/**
 * Gets the expected graduation date of the degree audit.
 * @param json  The json file to which this graduation date should be added.
 * @param line  The line which contains the graduation date desired.
 */
function get_grad_date(json, line) {
    json.data.grad = line.substring(line.search('GRADUATION DATE: ') + 'GRADUATION DATE: '.length, line.search('GRADUATION DATE: ') + 'GRADUATION DATE:  '.length + 7);
}

/**
 * Gets the NUPaths associated with this degree audit.
 * @param json  The json file to which the NUPaths should be added.
 * @param lines The lines to be scanned for the NUPaths.
 * @param i     The index of the line at which we currently stand.
 */
function get_nupaths(json, lines, i) {
    i++;
    while(contains(lines[i], '<br>')) {
        var toAdd = lines[i].substring(lines[i].indexOf("(") + 1, lines[i].indexOf("(") + 3)
        // omits bad stuff
        if(contains(toAdd, '<') || contains(toAdd, '>')) {
        }

        else if(contains(lines[i], 'OK')|| contains(lines[i], 'IP')) {
            json.completed.nupaths.push(toAdd);				
        }
        else if(contains(lines[i], 'IP')) {
            json.inprogress.nupaths.push(toAdd);
        }
        else if(contains(lines[i], 'NO')) {
            json.requirements.nupaths.push(toAdd);				
        }
        i++;
    }

}

/**
 * Adds the courses required by the degree audit to be taken to the JSON.
 * @param json  The json file to which the required courses should be added.
 * @param line  The line which contains these required courses.
 */
function add_courses_to_take(json, line) {
    var courseList = line.substring(line.search('Course List') + 13).replace('<font>', '').split('<font class="auditPreviewText">').join('').split('</font>').join('TO');
    var type = '';	
    for(var i = 0; i < courseList.length; i++) {

        var course = { };

        if(!(courseList[i] == ' ' || courseList[i] == '') && contains(courseList[i], '\w\w')) {
            course.attr = courseList[i].substring(0, 5); 
            course.number = courseList[i].substring(5, 10);	
            json.requirements.classes.push(course);
        }

        else {
            course.attr = type; 
            course.number = courseList[i];
            json.requirements.classes.push(course);
        }
    }

    console.log(courseList);
}

/**
 * Adds the courses taken so far to the current JSON file.
 * @param json  The JSON file to which the courses to be taken should be added.
 * @param line  The line which contains the course taken.
 */
function add_course_taken(json, line) {
    var course = {};
    var courseString = line.substring(line.search('(FL|SP|S1|S2)'));
    course.hon = contains(line, '\(HON\)');

    // ap courses that do not count for credit do not have numbers / attributes for corresponding college courses
    if(!contains(courseString, 'NO AP')) {
        course.attr = line.substring(line.search('(FL|SP|S1|S2)') + 5, line.search('(FL|SP|S1|S2)') + 9).replace(' ', '');
        course.number = courseString.substring(9, 14);
    }
    course.credithours = courseString.substring(18, 22);
    course.season = new RegExp('(FL|SP|S1|S2)').exec(line)[0];
    course.year = line.substring(line.search('(FL|SP|S1|S2)') + 2, line.search('(FL|SP|S1|S2)') + 4);

    if(contains(courseString, 'IP')) {
        json.inprogress.classes.push(course);			
    } else {
        json.completed.classes.push(course);
    }
}

/**
 * Converts an HTML degree audit file to a JSON file organizing the relevant information within.
 * @param input     The local location of the 'Degree Audit.html' input file.
 * @param output    The file path(including file name) where the degree audit should be written to.
 */
function audit_to_json(input, output) {
    fs.readFile(input, 'utf8', (err, data) => {
        if(err) {throw err;}
        // else, process the data

        json = { 
            completed: {
                classes:[],
                nupaths:[]
            },
            inprogress: {
                classes:[],
                nupaths:[]
            },
            requirements: {
                classes:[],
                nupaths:[]
            },
            data: {

            }
        };

        var lines = data.split('\n');
        for(var i = 0; i < lines.length; i++) {

            // finds major
            if(contains(lines[i], 'Major')) {
                identify_major(json, lines[i]);
            } 

            // finds year
            else if(contains(lines[i], 'CATALOG YEAR')) {
                get_year(json, lines[i]);
            }

            // finds graduation date
            else if(contains(lines[i], 'GRADUATION DATE:')) {
                get_grad_date(json, lines[i]);	
            }

            // finds all of the nupaths
            else if(contains(lines[i], 'No course taken pass/fail can be used toward NUpath.'))	{
                get_nupaths(json, lines, i);
            }

            // this part doesn't work! ends up in infinite loop ?? 
            // finds all of the courses required to be taken
            else if(contains(lines[i], 'Course List')) {
                add_courses_to_take(json, lines[i]);
            }

            // finds courses that have been taken
            else if(contains(lines[i], 'FL') || contains(lines[i], 'SP') ||contains(lines[i], 'S1') || contains(lines[i], 'S2')) {
                add_course_taken(json, lines[i]);
            }
        }

        console.log(json);

        fs.writeFileSync(output, JSON.stringify(json));
    });
}

function contains(text, lookfor) {
    return -1 != text.search(lookfor);
}

audit_to_json(INPUT, OUTPUT);

