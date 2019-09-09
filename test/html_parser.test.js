const html_parser = require('../src/html_parser.ts');
const fs = require('fs');

const cs_json = html_parser.audit_to_json(fs.readFileSync("./test/mock_audits/cs_audit.html", "utf-8"));
const cs_json2 = html_parser.audit_to_json(fs.readFileSync("./test/mock_audits/cs_audit2.html", "utf-8"));
const cs_json3 = html_parser.audit_to_json(fs.readFileSync("./test/mock_audits/cs_audit3.html", "utf-8"));
const cs_math_json = html_parser.audit_to_json(fs.readFileSync("./test/mock_audits/cs_math_grad_audit.html", "utf-8"));
const me_json = html_parser.audit_to_json(fs.readFileSync("./test/mock_audits/me_audit.html", "utf-8"));

const json_ex = [];
json_ex.push(cs_json);
json_ex.push(cs_math_json);
json_ex.push(cs_json2);
//json_ex.push(cs_json3);
//json_ex.push(me_json);

test('Confirms that the generated JavaScript object is of the proper form', () => {
    for(let i = 0; i < json_ex.length; i++) {
        expect(json_ex[i]).toBeDefined();

        // data
        expect(json_ex[i].data).toBeDefined();
        expect(json_ex[i].data.gradDate).toBeInstanceOf(Date);

        expect(json_ex[i].data.auditYear).toBeDefined();
        expect(json_ex[i].data.auditYear).toBeGreaterThan(2017);

        // completed
        expect(json_ex[i].completed).toBeDefined();
        expect(json_ex[i].completed.courses).toBeDefined();
        expect(Array.isArray(json_ex[i].completed.courses)).toBeTruthy();
        expect(json_ex[i].completed.nupaths).toBeDefined(); expect(Array.isArray(json_ex[i].completed.nupaths)).toBeTruthy(); 

        // in progress
        expect(json_ex[i].inprogress).toBeDefined();
        expect(json_ex[i].inprogress.courses).toBeDefined();
        expect(Array.isArray(json_ex[i].inprogress.courses)).toBeTruthy();
        expect(json_ex[i].inprogress.nupaths).toBeDefined();
        expect(Array.isArray(json_ex[i].inprogress.nupaths)).toBeTruthy();

        // to be completed
        expect(json_ex[i].completed).toBeDefined();
        expect(json_ex[i].completed.courses).toBeDefined();
        expect(Array.isArray(json_ex[i].completed.courses)).toBeTruthy();
        expect(json_ex[i].completed.nupaths).toBeDefined();
        expect(Array.isArray(json_ex[i].completed.nupaths)).toBeTruthy();
    }
});

test('Ensures that all of the complete course information is of the form required.', () => {
    for(let i = 0; i < json_ex.length; i++) {
        for(let j = 0; j < json_ex[i].completed.courses.length; j++) {
            expect(json_ex[i].completed.courses[j]).toBeDefined();
            expect(json_ex[i].completed.courses[j].hon).toBeDefined();
            expect(typeof json_ex[i].completed.courses[j].hon === typeof true).toBeTruthy();
            expect(json_ex[i].completed.courses[j].subject).toBeDefined();
            expect(json_ex[i].completed.courses[j].subject).toMatch(/^[A-Z]{2,4}$/);
            expect(json_ex[i].completed.courses[j].name).toBeDefined();

            expect(json_ex[i].completed.courses[j].classId).toBeDefined();
            expect(json_ex[i].completed.courses[j].classId).toBeGreaterThan(999);
            expect(json_ex[i].completed.courses[j].classId).toBeLessThan(8000);

            expect(json_ex[i].completed.courses[j].creditHours).toBeDefined();
            expect(json_ex[i].completed.courses[j].creditHours % 1 === 0).toBeTruthy();
            expect(json_ex[i].completed.courses[j].season).toBeDefined();
            expect(json_ex[i].completed.courses[j].season).toMatch(/FL|SP|S1|S2|SM/);
            expect(json_ex[i].completed.courses[j].year).toBeDefined();
            expect(json_ex[i].completed.courses[j].year).toBeGreaterThan(0);
            expect(json_ex[i].completed.courses[j].termId).toBeDefined();
            expect("" + json_ex[i].completed.courses[j].termId).toMatch(/^20\d\d[1-6]0$/);
        }
    }
});

test('Ensures that all of the in-progress course information is of the form required.', () => {
    for(let i = 0; i < json_ex.length; i++) {
        for(let j = 0; j < json_ex[i].inprogress.courses.length; j++) { 
            expect(json_ex[i].inprogress.courses[j]).toBeDefined(); 
            expect(json_ex[i].inprogress.courses[j].hon).toBeDefined();
            expect(typeof json_ex[i].inprogress.courses[j].hon === typeof true).toBeTruthy();
            expect(json_ex[i].inprogress.courses[j].subject).toBeDefined();
            expect(json_ex[i].inprogress.courses[j].subject).toMatch(/^[A-Z]{2,4}$/);
            expect(json_ex[i].inprogress.courses[j].name).toBeDefined();
            expect(json_ex[i].inprogress.courses[j].classId).toBeDefined();
            expect(json_ex[i].inprogress.courses[j].classId).toBeGreaterThan(999);
            expect(json_ex[i].inprogress.courses[j].classId).toBeLessThan(8000);
            expect(json_ex[i].inprogress.courses[j].creditHours % 1 === 0).toBeTruthy();
            expect(json_ex[i].inprogress.courses[j].season).toBeDefined();
            expect(json_ex[i].inprogress.courses[j].season).toMatch(/FL|SP|S1|S2|SM/);
            expect(json_ex[i].inprogress.courses[j].year).toBeDefined();
            expect(json_ex[i].inprogress.courses[j].year).toBeGreaterThan(0);
            expect(json_ex[i].inprogress.courses[j].termId).toBeDefined();
            expect("" + json_ex[i].inprogress.courses[j].termId).toMatch(/^20\d\d[1-6]0$/);
        }
    }
});

