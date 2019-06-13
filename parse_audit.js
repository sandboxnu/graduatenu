const fs = require('fs');

const INPUT = './Web\ Audit.html';
const OUTPUT = 'parsed_audit.json';


/**
 * Represents an operator able to parse a HTML degree audit file from Northeastern University to a workable JSON file.
 */
class AuditParser {

	/**
	 * Parses the degree audit with the given file name into a usable JSON object, storing the object.
	 */
	constructor(filename) {
		this.json = { 
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

		fs.readFile(filename, 'utf8', (err, data) => {
			if(err) {throw err;}
			// else, process the data


			var lines = data.split('\n');
			for(var i = 0; i < lines.length; i++) {
				addMajor(lines[i]);
				addGradDate(lines[i]);
				addAuditDate(lines[i]);
				addNUPaths(lines[i]);
				//addCourseRequirements(lines[i], json);
				addCoursesTaken(lines[i]);
			}
	});
	}

	/**
	 * Determines whether text matches a regular expression or another segment of text.
	 */
	contains(text, lookfor) {
		return -1 != text.search(lookfor);
	}


	/**
	 * Writes the generated JSON object to a file with the given name.
	 */
	writeFile(filename) {
			fs.writeFileSync(filename, JSON.stringify(this.json));
		
	}
	/**
	 * Adds the student's major if it is found.
	 */
	addMajor(text) {
		// finds major
		if(contains(text, 'Major')) {
			this.json.data.major = text.substring(text.search('>') + 1, text.search(' - Major'));
		}
	}


	/**
	 * Adds the student's graduation date if it is present.
	 */
	addGradDate(text) {
		if(contains(text, 'GRADUATION DATE:')) {
			this.json.data.grad = text.substring(text.search('GRADUATION DATE: ') + 'GRADUATION DATE: '.length, text.search('GRADUATION DATE: ') + 'GRADUATION DATE:  '.length + 7);
		}
	}

	/**
	 * Add the date the degree audit was created if it is found.
	 */
	addAuditDate(text) {
		// finds year
		if(contains(text, 'CATALOG YEAR')) {
			this.json.data.year = text.substring(text.search('CATALOG YEAR:') + 'CATALOG YEAR: '.length, text.search('CATALOG YEAR:') + 'CATALOG YEAR: '.length + 4);
		}
	}

	/**
	 * Finds NUPath requirements and adds them to the json file.
	 */
	addNUPaths(text) {
		// finds all of the nupaths
		if(contains(text, 'No course taken pass/fail can be used toward NUpath.'))	{
			i++;
			while(contains(text, '<br>')) {
				var toAdd = text.substring(text.indexOf("(") + 1, text.indexOf("(") + 3)
				// omits bad stuff
				if(contains(toAdd, '<') || contains(toAdd, '>')) {
				}

				else if(contains(text, 'OK')|| contains(lines[i], 'IP')) {
					this.json.completed.nupaths.push(toAdd);				
				}
				else if(contains(text, 'IP')) {
					this.json.inprogress.nupaths.push(toAdd);
				}
				else if(contains(text, 'NO')) {
					this.json.requirements.nupaths.push(toAdd);				
				}
				i++;
			}
		}
	}

	/**
	 * Locates and adds text with course information of courses taken or currently taking.
	 */
	addCoursesTaken(text) {
		// finds all courses taken, currently taking or scheduled to take
		if(contains(text, 'FL') || contains(text, 'SP') ||contains(text, 'S1') || contains(text, 'S2')) {
			//TODO: this is hacky help
			var course = {};
			var courseString = text.substring(text.search('(FL|SP|S1|S2)'));
			course.hon = contains(text, '\(HON\)');

			// ap courses that do not count for credit do not have numbers / attributes for corresponding college courses
			if(!contains(courseString, 'NO AP')) {
				course.attr = text.substring(text.search('(FL|SP|S1|S2)') + 5, text.search('(FL|SP|S1|S2)') + 9).replace(' ', '');
				course.number = courseString.substring(9, 14);
			}
			course.credithours = courseString.substring(18, 22);
			course.season = new RegExp('(FL|SP|S1|S2)').exec(text)[0];
			course.year = text.substring(text.search('(FL|SP|S1|S2)') + 2, text.search('(FL|SP|S1|S2)') + 4);

			if(contains(courseString, 'IP')) {
				this.json.inprogress.classes.push(course);			
			} else {
				this.json.completed.classes.push(course);
			}
		}
	}

	/**
	 * Adds required courses and their information as is available.
	 */
	addCourseRequirements(text) {
		// this part doesn't work! ends up in infinite loop ?? 
		if(contains(text, 'Course List')) {
			var courseList = text.substring(text.search('Course List') + 13).replace('<font>', '').split('<font class="auditPreviewText">').join('').split('</font>').join('TO');
			var type = '';	
			for(var i = 0; i < courseList.length; i++) {

				var course = { };

				if(courseList[i] == ' ' || courseList[i] == '') {

				}

				else if(contains(courseList[i], '\w\w')) {
					course.attr = courseList[i].substring(0, 5); 
					course.number = courseList[i].substring(5, 10);	
					this.json.requirements.classes.push(course);
				}

				else {
					course.attr = type; 
					course.number = courseList[i];
					this.json.requirements.classes.push(course);
				}
			}
		}
	}
}

const jsonreader = new AuditParser(INPUT);
jsonreader.writeFile(OUTPUT);
