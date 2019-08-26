import * as fs from "fs";
import { ICompleteCourse, IInitialScheduleRep } from "../src/course_types";
import { audit_to_json } from "../src/html_parser";

const csJson = audit_to_json(fs.readFileSync("./test/mock_audits/cs_audit.html", "utf-8"));
const csJson2 = audit_to_json(fs.readFileSync("./test/mock_audits/cs_audit2.html", "utf-8"));
const csJson3 = audit_to_json(fs.readFileSync("./test/mock_audits/cs_audit3.html", "utf-8"));
const csMathJson = audit_to_json(fs.readFileSync("./test/mock_audits/cs_math_grad_audit.html", "utf-8"));
const meJson = audit_to_json(fs.readFileSync("./test/mock_audits/me_audit.html", "utf-8"));

const jsonEx: IInitialScheduleRep[] = [];
jsonEx.push(csJson);
jsonEx.push(csMathJson);
jsonEx.push(csJson2);
// json_ex.push(cs_json3);
// json_ex.push(me_json);

expect.extend({
    toHaveValidCompleteCourseForm(received: ICompleteCourse[]) {
        for (const completedCourse of received) {
            expect(completedCourse.subject).toMatch(/^[A-Z]{2,4}$/);
            expect(completedCourse.classId).toMatch(/^[\d]{4}$/);
            expect(completedCourse.creditHours).toMatch(/^[\d]\.00/);
            expect(completedCourse.season).toMatch(/FL|SP|S1|S2|SM/);
            expect(completedCourse.year).toMatch(/^\d\d$/);
            expect(completedCourse.termId).toMatch(/^20\d\d[1-6]0$/);
        }

        return {
            message: () => `Expected ${received} to have courses with data of the proper form.`,
            pass: true,
        };
    },
});

test("Confirms that the generated JavaScript object has the proper format for supplemental data", () => {
    for (const audit of jsonEx) {
        expect(audit.data.gradDate).toMatch(/^[0-3][0-9]\/[0-3][0-9]\/[0-9][0-9]$/);
        expect(audit.data.auditYear).toMatch(/^20[0-9][0-9]$/);

        for (const major of audit.data.majors) {
            expect(major).toMatch(/^[a-zA-Z ]+$/);
        }

        for (const minor of audit.data.minors) {
            expect(minor).toMatch(/^[a-zA-Z ]+$/);
        }
    }
});

test("Ensures that all of the complete course information is of the form required.", () => {
    for (const audit of jsonEx) {
        for (const completedCourse of audit.completed.courses) {
            expect(typeof completedCourse.hon === typeof true).toBeTruthy();
            expect(completedCourse.subject).toMatch(/^[A-Z]{2,4}$/);
            expect(completedCourse.classId).toMatch(/^[\d]{4}$/);
            expect(completedCourse.creditHours).toMatch(/^[\d]\.00/);
            expect(completedCourse.season).toMatch(/FL|SP|S1|S2|SM/);
            expect(completedCourse.year).toMatch(/^\d\d$/);
            expect(completedCourse.termId).toMatch(/^20\d\d[1-6]0$/);
        }
    }
});

test("Ensures that all of the in-progress course information is of the form required.", () => {
    for (const audit of jsonEx) {
        // TODO: figure out how to work a custom matcher here
    }
});

test("Ensures that all of the courses required to take are of the form required.", () => {
    for (const audit of jsonEx) {
        for (const requiredCourse of audit.requirements.courses) {
            expect(requiredCourse.subject).toMatch(/^[A-Z]{2,4}$/);

            if (typeof requiredCourse.classId  === "undefined") {
                expect(requiredCourse.num_required).toMatch(/^[\d]$/);

                for (const course of requiredCourse.list) {
                    expect(course).toMatch(/^[\d]{4}$/);
                }
            } else {
                expect(requiredCourse.classId).toMatch(/^[\d]{4}$/);
                if (typeof requiredCourse.classId2 !== "undefined") {
                    expect(requiredCourse.classId2).toMatch(/^[\d]{4}$/);
                }
            }
        }
    }
});