test('Ensures that all of the courses required to take are of the form required.', () => {
    for(let i = 0; i < json_ex.length; i++) {
        for(let j = 0; j < json_ex[i].requirements.courses.length; j++) { 
            expect(json_ex[i].requirements.courses[j].subject).toMatch(/^[A-Z]{2,4}$/);

            if(typeof json_ex[i].requirements.courses[j].classId  === 'undefined') {

                expect(json_ex[i].requirements.courses[j].list).toBeDefined();
                expect(json_ex[i].requirements.courses[j].num_required).toBeDefined();

                for(let k = 0; k < json_ex[i].requirements.courses[j].list.length; k++) {
                    // assumes that no more than 9 courses will be required
                    expect(json_ex[i].requirements.courses[j].list[k]).toBeGreaterThan(999);   
                    expect(json_ex[i].requirements.courses[j].list[k]).toBeLessThan(8000);
                }
            } else {
                expect(json_ex[i].requirements.courses[j].classId).toBeGreaterThan(999);
                expect(json_ex[i].requirements.courses[j].classId).toBeLessThan(8000);
                if(typeof json_ex[i].requirements.courses[j].classId2 !== 'undefined') {
                    expect(json_ex[i].requirements.courses[j].classId2).toBeGreaterThan(999);
                    expect(json_ex[i].requirements.courses[j].classId2).toBeLessThan(8000);
                }
            }
        }
    }
});

test('Ensures that the required NUPaths are of the form required.', () => {
    for(let i = 0; i < json_ex.length; i++) {
        for(let j = 0; j < json_ex[i].requirements.nupaths.length; j++) { 
            expect(json_ex[i].requirements.nupaths[j]).toBeDefined(); 
            expect(json_ex[i].requirements.nupaths[j]).toMatch(/ND|EI|IC|FQ|SI|AD|DD|ER|WF|WD|WI|EX|CE/);
        }
    }
});

test('Ensures that the in-progress NUPaths are of the form required.', () => {
    for(let i = 0; i < json_ex.length; i++) {
        for(let j = 0; j < json_ex[i].inprogress.nupaths.length; j++) { 
            expect(json_ex[i].inprogress.nupaths[j]).toBeDefined(); 
            expect(json_ex[i].inprogress.nupaths[j]).toMatch(/ND|EI|IC|FQ|SI|AD|DD|ER|WF|WD|WI|EX|CE/);
        }
    }
});

test('Ensures that the completed NUPaths are of the form required.', () => {
    for(let i = 0; i < json_ex.length; i++) {
        for(let j = 0; j < json_ex[i].completed.nupaths.length; j++) { 
            expect(json_ex[i].completed.nupaths[j]).toBeDefined(); 
            expect(json_ex[i].completed.nupaths[j]).toMatch(/ND|EI|IC|FQ|SI|AD|DD|ER|WF|WD|WI|EX|CE/);
        }
    }
});

test('Ensures that the audits do not contain duplicate completed courses.', () => {
    for(let i = 0; i < json_ex.length; i++) {
        let duplicates = false;
        for(let j = 0; j < json_ex[i].completed.courses.length; j++) { 
            let course = json_ex[i].completed.courses[j];
            let seen = false;

            for(let k = 0; k < json_ex[i].completed.courses.length; k++) {
                if(course.classId === json_ex[i].completed.courses[k].classId && course.subject === json_ex[i].completed.courses[k].subject && course.termId === json_ex[i].completed.courses[k].termId && course.name === json_ex[i].completed.courses[k].name) { 
                    if(!seen) {
                        seen = true;
                    } else {
                        duplicates = true;
                    }
                }
            }

            expect(duplicates).toBeFalsy();
            duplicates = false;
        }
    }
});

test('Ensures that the audits do not contain duplicate in-progress courses.', () => {
    for(let i = 0; i < json_ex.length; i++) {
        let duplicates = false;
        for(let j = 0; j < json_ex[i].inprogress.courses.length; j++) { 
            let course = json_ex[i].inprogress.courses[j];
            let seen = false;

            for(let k = 0; k < json_ex[i].inprogress.courses.length; k++) {
                if(course.classId === json_ex[i].inprogress.courses[k].classId && course.subject === json_ex[i].inprogress.courses[k].subject && course.termId === json_ex[i].inprogress.courses[k].termId) { 
                    if(!seen) {
                        seen = true;
                    } else {
                        duplicates = true;
                    }
                }
            }

            expect(duplicates).toBeFalsy();
            duplicates = false;
        }
    }   
});

test('Ensures that the audits do not contain duplicate required courses.', () => {

});

test('Ensures that the audits do not contain duplicate completed NUPaths.', () => {
    for(let i = 0; i < json_ex.length; i++) {
        let duplicates = false;
        for(let j = 0; j < json_ex[i].completed.nupaths.length; j++) { 
            let seen = false;
            let nupath = json_ex[i].completed.nupaths[j];
            for(let k = 0; k < json_ex[i].completed.nupaths.length; k++) {
                if(json_ex[i].completed.nupaths[k] === nupath) { 
                    if(!seen) {
                        seen = true;
                    } else {
                        duplicates = true;
                    }
                }
            }

            expect(duplicates).toBeFalsy();
            duplicates = false;
        }
    }
});

