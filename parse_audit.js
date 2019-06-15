const fs = require('fs');

const INPUT = '../Web\ Audit.html';
const OUTPUT = './parsed_audit.json';

// general idea: mapping from key to look for in a line of text to a function able to parse that text

/**
 * Represents an operator able to parse a HTML degree audit file from Northeastern University to a workable JSON file.
 */
class AuditParser {
	/**
	 * Parses the degree audit with the complete path to the Degree\ Audit.html file into a usable JSON object, storing the object.
	 */
	constructor(filepath) {
		// matches 'key' - string to look for in a line of the file - to the method that should be called 
		// the completed json file
		var json = JSON.parse(JSON.stringify({ 
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
			info: {
			}
		}));

		var auditParse = {
			'Major': this.addMajor,
			'GRADUATION DATE:': this.addGradDate,
			'CATALOG YEAR':this.addAuditDate,
			'No course taken pass/fail can be used toward NUPath.':this.addNUPaths,
			'(FL|SP|S1|S2)':this.addCoursesTaken,
			'Course List': this.addCourseRequirements
		};


		fs.readFile(filepath, 'utf8', (err, info) => {
			if(err) {throw err;}

			var lines = info.split('\n');
			for(var i = 0; i < lines.length; i++) {
				for(var key in auditParse) {
					if(contains(lines[i], key)) {
						// a bit hacky, as the nupath parser is dependent upon reading multiple lines
						// while the others operate utilizing just a single line of the audit
						if(contains(key, 'No course taken pass/fail')) {
							auditParse[key](json, lines, i);
						} else {
							auditParse[key](json, lines[i]);
						}
						break;
					}
				}
			}
		});
		fs.writeFileSync(OUTPUT, JSON.stringify(json));
	}


	/**
	 * Writes the generated JSON object to a file with the given name.
	 */
	writeFile(filename) {
		//		fs.writeFileSync(filename, json);
	}
	/**
	 * Adds the student's major if it is found.
	 */
	addMajor(json, text) {
		json.info.major = text.substring(text.search('>') + 1, text.search(' - Major'));
	}

	/**
	 * Adds the student's graduation date if it is present.
	 */
	addGradDate(json, text) {
		json.info.grad = text.substring(text.search('GRADUATION DATE: ') + 'GRADUATION DATE: '.length, text.search('GRADUATION DATE: ') + 'GRADUATION DATE:  '.length + 7);
	}

	/**
	 * Add the date the degree audit was created if it is found.
	 */
	addAuditDate(json, text) {
		json.info.year = text.substring(text.search('CATALOG YEAR:') + 'CATALOG YEAR: '.length, text.search('CATALOG YEAR:') + 'CATALOG YEAR: '.length + 4);
	}

	/**
	 * Finds NUPath requirements and adds them to the json file.
	 */
	addNUPaths(json, lines, i) {
		// finds all of the nupaths
		i++;
		while(contains(lines[i], '<br>')) {
			var toAdd = lines[i].substring(lines[i].indexOf("(") + 1, lines[i].indexOf("(") + 3)
			// omits bad stuff
			if(contains(toAdd, '<') || contains(toAdd, '>')) {
			}

			else if(contains(lines[i], 'OK')) {
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
		return;
	}

	/**
	 * Locates and adds text with course information of courses taken or currently taking.
	 */
	addCoursesTaken(json, text) {
		// finds all courses taken, currently taking or scheduled to take

		var course = {};
		var courseString = text.substring(text.search('(FL|SP|S1|S2)'));
		course.hon = contains(text, '\(HON\)');

		// AP courses that do not count for credit do not have numbers / attributes for corresponding college courses
		if(!contains(courseString, 'NO AP')) {
			course.attr = text.substring(text.search('(FL|SP|S1|S2)') + 5, text.search('(FL|SP|S1|S2)') + 9).replace(' ', '');
			course.number = courseString.substring(9, 14);
		}

		course.credithours = courseString.substring(18, 22);
		course.season = new RegExp('(FL|SP|S1|S2)').exec(text)[0];
		course.year = text.substring(text.search('(FL|SP|S1|S2)') + 2, text.search('(FL|SP|S1|S2)') + 4);

		if(contains(courseString, 'IP')) {
			json.inprogress.classes.push(course);			
		} else {
			json.completed.classes.push(course);
		}

		return;
	}
	/**
	 * Adds required courses and their information as is available.
	 */
	addCourseRequirements(json, text) {
		// this part doesn't work! ends up in infinite loop ?? 
		var courseList = text.substring(text.search('Course List') + 13).replace('<font>', '').split('<font class="auditPreviewText">').join('').split('</font>').join('TO');
		var type = '';	
		for(var i = 0; i < courseList.length; i++) {

			var course = { };
			if(contains(courseList[i], '\w\w') && !(courseList[i] == ' ' || courseList[i] == '')) {
				course.attr = courseList[i].substring(0, 5); 
				course.number = courseList[i].substring(5, 10);	
				json.requirements.classes.push(course);
			} else {
				course.attr = type; 
				course.number = courseList[i];
				json.requirements.classes.push(course);
			}
		}
		return;
	}
}


/**
 * Determines whether text matches a regular expression or another segment of text.
 */
function contains(text, lookfor) {
	return -1 != text.search(lookfor);
}

let jsonreader = new AuditParser(INPUT);