test("Ensures that the audits do not contain duplicate completed courses.", () => {
    for (let i = 0; i < jsonEx.length; i++) {
        let duplicates = false;
        for (let j = 0; j < jsonEx[i].completed.courses.length; j++) {
            const course = jsonEx[i].completed.courses[j];
            let seen = false;

            for (let k = 0; k < jsonEx[i].completed.courses.length; k++) {
                if (course.classId === jsonEx[i].completed.courses[k].classId
                    && course.subject === jsonEx[i].completed.courses[k].subject
                    && course.termId === jsonEx[i].completed.courses[k].termId
                    && course.name === jsonEx[i].completed.courses[k].name) {
                    if (!seen) {
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

test("Ensures that the audits do not contain duplicate in-progress courses.", () => {
    for (let i = 0; i < jsonEx.length; i++) {
        let duplicates = false;
        for (let j = 0; j < jsonEx[i].inprogress.courses.length; j++) {
            const course = jsonEx[i].inprogress.courses[j];
            let seen = false;

            for (let k = 0; k < jsonEx[i].inprogress.courses.length; k++) {
                if (course.classId === jsonEx[i].inprogress.courses[k].classId 
                    && course.subject === jsonEx[i].inprogress.courses[k].subject 
                    && course.termId === jsonEx[i].inprogress.courses[k].termId) {
                    if (!seen) {
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
 
test("Ensures that the audits do not contain duplicate completed NUPaths.", () => {
    for (let i = 0; i < jsonEx.length; i++) {
        let duplicates = false;
        for (let j = 0; j < jsonEx[i].completed.nupaths.length; j++) {
            let seen = false;
            const nupath = jsonEx[i].completed.nupaths[j];
            for (let k = 0; k < jsonEx[i].completed.nupaths.length; k++) {
                if (jsonEx[i].completed.nupaths[k] === nupath) {
                    if (!seen) {
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

test("Ensures that the audits do not contain duplicate in-progress NUPaths.", () => {
    for (let i = 0; i < jsonEx.length; i++) {
        let duplicates = false;
        for (let j = 0; j < jsonEx[i].inprogress.nupaths.length; j++) {
            let seen = false;
            const nupath = jsonEx[i].inprogress.nupaths[j];
            for (let k = 0; k < jsonEx[i].inprogress.nupaths.length; k++) {
                if (jsonEx[i].inprogress.nupaths[k] === nupath) {
                    if (!seen) {
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

test("Ensures that the audits do not contain duplicate required NUPaths.", () => {
    for (let i = 0; i < jsonEx.length; i++) {
        let duplicates = false;
        for (let j = 0; j < jsonEx[i].requirements.nupaths.length; j++) {
            let seen = false;
            const nupath = jsonEx[i].requirements.nupaths[j];
            for (let k = 0; k < jsonEx[i].requirements.nupaths.length; k++) {
                if (jsonEx[i].requirements.nupaths[k] === nupath) {
                    if (!seen) {
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

test("Ensures that each audit contains all of the NUPath requirements.", () => {
    for (let i = 0; i < jsonEx.length; i++) {
        const nupaths = ["ND", "EI", "IC", "FQ", "SI", "AD", "DD", "ER", "WF", "WD", "WI", "EX", "CE"];
        for (let j = 0; j < jsonEx[i].completed.nupaths.length; j++) {
            const index = nupaths.indexOf(jsonEx[i].completed.nupaths[j]);
            if (index > -1) {
                nupaths.splice(index, 1);
            }
        }

        for (let j = 0; j < jsonEx[i].inprogress.nupaths.length; j++) {
            const index = nupaths.indexOf(jsonEx[i].inprogress.nupaths[j]);
            if (index > -1) {
                nupaths.splice(index, 1);
            }
        }
        for (let j = 0; j < jsonEx[i].requirements.nupaths.length; j++) {
            const index = nupaths.indexOf(jsonEx[i].requirements.nupaths[j]);
            if (index > -1) {
                nupaths.splice(index, 1);
            }
        }

        expect(nupaths.length === 0).toBeTruthy();
    }
});

test("Verifies that the CS degree audit is properly reproduced by the code", () => {
    expect(csJson).toStrictEqual(
        {
            completed: {
                courses: [{
                    classId: "1200",
                    creditHours: "1.00",
                    hon: false,
                    name: "LeadershipSkillDevelopment",
                    season: "FL",
                    subject: "CS",
                    termId: "201910",
                    year: "18"
                }, {
                    classId: "1800",
                    credithours: "4.00",
                    hon: true,
                    name: "DiscreteStructures",
                    season: "FL",
                    subject: "CS",
                    termId: "201910",
                    year: "18"
                }, {
                    classId: "1802",
                    credithours: "1.00",
                    hon: true,
                    name: "SeminarforCS1800",
                    season: "FL",
                    subject: "CS",
                    termId: "201910",
                    year: "18"
                }, {
                    classId: "2500",
                    credithours: "4.00",
                    hon: false,
                    name: "FundamentalsofComputerSci",
                    season: "FL",
                    subject: "CS",
                    termId: "201910",
                    year: "18"
                }, {
                    classId: "2501",
                    credithours: "1.00",
                    hon: false,
                    name: "LabforCS2500",
                    season: "FL",
                    subject: "CS",
                    termId: "201910",
                    year: "18"
                }, {
                    classId: "2510",
                    credithours: "4.00",
                    hon: false,
                    name: "FundamentalsofComputerSci",
                    season: "SP",
                    subject: "CS",
                    termId: "201930",
                    year: "19"
                }, {
                    classId: "2511",
                    credithours: "1.00",
                    hon: false,
                    name: "LabforCS2510",
                    season: "SP",
                    subject: "CS",
                    termId: "201930",
                    year: "19"
                }, {
                    classId: "2800",
                    credithours: "4.00",
                    hon: false,
                    name: "LogicandComputation",
                    season: "SP",
                    subject: "CS",
                    termId: "201930",
                    year: "19"
                }, {
                    classId: "2801",
                    credithours: "1.00",
                    hon: false,
                    name: "LabforCS2800",
                    season: "SP",
                    subject: "CS",
                    termId: "201930",
                    year: "19"
                }, {
                    classId: "3200",
                    credithours: "4.00",
                    hon: false,
                    name: "DatabaseDesign",
                    season: "SP",
                    subject: "CS",
                    termId: "201930",
                    year: "19"
                }, {
                    classId: "3950",
                    credithours: "2.00",
                    hon: false,
                    name: "IntrotoCSResearch",
                    season: "SP",
                    subject: "CS",
                    termId: "201930",
                    year: "19"
                }, {
                    classId: "1341",
                    credithours: "4.00",
                    hon: false,
                    name: "CalculusBC++",
                    season: "S2",
                    subject: "MATH",
                    termId: "201860",
                    year: "18"
                }, {
                    classId: "1342",
                    credithours: "4.00",
                    hon: false,
                    name: "CalculusBC++",
                    season: "S2",
                    subject: "MATH",
                    termId: "201860",
                    year: "18"
                }, {
                    classId: "2331",
                    credithours: "4.00",
                    hon: false,
                    name: "LinearAlgebra",
                    season: "FL",
                    subject: "MATH",
                    termId: "201910",
                    year: "18"
                }, {
                    classId: "1145",
                    credithours: "4.00",
                    hon: true,
                    name: "TechandHumanValues",
                    season: "FL",
                    subject: "PHIL",
                    termId: "201910",
                    year: "18"
                }, {
                    classId: "1111",
                    credithours: "4.00",
                    hon: false,
                    name: "AP:BIOLOGY",
                    season: "S2",
                    subject: "BIOL",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1112",
                    credithours: "1.00",
                    hon: false,
                    name: "AP:BIOLOGY",
                    season: "S2",
                    subject: "BIOL",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1113",
                    credithours: "4.00",
                    hon: false,
                    name: "AP:BIOLOGY",
                    season: "S2",
                    subject: "BIOL",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1114",
                    credithours: "1.00",
                    hon: false,
                    name: "AP:BIOLOGY",
                    season: "S2",
                    subject: "BIOL",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1111",
                    credithours: "8.00",
                    hon: false,
                    name: "AP:ENGLANG/COMP,ENGL",
                    season: "S2",
                    subject: "ENGW",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1990",
                    credithours: "4.00",
                    hon: false,
                    name: "AP:COMPSCIA",
                    season: "S2",
                    subject: "CS",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1115",
                    credithours: "4.00",
                    hon: false,
                    name: "AP:ECON-MAC",
                    season: "S2",
                    subject: "ECON",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1116",
                    credithours: "4.00",
                    hon: false,
                    name: "AP:ECON-MIC",
                    season: "S2",
                    subject: "ECON",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1110",
                    credithours: "4.00",
                    hon: false,
                    name: "AP:WORLDHISTORY",
                    season: "S2",
                    subject: "HIST",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "2280",
                    credithours: "4.00",
                    hon: false,
                    name: "AP:STATISTICS",
                    season: "S2",
                    subject: "MATH",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1151",
                    credithours: "3.00",
                    hon: false,
                    name: "AP:PHYSICSC-MECH",
                    season: "S2",
                    subject: "PHYS",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1152",
                    credithours: "1.00",
                    hon: false,
                    name: "AP:PHYSICSC-MECH",
                    season: "S2",
                    subject: "PHYS",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1153",
                    credithours: "1.00",
                    hon: false,
                    name: "AP:PHYSICSC-MECH",
                    season: "S2",
                    subject: "PHYS",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1101",
                    credithours: "4.00",
                    hon: false,
                    name: "AP:PSYCHOLOGY",
                    season: "S2",
                    subject: "PSYC",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1102",
                    credithours: "1.00",
                    hon: true,
                    name: "HonorsDiscovery",
                    season: "FL",
                    subject: "HONR",
                    termId: "201910",
                    year: "18",
                }],
                nupaths: ["ND", "FQ", "SI", "AD", "ER", "WF"],
            },
            data: {
                auditYear: 2019,
                gradDate: new Date(2022, 8, 20),
                majors: ["Computer Science"],
            },
            inprogress: {
                courses: [{
                    classId: "3000",
                    credithours: "4.00",
                    hon: false,
                    name: "Algorithms&Data",
                    season: "FL",
                    subject: "CS",
                    termId: "202010",
                    year: "19",
                }, {
                    classId: "3500",
                    credithours: "4.00",
                    hon: false,
                    name: "Object-OrientedDesign",
                    season: "S1",
                    subject: "CS",
                    termId: "201940",
                    year: "19",
                }, {
                    classId: "3650",
                    credithours: "4.00",
                    hon: false,
                    name: "ComputerSystems",
                    season: "FL",
                    subject: "CS",
                    termId: "202010",
                    year: "19",
                }, {
                    classId: "4100",
                    credithours: "4.00",
                    hon: false,
                    name: "ArtificialIntelligence",
                    season: "FL",
                    subject: "CS",
                    termId: "202010",
                    year: "19",
                }, {
                    classId: "4950",
                    credithours: "1.00",
                    hon: false,
                    name: "MachineLearnResearchSemina",
                    season: "FL",
                    subject: "CS",
                    termId: "202010",
                    year: "19",
                }, {
                    classId: "3081",
                    credithours: "4.00",
                    hon: false,
                    name: "ProbabilityandStatistics",
                    season: "FL",
                    subject: "MATH",
                    termId: "202010",
                    year: "19",
                }, {
                    classId: "2160",
                    credithours: "4.00",
                    hon: false,
                    name: "EmbeddedDesEnablingRobotic",
                    season: "S1",
                    subject: "EECE",
                    termId: "201940",
                    year: "19",
                }],
                nupaths: ["CE"],
            },
            requirements: {
                courses: [{
                    classId: "1210",
                    subject: "CS",
                }, {
                    classId: "3700",
                    subject: "CS",
                }, {
                    classId: "3800",
                    subject: "CS",
                }, {
                    classId: "4400",
                    subject: "CS",
                }, {
                    classId: "4500",
                    subject: "CS",
                }, {
                    classId: "1170",
                    subject: "THTR",
                }, {
                    classId: "2500",
                    classId2: "7999",
                    subject: "CS",
                }, {
                    classId: "2000",
                    classId2: "7999",
                    subject: "DS",
                }, {
                    list: ["3302", "3308", "3315"],
                    num_required: "1",
                    subject: "ENGW",
                }],
                nupaths: ["EI", "IC", "DD", "WI", "WD", "EX"],
            },
        });
});
test("Verifies that the second Computer Science degree audit is properly reproduced by the code", () => {
    expect(csJson2).toStrictEqual(
        {
            completed: {
                courses: [{
                    classId: "1200",
                    credithours: "1.00",
                    hon: false,
                    name: "LeadershipSkillDevelopment",
                    season: "FL",
                    subject: "CS",
                    termId: "201910",
                    year: "18",
                }, {
                    classId: "1800",
                    credithours: "4.00",
                    hon: false,
                    name: "DiscreteStructures",
                    season: "FL",
                    subject: "CS",
                    termId: "201910",
                    year: "18",
                }, {
                    classId: "1802",
                    credithours: "1.00",
                    hon: false,
                    name: "SeminarforCS1800",
                    season: "FL",
                    subject: "CS",
                    termId: "201910",
                    year: "18",
                }, {
                    classId: "2500",
                    credithours: "4.00",
                    hon: false,
                    name: "FundamentalsofComputerSci",
                    season: "FL",
                    subject: "CS",
                    termId: "201910",
                    year: "18",
                }, {
                    classId: "2501",
                    credithours: "1.00",
                    hon: false,
                    name: "LabforCS2500",
                    season: "FL",
                    subject: "CS",
                    termId: "201910",
                    year: "18",
                }, {
                    classId: "2510",
                    credithours: "4.00",
                    hon: false,
                    name: "FundamentalsofComputerSci",
                    season: "SP",
                    subject: "CS",
                    termId: "201930",
                    year: "19",
                }, {
                    classId: "2511",
                    credithours: "1.00",
                    hon: false,
                    name: "LabforCS2510",
                    season: "SP",
                    subject: "CS",
                    termId: "201930",
                    year: "19",
                }, {
                    classId: "2800",
                    credithours: "4.00",
                    hon: false,
                    name: "LogicandComputation",
                    season: "SP",
                    subject: "CS",
                    termId: "201930",
                    year: "19",
                }, {
                    classId: "2801",
                    credithours: "1.00",
                    hon: false,
                    name: "LabforCS2800",
                    season: "SP",
                    subject: "CS",
                    termId: "201930",
                    year: "19",
                }, {
                    classId: "2550",
                    credithours: "4.00",
                    hon: false,
                    name: "FoundationsofCybersecurity",
                    season: "SP",
                    subject: "CS",
                    termId: "201930",
                    year: "19",
                }, {
                    classId: "1341",
                    credithours: "4.00",
                    hon: false,
                    name: "CalculusBC++",
                    season: "S2",
                    subject: "MATH",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1342",
                    credithours: "4.00",
                    hon: false,
                    name: "CalculusBC++",
                    season: "S2",
                    subject: "MATH",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "3081",
                    credithours: "4.00",
                    hon: false,
                    name: "ProbabilityandStatistics",
                    season: "S1",
                    subject: "MATH",
                    termId: "201940",
                    year: "19",
                }, {
                    classId: "2160",
                    credithours: "4.00",
                    hon: false,
                    name: "EmbeddedDesEnablingRobotic",
                    season: "S1",
                    subject: "EECE",
                    termId: "201940",
                    year: "19",
                }, {
                    classId: "1151",
                    credithours: "3.00",
                    hon: false,
                    name: "AP:PHYSICSC-MECH",
                    season: "S2",
                    subject: "PHYS",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1152",
                    credithours: "1.00",
                    hon: false,
                    name: "AP:PHYSICSC-MECH",
                    season: "S2",
                    subject: "PHYS",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1153",
                    credithours: "1.00",
                    hon: false,
                    name: "AP:PHYSICSC-MECH",
                    season: "S2",
                    subject: "PHYS",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1155",
                    credithours: "3.00",
                    hon: false,
                    name: "PhysicsforEngineering2",
                    season: "FL",
                    subject: "PHYS",
                    termId: "201910",
                    year: "18",
                }, {
                    classId: "1156",
                    credithours: "1.00",
                    hon: false,
                    name: "LabforPHYS1155",
                    season: "FL",
                    subject: "PHYS",
                    termId: "201910",
                    year: "18",
                }, {
                    classId: "1157",
                    credithours: "1.00",
                    hon: false,
                    name: "InteractLearnforPHYS1155",
                    season: "FL",
                    subject: "PHYS",
                    termId: "201910",
                    year: "18",
                }, {
                    classId: "1111",
                    credithours: "4.00",
                    hon: false,
                    name: "AP:ENGLANG/COMP",
                    season: "S2",
                    subject: "ENGW",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1990",
                    credithours: "4.00",
                    hon: false,
                    name: "AP:COMPSCIA",
                    season: "S2",
                    subject: "CS",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1990",
                    credithours: "4.00",
                    hon: false,
                    name: "AP:COMPSCIPRINCI",
                    season: "S2",
                    subject: "CS",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1130",
                    credithours: "4.00",
                    hon: false,
                    name: "AP:USHISTORY",
                    season: "S2",
                    subject: "HIST",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "2321",
                    credithours: "4.00",
                    hon: false,
                    name: "Calculus3forSci/Engr",
                    season: "FL",
                    subject: "MATH",
                    termId: "201910",
                    year: "18",
                }, {
                    classId: "1310",
                    credithours: "4.00",
                    hon: true,
                    name: "IllusionsofReality",
                    season: "SP",
                    subject: "HONR",
                    termId: "201930",
                    year: "19",
                }],
                nupaths: ["ND", "IC", "FQ", "AD", "DD", "WF"],
            },
            data: {
                grad: "08/20/22",
                major: "Computer Science",
                year: "2019",
            },
            inprogress: {
                courses: [{
                    classId: "3000",
                    credithours: "4.00",
                    hon: false,
                    name: "Algorithms&Data",
                    season: "S2",
                    subject: "CS",
                    termId: "201960",
                    year: "19",
                }, {
                    classId: "3500",
                    credithours: "4.00",
                    hon: false,
                    name: "Object-OrientedDesign",
                    season: "FL",
                    subject: "CS",
                    termId: "202010",
                    year: "19",
                }, {
                    classId: "3650",
                    credithours: "4.00",
                    hon: false,
                    name: "ComputerSystems",
                    season: "FL",
                    subject: "CS",
                    termId: "202010",
                    year: "19",
                }, {
                    classId: "3800",
                    credithours: "4.00",
                    hon: false,
                    name: "TheoryofComputation",
                    season: "FL",
                    subject: "CS",
                    termId: "202010",
                    year: "19",
                }, {
                    classId: "2331",
                    credithours: "4.00",
                    hon: false,
                    name: "LinearAlgebra",
                    season: "S2",
                    subject: "MATH",
                    termId: "201960",
                    year: "19",
                }, {
                    classId: "1145",
                    credithours: "4.00",
                    hon: true,
                    name: "TechandHumanValues",
                    season: "FL",
                    subject: "PHIL",
                    termId: "202010",
                    year: "19",
                }],
                nupaths: ["SI", "ER"],
            },
            requirements: {
                courses: [{
                    classId: "1210",
                    subject: "CS",
                }, {
                    classId: "3700",
                    subject: "CS",
                }, {
                    classId: "4400",
                    subject: "CS",
                }, {
                    classId: "4500",
                    subject: "CS",
                }, {
                    classId: "1170",
                    subject: "THTR",
                }, {
                    list: ["4100", "4300", "4410", "4150", "4550", "4991"],
                    num_required: "1",
                    subject: "CS",
                }, {
                    classId: "4900",
                    subject: "IS",
                }, {
                    classId: "2500",
                    classId2: "7999",
                    subject: "CS",
                }, {
                    classId: "2000",
                    classId2: "7999",
                    subject: "DS",
                }, {
                    list: ["3302", "3308", "3315"],
                    num_required: "1",
                    subject: "ENGW",
                }],
                nupaths: ["EI", "WI", "WD", "EX", "CE"],
            },
        });
});

test("Verifies that the CS Math degree audit is properly reproduced by the code", () => {
    expect(csMathJson).toStrictEqual(
        {
            completed: {
                courses: [{
                    classId: "1200",
                    credithours: "1.00",
                    hon: false,
                    name: "LeadershipSkillDevelopment",
                    season: "FL",
                    subject: "CS",
                    termId: "201910",
                    year: "18",
                }, {
                    classId: "1800",
                    credithours: "4.00",
                    hon: true,
                    name: "DiscreteStructures",
                    season: "FL",
                    subject: "CS",
                    termId: "201910",
                    year: "18",
                }, {
                    classId: "1802",
                    credithours: "1.00",
                    hon: true,
                    name: "SeminarforCS1800",
                    season: "FL",
                    subject: "CS",
                    termId: "201910",
                    year: "18",
                }, {
                    classId: "2500",
                    credithours: "4.00",
                    hon: false,
                    name: "FundamentalsofComputerSci",
                    season: "FL",
                    subject: "CS",
                    termId: "201910",
                    year: "18",
                }, {
                    classId: "2501",
                    credithours: "1.00",
                    hon: false,
                    name: "LabforCS2500",
                    season: "FL",
                    subject: "CS",
                    termId: "201910",
                    year: "18",
                }, {
                    classId: "4993",
                    credithours: "4.00",
                    hon: false,
                    name: "IndependentStudy",
                    season: "SP",
                    subject: "CS",
                    termId: "201930",
                    year: "19",
                }, {
                    classId: "1341",
                    credithours: "0.00",
                    hon: false,
                    name: "CalculusI",
                    season: "FL",
                    subject: "MATH",
                    termId: "201710",
                    year: "16",
                }, {
                    classId: "1342",
                    credithours: "5.00",
                    hon: false,
                    name: "CalculusII",
                    season: "SP",
                    subject: "MATH",
                    termId: "201730",
                    year: "17",
                }, {
                    classId: "2321",
                    credithours: "5.00",
                    hon: false,
                    name: "CalculusIII",
                    season: "FL",
                    subject: "MATH",
                    termId: "201810",
                    year: "17",
                }, {
                    classId: "1341",
                    credithours: "4.00",
                    hon: false,
                    name: "AP:CALCULUSAB",
                    season: "S2",
                    subject: "MATH",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "2331",
                    credithours: "4.00",
                    hon: false,
                    name: "LinearAlgebra",
                    season: "SP",
                    subject: "MATH",
                    termId: "201930",
                    year: "19",
                }, {
                    classId: "3081",
                    credithours: "4.00",
                    hon: false,
                    name: "ProbabilityandStatistics",
                    season: "SP",
                    subject: "MATH",
                    termId: "201930",
                    year: "19",
                }, {
                    classId: "1145",
                    credithours: "4.00",
                    hon: true,
                    name: "TechandHumanValues",
                    season: "FL",
                    subject: "PHIL",
                    termId: "201910",
                    year: "18",
                }, {
                    classId: "1111",
                    credithours: "0.00",
                    hon: false,
                    name: "AP:ENGLANG/COMP",
                    season: "S2",
                    subject: "ENGW",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1111",
                    credithours: "4.00",
                    hon: false,
                    name: "ENGLISHA:Literature",
                    season: "S2",
                    subject: "ENGW",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1990",
                    credithours: "3.00",
                    hon: false,
                    name: "Trigonometry",
                    season: "SM",
                    subject: "MATH",
                    termId: "201650",
                    year: "16",
                }, {
                    classId: "1990",
                    credithours: "3.00",
                    hon: false,
                    name: "PrecalculusAlgebra",
                    season: "SM",
                    subject: "MATH",
                    termId: "201650",
                    year: "16",
                }, {
                    classId: "3584",
                    credithours: "3.00",
                    hon: false,
                    name: "HarryPotterandtheImaginat",
                    season: "SM",
                    subject: "ENGL",
                    termId: "201750",
                    year: "17",
                }, {
                    classId: "1990",
                    credithours: "3.00",
                    hon: false,
                    name: "Ceramics:WheelThrowing",
                    season: "SP",
                    subject: "ARTS",
                    termId: "201830",
                    year: "18",
                }, {
                    classId: "1990",
                    credithours: "4.00",
                    hon: false,
                    name: "AP:COMPSCIA",
                    season: "S2",
                    subject: "CS",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1990",
                    credithours: "4.00",
                    hon: false,
                    name: "ENGLISHA:Literature",
                    season: "S2",
                    subject: "ENGL",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1101",
                    credithours: "4.00",
                    hon: false,
                    name: "AP:ENV.SCIENCE",
                    season: "S2",
                    subject: "ENVR",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1130",
                    credithours: "0.00",
                    hon: false,
                    name: "AP:USHISTORY",
                    season: "S2",
                    subject: "HIST",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1130",
                    credithours: "4.00",
                    hon: false,
                    name: "HistoryAmericas",
                    season: "S2",
                    subject: "HIST",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1145",
                    credithours: "4.00",
                    hon: false,
                    name: "AP:PHYSICS1",
                    season: "S2",
                    subject: "PHYS",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1146",
                    credithours: "1.00",
                    hon: false,
                    name: "AP:PHYSICS1",
                    season: "S2",
                    subject: "PHYS",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1161",
                    credithours: "4.00",
                    hon: false,
                    name: "IB:PHYSICS",
                    season: "S2",
                    subject: "PHYS",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1162",
                    credithours: "1.00",
                    hon: false,
                    name: "IB:PHYSICS",
                    season: "S2",
                    subject: "PHYS",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1165",
                    credithours: "4.00",
                    hon: false,
                    name: "IB:PHYSICS",
                    season: "S2",
                    subject: "PHYS",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1166",
                    credithours: "1.00",
                    hon: false,
                    name: "IB:PHYSICS",
                    season: "S2",
                    subject: "PHYS",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1990",
                    credithours: "4.00",
                    hon: false,
                    name: "AP:HUMANGEOGRAPHY",
                    season: "S2",
                    subject: "SOCL",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1990",
                    credithours: "4.00",
                    hon: false,
                    name: "AP:SPANISHLANG",
                    season: "S2",
                    subject: "SPNS",
                    termId: "201860",
                    year: "18",
                }, {
                    classId: "1121",
                    credithours: "4.00",
                    hon: false,
                    name: "ConceptualDrawing",
                    season: "SP",
                    subject: "ARTF",
                    termId: "201930",
                    year: "19",
                }, {
                    classId: "3950",
                    credithours: "2.00",
                    hon: false,
                    name: "IntrotoCSResearch",
                    season: "SP",
                    subject: "CS",
                    termId: "201930",
                    year: "19",
                }, {
                    classId: "1102",
                    credithours: "1.00",
                    hon: true,
                    name: "HonorsDiscovery",
                    season: "FL",
                    subject: "HONR",
                    termId: "201910",
                    year: "18",
                }, {
                    classId: "1310",
                    credithours: "4.00",
                    hon: true,
                    name: "FutureofMoney",
                    season: "FL",
                    subject: "HONR",
                    termId: "201910",
                    year: "18",
                }],
                nupaths: ["ND", "EI", "IC", "FQ", "SI", "AD", "DD", "ER", "WF"],
            },
            data: {
                grad: "05/20/23",
                major: ["Computer Science"],
                year: "2019",
            },
            inprogress: {
                courses: [{
                    classId: "3500",
                    credithours: "4.00",
                    hon: false,
                    name: "Object-OrientedDesign",
                    season: "S1",
                    subject: "CS",
                    termId: "201940",
                    year: "19",
                }, {
                    classId: "5800",
                    credithours: "4.00",
                    hon: false,
                    name: "Algorithms",
                    season: "SM",
                    subject: "CS",
                    termId: "201950",
                    year: "19",
                }, {
                    classId: "3175",
                    credithours: "4.00",
                    hon: false,
                    name: "GroupTheory",
                    season: "S2",
                    subject: "MATH",
                    termId: "201960",
                    year: "19",
                }, {
                    classId: "3331",
                    credithours: "4.00",
                    hon: false,
                    name: "DifferentialGeometry",
                    season: "FL",
                    subject: "MATH",
                    termId: "202010",
                    year: "19",
                }, {
                    classId: "5101",
                    credithours: "4.00",
                    hon: false,
                    name: "Analysis1",
                    season: "FL",
                    subject: "MATH",
                    termId: "202010",
                    year: "19",
                }, {
                    classId: "7241",
                    credithours: "4.00",
                    hon: false,
                    name: "Probability1",
                    season: "FL",
                    subject: "MATH",
                    termId: "202010",
                    year: "19",
                }, {
                    classId: "2303",
                    credithours: "4.00",
                    hon: false,
                    name: "ModernPhysics",
                    season: "FL",
                    subject: "PHYS",
                    termId: "202010",
                    year: "19",
                }],
                nupaths: [],
            },
            requirements: {
                courses: [{
                    classId: "1210",
                    subject: "CS",
                }, {
                    classId: "2801",
                    subject: "CS",
                }, {
                    classId: "2510",
                    subject: "CS",
                }, {
                    classId: "2511",
                    subject: "CS",
                }, {
                    classId: "2800",
                    subject: "CS",
                }, {
                    classId: "3800",
                    subject: "CS",
                }, {
                    classId: "4300",
                    subject: "CS",
                }, {
                    classId: "4500",
                    subject: "CS",
                }, {
                    classId: "3000",
                    subject: "CS",
                }, {
                    classId: "1170",
                    subject: "THTR",
                }, {
                    classId: "2341",
                    subject: "MATH",
                }, {
                    classId: "3527",
                    subject: "MATH",
                }, {
                    classId: "3001",
                    classId2: "4999",
                    subject: "MATH",
                }, {
                    list: ["3302", "3308", "3315"],
                    num_required: "1",
                    subject: "ENGW",
                }],
                nupaths: ["WI", "WD", "EX", "CE"],
            },
        });
});
