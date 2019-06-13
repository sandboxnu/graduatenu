const fs = require('fs');

const INPUT = './Web\ Audit.html';
const OUTPUT = 'parsed_audit.json';

fs.readFile(INPUT, 'utf8', (err, data) => {
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
		addMajor(lines[i], json);
		addGradDate(lines[i], json);
		addAuditDate(lines[i], json);
		addNUPaths(lines[i], json);
		//addCourseRequirements(lines[i], json);
		addCoursesTaken(lines[i], json);
	}

	fs.writeFileSync(OUTPUT, JSON.stringify(json));
});

/**
 * Determines whether text matches a regular expression or another segment of text.
 */
function contains(text, lookfor) {
	return -1 != text.search(lookfor);
}

/**
 * Adds the student's major if it is found.
 */
function addMajor(text, json) {
	// finds major
	if(contains(text, 'Major')) {
		json.data.major = text.substring(text.search('>') + 1, text.search(' - Major'));
	}
}

/**
 * Adds the student's graduation date if it is present.
 */
function addGradDate(text, json) {
	if(contains(text, 'GRADUATION DATE:')) {
		json.data.grad = text.substring(text.search('GRADUATION DATE: ') + 'GRADUATION DATE: '.length, text.search('GRADUATION DATE: ') + 'GRADUATION DATE:  '.length + 7);
	}
}

/**
 * Add the date the degree audit was created if it is found.
 */
function addAuditDate(text, json) {
	// finds year
	if(contains(text, 'CATALOG YEAR')) {
		json.data.year = text.substring(text.search('CATALOG YEAR:') + 'CATALOG YEAR: '.length, text.search('CATALOG YEAR:') + 'CATALOG YEAR: '.length + 4);
	}
}

/**
 * Finds NUPath requirements and adds them to the json file.
 */
function addNUPaths(text, json) {
	// finds all of the nupaths
	if(contains(text, 'No course taken pass/fail can be used toward NUpath.'))	{
		i++;
		while(contains(text, '<br>')) {
			var toAdd = text.substring(text.indexOf("(") + 1, text.indexOf("(") + 3)
			// omits bad stuff
			if(contains(toAdd, '<') || contains(toAdd, '>')) {
			}

			else if(contains(text, 'OK')|| contains(lines[i], 'IP')) {
				json.completed.nupaths.push(toAdd);				
			}
			else if(contains(text, 'IP')) {
				json.inprogress.nupaths.push(toAdd);
			}
			else if(contains(text, 'NO')) {
				json.requirements.nupaths.push(toAdd);				
			}
			i++;
		}
	}
}

/**
 * Locates and adds text with course information of courses taken or currently taking.
 */
function addCoursesTaken(text, json) {
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
			json.inprogress.classes.push(course);			
		} else {
			json.completed.classes.push(course);
		}
	}
}

/**
 * Adds required courses and their information as is available.
 */
function addCourseRequirements(text, json) {
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
				json.requirements.classes.push(course);
			}

			else {
				course.attr = type; 
				course.number = courseList[i];
				json.requirements.classes.push(course);
			}
		}
	}
}