test('Ensures that the audits do not contain duplicate in-progress NUPaths.', () => {
    for(let i = 0; i < json_ex.length; i++) {
        let duplicates = false;
        for(let j = 0; j < json_ex[i].inprogress.nupaths.length; j++) { 
            let seen = false;
            let nupath = json_ex[i].inprogress.nupaths[j];
            for(let k = 0; k < json_ex[i].inprogress.nupaths.length; k++) {
                if(json_ex[i].inprogress.nupaths[k] === nupath) { 
                    if(!seen) {
                        seen = true;
                    } else {
                        duplicates = true;
                    }
                }
            }

           expect(duplicates).toBeFalsy();
            duplicates = false;
        }
    }
});

test('Ensures that the audits do not contain duplicate required NUPaths.', () => {
    for(let i = 0; i < json_ex.length; i++) {
        let duplicates = false;
        for(let j = 0; j < json_ex[i].requirements.nupaths.length; j++) { 
            let seen = false;
            let nupath = json_ex[i].requirements.nupaths[j];
            for(let k = 0; k < json_ex[i].requirements.nupaths.length; k++) {
                if(json_ex[i].requirements.nupaths[k] === nupath) { 
                    if(!seen) {
                        seen = true;
                    } else {
                        duplicates = true;
                    }
                }
            }

            expect(duplicates).toBeFalsy();
            duplicates = false;
        }
    }
});

test('Ensures that each audit contains all of the NUPath requirements.', () => {
    for(let i = 0; i < json_ex.length; i++) {
        let nupaths = ["ND","EI","IC","FQ","SI","AD","DD","ER","WF","WD","WI","EX","CE"];
        for(let j = 0; j < json_ex[i].completed.nupaths.length; j++) {
            let index = nupaths.indexOf(json_ex[i].completed.nupaths[j]);
            if (index > -1) {
                nupaths.splice(index, 1);
            }
        }

        for(let j = 0; j < json_ex[i].inprogress.nupaths.length; j++) {
            let index = nupaths.indexOf(json_ex[i].inprogress.nupaths[j]);
            if (index > -1) {
                nupaths.splice(index, 1);
            }
        }
        for(let j = 0; j < json_ex[i].requirements.nupaths.length; j++) {
            let index = nupaths.indexOf(json_ex[i].requirements.nupaths[j]);
            if (index > -1) {
                nupaths.splice(index, 1);
            }
        }

        expect(nupaths.length === 0).toBeTruthy();
    }
});

