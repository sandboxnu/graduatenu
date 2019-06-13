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

		// finds major
		if(contains(lines[i], 'Major')) {
			json.data.major = lines[i].substring(lines[i].search('>') + 1, lines[i].search(' - Major'));
		}
		// finds year
		if(contains(lines[i], 'CATALOG YEAR')) {
			json.data.year = lines[i].substring(lines[i].search('CATALOG YEAR:') + 'CATALOG YEAR: '.length, lines[i].search('CATALOG YEAR:') + 'CATALOG YEAR: '.length + 4);
		}

		if(contains(lines[i], 'GRADUATION DATE:')) {
			json.data.grad = lines[i].substring(lines[i].search('GRADUATION DATE: ') + 'GRADUATION DATE: '.length, lines[i].search('GRADUATION DATE: ') + 'GRADUATION DATE:  '.length + 7);

		}

		// finds all of the nupaths
		if(contains(lines[i], 'No course taken pass/fail can be used toward NUpath.'))	{
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


		// this part doesn't work! ends up in infinite loop ?? 
		else if(contains(lines[i], 'Course List')) {
			var courseList = lines[i].substring(lines[i].search('Course List') + 13).replace('<font>', '').split('<font class="auditPreviewText">').join('').split('</font>').join('TO');
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

			console.log(courseList);
		}

		//	else if(contains(lines[i], '<span class="auditPreviewText"><font class="auditPreviewText">       NUpath                                               ')) {

		// finds nupaths registered and adds them to course

		// get identifiable course info such as number
		// search completed courses for course
		// add nupath header associated with that course to that course;

		// this information can be filled in by pulling stuff from the web
		//		console.log("this is nupath stuff lol");
		// skip this stuff to avoid duplicate courses
		//		i+=9000;
		//	}

		// finds all courses taken, currently taking or scheduled to take
		else if(contains(lines[i], 'FL') || contains(lines[i], 'SP') ||contains(lines[i], 'S1') || contains(lines[i], 'S2')) {
			//TODO: this is hacky help
			var course = {};
			var courseString = lines[i].substring(lines[i].search('(FL|SP|S1|S2)'));
			course.hon = contains(lines[i], '\(HON\)');

			// ap courses that do not count for credit do not have numbers / attributes for corresponding college courses
			if(!contains(courseString, 'NO AP')) {
				course.attr = lines[i].substring(lines[i].search('(FL|SP|S1|S2)') + 5, lines[i].search('(FL|SP|S1|S2)') + 9).replace(' ', '');
				course.number = courseString.substring(9, 14);
			}
			course.credithours = courseString.substring(18, 22);
			course.season = new RegExp('(FL|SP|S1|S2)').exec(lines[i])[0];
			course.year = lines[i].substring(lines[i].search('(FL|SP|S1|S2)') + 2, lines[i].search('(FL|SP|S1|S2)') + 4);

			if(contains(courseString, 'IP')) {
				json.inprogress.classes.push(course);			
			} else {
				json.completed.classes.push(course);
			}
		}
	}

	console.log(json);

	fs.writeFileSync(OUTPUT, JSON.stringify(json));
});

function contains(text, lookfor) {
	return -1 != text.search(lookfor);
}