test('Verifies that the CS degree audit is properly reproduced by the code', () => {
    expect(cs_json).toStrictEqual(
        {  
            "completed":{  
                "courses":[  
                    {  
                        "hon":false,
                        "subject":"CS",
                        "classId":1200,
                        "name": "LeadershipSkillDevelopment",
                        "creditHours":1.00,
                        "season":"FL",
                        "year":18,
                        "termId":201910
                    },
                    {  
                        "hon":true,
                        "subject":"CS",
                        "classId":1800,
                        "name": "DiscreteStructures",
                        "creditHours":4.00,
                        "season":"FL",
                        "year":18,
                        "termId":201910
                    },
                    {  
                        "hon":true,
                        "subject":"CS",
                        "classId":1802,
                        "name": "SeminarforCS1800",
                        "creditHours":1.00,
                        "season":"FL",
                        "year":18,
                        "termId":201910
                    },
                    {  
                        "hon":false,
                        "subject":"CS",
                        "classId":2500,
                        "name": "FundamentalsofComputerSci",
                        "creditHours":4.00,
                        "season":"FL",
                        "year":18,
                        "termId":201910
                    },
                    {  
                        "hon":false,
                        "subject":"CS",
                        "classId":2501,
                        "name": "LabforCS2500",
                        "creditHours":1.00,
                        "season":"FL",
                        "year":18,
                        "termId":201910
                    },
                    {  
                        "hon":false,
                        "subject":"CS",
                        "classId":2510,
                        "name": "FundamentalsofComputerSci",
                        "creditHours":4.00,
                        "season":"SP",
                        "year":19,
                        "termId":201930
                    },
                    {  
                        "hon":false,
                        "subject":"CS",
                        "classId":2511,
                        "name": "LabforCS2510",
                        "creditHours":1.00,
                        "season":"SP",
                        "year":19,
                        "termId":201930
                    },
                    {  
                        "hon":false,
                        "subject":"CS",
                        "classId":2800,
                        "name": "LogicandComputation",
                        "creditHours":4.00,
                        "season":"SP",
                        "year":19,
                        "termId":201930
                    },
                    {  
                        "hon":false,
                        "subject":"CS",
                        "classId":2801,
                        "name": "LabforCS2800",
                        "creditHours":1.00,
                        "season":"SP",
                        "year":19,
                        "termId":201930
                    },
                    {  
                        "hon":false,
                        "subject":"CS",
                        "classId":3200,
                        "name": "DatabaseDesign",
                        "creditHours":4.00,
                        "season":"SP",
                        "year":19,
                        "termId":201930
                    },
                    {  
                        "hon":false,
                        "subject":"CS",
                        "classId":3950,
                        "name": "IntrotoCSResearch",
                        "creditHours":2.00,
                        "season":"SP",
                        "year":19,
                        "termId":201930
                    },
                    {  
                        "hon":false,
                        "subject":"MATH",
                        "classId":1341,
                        "name": "CalculusBC++",
                        "creditHours":4.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {  
                        "hon":false,
                        "subject":"MATH",
                        "classId":1342,
                        "name": "CalculusBC++",
                        "creditHours":4.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {  
                        "hon":false,
                        "subject":"MATH",
                        "classId":2331,
                        "name": "LinearAlgebra",
                        "creditHours":4.00,
                        "season":"FL",
                        "year":18,
                        "termId":201910
                    },
                    {  
                        "hon":true,
                        "subject":"PHIL",
                        "classId":1145,
                        "name": "TechandHumanValues",
                        "creditHours":4.00,
                        "season":"FL",
                        "year":18,
                        "termId":201910
                    },
                    {  
                        "hon":false,
                        "subject":"BIOL",
                        "classId":1111,
                        "name": "AP:BIOLOGY",
                        "creditHours":4.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {  
                        "hon":false,
                        "subject":"BIOL",
                        "classId":1112,
                        "name": "AP:BIOLOGY",
                        "creditHours":1.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {  
                        "hon":false,
                        "subject":"BIOL",
                        "classId":1113,
                        "name": "AP:BIOLOGY",
                        "creditHours":4.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {  
                        "hon":false,
                        "subject":"BIOL",
                        "classId":1114,
                        "name": "AP:BIOLOGY",
                        "creditHours":1.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {  
                        "hon":false,
                        "subject":"ENGW",
                        "classId":1111,
                        "name": "AP:ENGLANG/COMP,ENGL",
                        "creditHours":8.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {  
                        "hon":false,
                        "subject":"CS",
                        "classId":1990,
                        "name": "AP:COMPSCIA",
                        "creditHours":4.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {  
                        "hon":false,
                        "subject":"ECON",
                        "classId":1115,
                        "name": "AP:ECON-MAC",
                        "creditHours":4.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {  
                        "hon":false,
                        "subject":"ECON",
                        "classId":1116,
                        "name": "AP:ECON-MIC",
                        "creditHours":4.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {  
                        "hon":false,
                        "subject":"HIST",
                        "classId":1110,
                        "name": "AP:WORLDHISTORY",
                        "creditHours":4.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {  
                        "hon":false,
                        "subject":"MATH",
                        "classId":2280,
                        "name": "AP:STATISTICS",
                        "creditHours":4.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {  
                        "hon":false,
                        "subject":"PHYS",
                        "classId":1151,
                        "name": "AP:PHYSICSC-MECH",
                        "creditHours":3.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {  
                        "hon":false,
                        "subject":"PHYS",
                        "classId":1152,
                        "name": "AP:PHYSICSC-MECH",
                        "creditHours":1.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {  
                        "hon":false,
                        "subject":"PHYS",
                        "classId":1153,
                         "name": "AP:PHYSICSC-MECH",
                        "creditHours":1.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {  
                        "hon":false,
                        "subject":"PSYC",
                        "classId":1101,
                        "name": "AP:PSYCHOLOGY",
                        "creditHours":4.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {  
                        "hon":true,
                        "subject":"HONR",
                        "classId":1102,
                        "name": "HonorsDiscovery",
                        "creditHours":1.00,
                        "season":"FL",
                        "year":18,
                        "termId":201910
                    }
                ],
                "nupaths":[  
                    "ND",
                    "FQ",
                    "SI",
                    "AD",
                    "ER",
                    "WF",
                ]
            },
            "inprogress":{  
                "courses":[  
                    {  
                        "hon":false,
                        "subject":"CS",
                        "classId":3000,
                        "name": "Algorithms&Data",
                        "creditHours":4.00,
                        "season":"FL",
                        "year":19,
                        "termId":202010
                    },
                    {  
                        "hon":false,
                        "subject":"CS",
                        "classId":3500,
                        "name": "Object-OrientedDesign",
                        "creditHours":4.00,
                        "season":"S1",
                        "year":19,
                        "termId":201940
                    },
                    {  
                        "hon":false,
                        "subject":"CS",
                        "classId":3650,
                        "name": "ComputerSystems",
                        "creditHours":4.00,
                        "season":"FL",
                        "year":19,
                        "termId":202010
                    },
                    {  
                        "hon":false,
                        "subject":"CS",
                        "classId":4100,
                        "name": "ArtificialIntelligence",
                        "creditHours":4.00,
                        "season":"FL",
                        "year":19,
                        "termId":202010
                    },
                    {  
                        "hon":false,
                        "subject":"CS",
                        "classId":4950,
                        "name": "MachineLearnResearchSemina",
                        "creditHours":1.00,
                        "season":"FL",
                        "year":19,
                        "termId":202010
                    },
                    {  
                        "hon":false,
                        "subject":"MATH",
                        "classId":3081,
                        "name": "ProbabilityandStatistics",
                        "creditHours":4.00,
                        "season":"FL",
                        "year":19,
                        "termId":202010
                    },
                    {  
                        "hon":false,
                        "subject":"EECE",
                        "classId":2160,
                        "name": "EmbeddedDesEnablingRobotic",
                        "creditHours":4.00,
                        "season":"S1",
                        "year":19,
                        "termId":201940
                    }
                ],
                "nupaths":[  
                    "CE"
                ]
            },
            "requirements":{  
                "courses":[  
                    {  
                        "subject":"CS",
                        "classId":1210
                    },
                    {  
                        "subject":"CS",
                        "classId":3700
                    },
                    {  
                        "subject":"CS",
                        "classId":3800
                    },
                    {  
                        "subject":"CS",
                        "classId":4400
                    },
                    {  
                        "subject":"CS",
                        "classId":4500
                    },
                    {  
                        "subject":"THTR",
                        "classId":1170
                    },
                    {  
                        "subject":"CS",
                        "classId":2500,
                        "classId2":7999
                    },
                    {  
                        "subject":"DS",
                        "classId":2000,
                        "classId2":7999
                    },
                    {  
                        "subject":"ENGW",
                        "list":[  
                            3302,
                            3308,
                            3315
                        ],
                        "num_required":1
                    }
                ],
                "nupaths":[  
                    "EI",
                    "IC",
                    "DD",
                    "WI",
                    "WD",
                    "EX"
                ]
            },
            "data":{  
                "gradDate":new Date(2022, 8, 20),
                "auditYear":2019,
                "majors":["Computer Science"],
                "minors":[]
            }
        });
});
test('Verifies that the second Computer Science degree audit is properly reproduced by the code', () => {
    expect(cs_json2).toStrictEqual(
        {
            "completed":{
                "courses": [ 
                    { hon: false,
                        subject: 'CS',
                        classId: 1200,
                        "name": "LeadershipSkillDevelopment",
                        creditHours: 1.00,
                        season: 'FL',
                        year: 18,
                        termId: 201910
                    },
                    { 
                        hon: false,
                        subject: 'CS',
                        classId: 1800,
                        "name": "DiscreteStructures",
                        creditHours: 4.00,
                        season: 'FL',
                        year: 18,
                        termId: 201910
                    },
                    { 
                        hon: false,
                        subject: 'CS',
                        classId: 1802,
                        "name": "SeminarforCS1800",
                        creditHours: 1.00,
                        season: 'FL',
                        year: 18,
                        termId: 201910
                    },
                    { 
                        hon: false,
                        subject: 'CS',
                        classId: 2500,
                        "name": "FundamentalsofComputerSci",
                        creditHours: 4.00,
                        season: 'FL',
                        year: 18,
                        termId: 201910
                    },
                    { 
                        hon: false,
                        subject: 'CS',
                        classId: 2501,
                        "name": "LabforCS2500",
                        creditHours: 1.00,
                        season: 'FL',
                        year: 18,
                        termId: 201910
                    },
                    { 
                        hon: false,
                        subject: 'CS',
                        classId: 2510,
                        name: "FundamentalsofComputerSci",
                        creditHours: 4.00,
                        season: 'SP',
                        year: 19,
                        termId: 201930 
                    },
                    { 
                        hon: false,
                        subject: 'CS',
                        classId: 2511,
                        name: "LabforCS2510",
                        creditHours: 1.00,
                        season: 'SP',
                        year: 19,
                        termId: 201930
                    },
                    { 
                        hon: false,
                        subject: 'CS',
                        classId: 2800,
                         name: "LogicandComputation",
                        creditHours: 4.00,
                        season: 'SP',
                        year: 19,
                        termId: 201930
                    },
                    { 
                        hon: false,
                        subject: 'CS',
                        classId: 2801,
                        "name": "LabforCS2800",
                        creditHours: 1.00,
                        season: 'SP',
                        year: 19,
                        termId: 201930
                    },
                    { 
                        hon: false,
                        subject: 'CS',
                        classId: 2550,
                        "name": "FoundationsofCybersecurity",
                        creditHours: 4.00,
                        season: 'SP',
                        year: 19,
                        termId: 201930
                    },
                    { 
                        hon: false,
                        subject: 'MATH',
                        classId: 1341,
                        "name": "CalculusBC++",
                        creditHours: 4.00,
                        season: 'S2',
                        year: 18,
                        termId: 201860
                    },
                    { 
                        hon: false,
                        subject: 'MATH',
                        classId: 1342,
                        "name": "CalculusBC++",
                        creditHours: 4.00,
                        season: 'S2',
                        year: 18,
                        termId: 201860
                    },
                    { 
                        hon: false,
                        subject: 'MATH',
                        classId: 3081,
                        "name": "ProbabilityandStatistics",
                        creditHours: 4.00,
                        season: 'S1',
                        year: 19,
                        termId: 201940
                    },
                    { 
                        hon: false,
                        subject: 'EECE',
                        classId: 2160,
                        "name": "EmbeddedDesEnablingRobotic",
                        creditHours: 4.00,
                        season: 'S1',
                        year: 19,
                        termId: 201940
                    },
                    { 
                        hon: false,
                        subject: 'PHYS',
                        classId: 1151,
                        "name": "AP:PHYSICSC-MECH",
                        creditHours: 3.00,
                        season: 'S2',
                        year: 18,
                        termId: 201860
                    },
                    { 
                        hon: false,
                        subject: 'PHYS',
                        classId: 1152,
                        "name": "AP:PHYSICSC-MECH",
                        creditHours: 1.00,
                        season: 'S2',
                        year: 18,
                        termId: 201860
                    },
                    { 
                        hon: false,
                        subject: 'PHYS',
                        classId: 1153,
                        "name": "AP:PHYSICSC-MECH",
                        creditHours: 1.00,
                        season: 'S2',
                        year: 18,
                        termId: 201860
                    },
                    { 
                        hon: false,
                        subject: 'PHYS',
                        classId: 1155,
                        "name": "PhysicsforEngineering2",
                        creditHours: 3.00,
                        season: 'FL',
                        year: 18,
                        termId: 201910
                    },
                    { 
                        hon: false,
                        subject: 'PHYS',
                        classId: 1156,
                        "name": "LabforPHYS1155",
                        creditHours: 1.00,
                        season: 'FL',
                        year: 18,
                        termId: 201910
                    },
                    { 
                        hon: false,
                        subject: 'PHYS',
                        classId: 1157,
                        "name": "InteractLearnforPHYS1155",
                        creditHours: 1.00,
                        season: 'FL',
                        year: 18,
                        termId: 201910 
                    },
                    { 
                        hon: false,
                        subject: 'ENGW',
                        classId: 1111,
                        "name": "AP:ENGLANG/COMP",
                        creditHours: 4.00,
                        season: 'S2',
                        year: 18,
                        termId: 201860
                    },
                    { 
                        hon: false,
                        subject: 'CS',
                        classId: 1990,
                        "name": "AP:COMPSCIA",
                        creditHours: 4.00,
                        season: 'S2',
                        year: 18,
                        termId: 201860 
                    },
                    { 
                        hon: false,
                        subject: 'CS',
                        classId: 1990,
                        "name": "AP:COMPSCIPRINCI",
                        creditHours: 4.00,
                        season: 'S2',
                        year: 18,
                        termId: 201860
                    },
                    { 
                        hon: false,
                        subject: 'HIST',
                        classId: 1130,
                        "name": "AP:USHISTORY",
                        creditHours: 4.00,
                        season: 'S2',
                        year: 18,
                        termId: 201860
                    },
                    { 
                        hon: false,
                        subject: 'MATH',
                        classId: 2321,
                        "name": "Calculus3forSci/Engr",
                        creditHours: 4.00,
                        season: 'FL',
                        year: 18,
                        termId: 201910 
                    },
                    { 
                        hon: true,
                        subject: 'HONR',
                        classId: 1310,
                        "name": "IllusionsofReality",
                        creditHours: 4.00,
                        season: 'SP',
                        year: 19,
                        termId: 201930 
                    } 
                ],
                "nupaths": [ 
                    'ND', 
                    'IC', 
                    'FQ', 
                    'AD', 
                    'DD', 
                    'WF'
                ]
            },
            "inprogress":{
                "courses": [ 
                    { 
                        hon: false,
                        subject: 'CS',
                        classId: 3000,
                        "name": "Algorithms&Data",
                        creditHours: 4.00,
                        season: 'S2',
                        year: 19,
                        termId: 201960 
                    },
                    { 
                        hon: false,
                        subject: 'CS',
                        classId: 3500,
                        "name": "Object-OrientedDesign",
                        creditHours: 4.00,
                        season: 'FL',
                        year: 19,
                        termId: 202010
                    },
                    { 
                        hon: false,
                        subject: 'CS',
                        classId: 3650,
                        "name": "ComputerSystems",
                        creditHours: 4.00,
                        season: 'FL',
                        year: 19,
                        termId: 202010
                    },
                    { 
                        hon: false,
                        subject: 'CS',
                        classId: 3800,
                        "name": "TheoryofComputation",
                        creditHours: 4.00,
                        season: 'FL',
                        year: 19,
                        termId: 202010 
                    },
                    { 
                        hon: false,
                        subject: 'MATH',
                        classId: 2331,
                        "name": "LinearAlgebra",
                        creditHours: 4.00,
                        season: 'S2',
                        year: 19,
                        termId: 201960 
                    },
                    { 
                        hon: true,
                        subject: 'PHIL',
                        classId: 1145,
                        "name": "TechandHumanValues",
                        creditHours: 4.00,
                        season: 'FL',
                        year: 19,
                        termId: 202010 
                    } 
                ],
                "nupaths":[
                    'SI',
                    'ER' 
                ]
            },
            "requirements":{
                "courses": [ 
                    { 
                        subject: 'CS', 
                        classId: 1210
                    },
                    { 
                        subject: 'CS', 
                        classId: 3700 
                    },
                    { 
                        subject: 'CS', 
                        classId: 4400
                    },
                    { 
                        subject: 'CS', 
                        classId: 4500 
                    },
                    { 
                        subject: 'THTR', 
                        classId: 1170 
                    },
                    { 
                        subject: 'CS', 
                        list: [ 4100, 4300, 4410,4150,4550,4991],
                        num_required: 1
                    },
                    {
                        subject:'IS',
                        classId:4900
                    },
                    { 
                        subject: 'CS', 
                        classId: 2500, 
                        classId2: 7999 
                    },
                    { 
                        subject: 'DS', 
                        classId: 2000, 
                        classId2: 7999 
                    },
                    { 
                        subject: 'ENGW',
                        list: [ 3302, 3308, 3315 ],
                        num_required: 1 
                    } 
                ],
                "nupaths": [ 
                    'EI', 
                    'WI', 
                    'WD', 
                    'EX', 
                    'CE' 
                ]
            },
            "data":{  
                "gradDate":new Date(2022, 8, 20),
                "auditYear":2019,
                "majors":["Computer Science"],
                "minors":[]
            }
        });
});

test('Verifies that the CS Math degree audit is properly reproduced by the code', () => {
    expect(cs_math_json).toStrictEqual(
        {  
            "completed":{  
                "courses":[  
                    {  
                        "hon":false,
                        "subject":"CS",
                        "classId":1200,
                         "name": "LeadershipSkillDevelopment",
                        "creditHours":1.00,
                        "season":"FL",
                        "year":18,
                        "termId":201910
                    },
                    {  
                        "hon":true,
                        "subject":"CS",
                        "classId":1800,
                        "name": "DiscreteStructures",
                        "creditHours":4.00,
                        "season":"FL",
                        "year":18,
                        "termId":201910
                    },
                    {  
                        "hon":true,
                        "subject":"CS",
                        "classId":1802,
                        "name": "SeminarforCS1800",
                        "creditHours":1.00,
                        "season":"FL",
                        "year":18,
                        "termId":201910
                    },
                    {  
                        "hon":false,
                        "subject":"CS",
                        "classId":2500,
                        "name": "FundamentalsofComputerSci",
                        "creditHours":4.00,
                        "season":"FL",
                        "year":18,
                        "termId":201910
                    },
                    {  
                        "hon":false,
                        "subject":"CS",
                        "classId":2501,
                        "name": "LabforCS2500",
                        "creditHours":1.00,
                        "season":"FL",
                        "year":18,
                        "termId":201910
                    },
                    {  
                        "hon":false,
                        "subject":"CS",
                        "classId":4993,
                        "name": "IndependentStudy",
                        "creditHours":4.00,
                        "season":"SP",
                        "year":19,
                        "termId":201930
                    },
                    {  
                        "hon":false,
                        "subject":"MATH",
                        "classId":1341,
                        "name": "CalculusI",
                        "creditHours":0.00,
                        "season":"FL",
                        "year":16,
                        "termId":201710
                    },
                    {  
                        "hon":false,
                        "subject":"MATH",
                        "classId":1342,
                        "name": "CalculusII",
                        "creditHours":5.00,
                        "season":"SP",
                        "year":17,
                        "termId":201730
                    },
                    {  
                        "hon":false,
                        "subject":"MATH",
                        "classId":2321,
                        "name": "CalculusIII",
                        "creditHours":5.00,
                        "season":"FL",
                        "year":17,
                        "termId":201810
                    },
                    {  
                        "hon":false,
                        "subject":"MATH",
                        "classId":1341,
                        "name": "AP:CALCULUSAB",
                        "creditHours":4.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {  
                        "hon":false,
                        "subject":"MATH",
                        "classId":2331,
                        "name": "LinearAlgebra",
                        "creditHours":4.00,
                        "season":"SP",
                        "year":19,
                        "termId":201930
                    },
                    {  
                        "hon":false,
                        "subject":"MATH",
                        "classId":3081,
                        "name": "ProbabilityandStatistics",
                        "creditHours":4.00,
                        "season":"SP",
                        "year":19,
                        "termId":201930
                    },
                    {  
                        "hon":true,
                        "subject":"PHIL",
                        "classId":1145,
                        "name": "TechandHumanValues",
                        "creditHours":4.00,
                        "season":"FL",
                        "year":18,
                        "termId":201910
                    },
                    {  
                        "hon":false,
                        "subject":"ENGW",
                        "classId":1111,
                        "name": "AP:ENGLANG/COMP",
                        "creditHours":0.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {
                        "classId": 1111,
                        "creditHours": 4.00,
                        "hon": false,
                        "name": "ENGLISHA:Literature",
                        "season": "S2",
                        "subject": "ENGW",
                        "termId": 201860,
                        "year": 18,
                    },
                    {
                        "classId": 1990,
                        "creditHours": 3.00,
                        "hon": false,
                        "name": "Trigonometry",
                        "season": "SM",
                        "subject": "MATH",
                        "termId": 201650,
                        "year": 16,
                    },
                    {  
                        "hon":false,
                        "subject":"MATH",
                        "classId":1990,
                        "name": "PrecalculusAlgebra",
                        "creditHours":3.00,
                        "season":"SM",
                        "year":16,
                        "termId":201650
                    },
                    {  
                        "hon":false,
                        "subject":"ENGL",
                        "classId":3584,
                        "name": "HarryPotterandtheImaginat",
                        "creditHours":3.00,
                        "season":"SM",
                        "year":17,
                        "termId":201750
                    },
                    {  
                        "hon":false,
                        "subject":"ARTS",
                        "classId":1990,
                        "name": "Ceramics:WheelThrowing",
                        "creditHours":3.00,
                        "season":"SP",
                        "year":18,
                        "termId":201830
                    },
                    {  
                        "hon":false,
                        "subject":"CS",
                        "classId":1990,
                        "name": "AP:COMPSCIA",
                        "creditHours":4.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {  
                        "hon":false,
                        "subject":"ENGL",
                        "classId":1990,
                        "name": "ENGLISHA:Literature",
                        "creditHours":4.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {  
                        "hon":false,
                        "subject":"ENVR",
                        "classId":1101,
                        "name": "AP:ENV.SCIENCE",
                        "creditHours":4.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {  
                        "hon":false,
                        "subject":"HIST",
                        "classId":1130,
                        "name": "AP:USHISTORY",
                        "creditHours":0.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {
                        "classId": 1130,
                        "creditHours": 4.00,
                        "hon": false,
                        "name": "HistoryAmericas",
                        "season": "S2",
                        "subject": "HIST",
                        "termId": 201860,
                        "year": 18,
                    },
                    {  
                        "hon":false,
                        "subject":"PHYS",
                        "classId":1145,
                        "name": "AP:PHYSICS1",
                        "creditHours":4.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {  
                        "hon":false,
                        "subject":"PHYS",
                        "classId":1146,
                        "name": "AP:PHYSICS1",
                        "creditHours":1.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {  
                        "hon":false,
                        "subject":"PHYS",
                        "classId":1161,
                        "name": "IB:PHYSICS",
                        "creditHours":4.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {  
                        "hon":false,
                        "subject":"PHYS",
                        "classId":1162,
                        "name": "IB:PHYSICS",
                        "creditHours":1.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {  
                        "hon":false,
                        "subject":"PHYS",
                        "classId":1165,
                        "name": "IB:PHYSICS",
                        "creditHours":4.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {  
                        "hon":false,
                        "subject":"PHYS",
                        "classId":1166,
                        "name": "IB:PHYSICS",
                        "creditHours":1.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {  
                        "hon":false,
                        "subject":"SOCL",
                        "classId":1990,
                        "name": "AP:HUMANGEOGRAPHY",
                        "creditHours":4.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {  
                        "hon":false,
                        "subject":"SPNS",
                        "classId":1990,
                        "name": "AP:SPANISHLANG",
                        "creditHours":4.00,
                        "season":"S2",
                        "year":18,
                        "termId":201860
                    },
                    {  
                        "hon":false,
                        "subject":"ARTF",
                        "classId":1121,
                        "name": "ConceptualDrawing",
                        "creditHours":4.00,
                        "season":"SP",
                        "year":19,
                        "termId":201930
                    },
                    {  
                        "hon":false,
                        "subject":"CS",
                        "classId":3950,
                        "name": "IntrotoCSResearch",
                        "creditHours":2.00,
                        "season":"SP",
                        "year":19,
                        "termId":201930
                    },
                    {  
                        "hon":true,
                        "subject":"HONR",
                        "classId":1102,
                        "name": "HonorsDiscovery",
                        "creditHours":1.00,
                        "season":"FL",
                        "year":18,
                        "termId":201910
                    },
                    {  
                        "hon":true,
                        "subject":"HONR",
                        "classId":1310,
                        "name": "FutureofMoney",
                        "creditHours":4.00,
                        "season":"FL",
                        "year":18,
                        "termId":201910
                    }
                ],
                "nupaths":[  
                    "ND",
                    "EI",
                    "IC",
                    "FQ",
                    "SI",
                    "AD",
                    "DD",
                    "ER",
                    "WF",
                ]
            },
            "inprogress":{  
                "courses":[  
                    {  
                        "hon":false,
                        "subject":"CS",
                        "classId":3500,
                        "name": "Object-OrientedDesign",
                        "creditHours":4.00,
                        "season":"S1",
                        "year":19,
                        "termId":201940
                    },
                    {  
                        "hon":false,
                        "subject":"CS",
                        "classId":5800,
                        "name": "Algorithms",
                        "creditHours":4.00,
                        "season":"SM",
                        "year":19,
                        "termId":201950
                    },
                    {  
                        "hon":false,
                        "subject":"MATH",
                        "classId":3175,
                        "name": "GroupTheory",
                        "creditHours":4.00,
                        "season":"S2",
                        "year":19,
                        "termId":201960
                    },
                    {  
                        "hon":false,
                        "subject":"MATH",
                        "classId":3331,
                        "name": "DifferentialGeometry",
                        "creditHours":4.00,
                        "season":"FL",
                        "year":19,
                        "termId":202010
                    },
                    {  
                        "hon":false,
                        "subject":"MATH",
                        "classId":5101,
                        "name": "Analysis1",
                        "creditHours":4.00,
                        "season":"FL",
                        "year":19,
                        "termId":202010
                    },
                    {  
                        "hon":false,
                        "subject":"MATH",
                        "classId":7241,
                        "name": "Probability1",
                        "creditHours":4.00,
                        "season":"FL",
                        "year":19,
                        "termId":202010
                    },
                    {  
                        "hon":false,
                        "subject":"PHYS",
                        "classId":2303,
                        "name": "ModernPhysics",
                        "creditHours":4.00,
                        "season":"FL",
                        "year":19,
                        "termId":202010
                    }
                ],
                "nupaths":[  
                ]
            },
            "requirements":{  
                "courses":[  
                    {  
                        "subject":"CS",
                        "classId":1210
                    },
                    {
                        "subject":"CS",
                        "classId":2801
                    }, 
                    {
                        "subject":"CS",
                        "classId":2510
                    },
                    {  
                        "subject":"CS",
                        "classId":2511
                    },
                    {  
                        "subject":"CS",
                        "classId":2800
                    },
                    {  
                        "subject":"CS",
                        "classId":3800
                    },
                    {  
                        "subject":"CS",
                        "classId":4300
                    },
                    {  
                        "subject":"CS",
                        "classId":4500
                    },
                    {  
                        "subject":"CS",
                        "classId":3000
                    },
                    {  
                        "subject":"THTR",
                        "classId":1170
                    },
                    {  
                        "subject":"MATH",
                        "classId":2341
                    },
                    {  
                        "subject":"MATH",
                        "classId":3527
                    },
                    {  
                        "subject":"MATH",
                        "classId":3001,
                        "classId2":4999
                    },
                    {  
                        "subject":"ENGW",
                        "list":[  
                            3302,
                            3308,
                            3315
                        ],
                        "num_required":1
                    }
                ],
                "nupaths":[  
                    "WI",
                    "WD",
                    "EX",
                    "CE"
                ]
            },
            "data":{  
                "gradDate":new Date(2023, 5, 20),
                "auditYear":2019,
                "majors":["Computer Science"],
                "minors":[]
            }
        });
});