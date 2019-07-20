const html_parser = require('../src/html_parser.js');
const fs = require('fs');

const cs_json = html_parser.audit_to_json(fs.readFileSync("./test/mock_audits/cs_audit.html", "utf-8"));
const cs_math_json = html_parser.audit_to_json(fs.readFileSync("./test/mock_audits/cs_math_audit.html", "utf-8"));

test('Confirms that the generated JavaScript object is of the proper form', () => {
    expect(cs_json).toBe(undefi
);

test('Ensures that all of the complete course information is of the form required.', () => {
    for(let i = 0; i < cs_json.completed.courses.length; i++) {

    }
});

test('Ensures that all of the in-progress course information is of the form required.', () => {
    for(let i = 0; i < cs_json.completed.courses.length; i++) {

    }
});

test('Ensures that all of the courses required to take are of the form required.', () => {
    for(let i = 0; i < cs_json.completed.courses.length; i++) {

    }
});

test('Ensures that the completed NUPaths are of the form required.', () => {
    for(let i = 0; i < cs_json.completed.courses.length; i++) {

    }
});

test('Ensures that the in-progress NUPaths are of the form required.', () => {
    for(let i = 0; i < cs_json.completed.courses.length; i++) {

    }
});

test('Ensures that the completed NUPaths are of the form required.', () => {
    for(let i = 0; i < cs_json.completed.courses.length; i++) {

    }
});

test('Ensures that the audits do not contain duplicate completed courses.', () => {
    for(let i = 0; i < cs_json.completed.courses.length; i++) {

    }
});

test('Ensures that the audits do not contain duplicate in-progress courses.', () => {
    for(let i = 0; i < cs_json.completed.courses.length; i++) {

    }
});

test('Ensures that the audits do not contain duplicate required courses.', () => {
    for(let i = 0; i < cs_json.completed.courses.length; i++) {

    }
});

test('Ensures that the audits do not contain duplicate completed NUPaths.', () => {
    for(let i = 0; i < cs_json.completed.courses.length; i++) {

    }
});

test('Ensures that the audits do not contain duplicate in-progress NUPaths.', () => {
    for(let i = 0; i < cs_json.completed.courses.length; i++) {

    }
});


test('Ensures that the audits do not contain duplicate required NUPaths.', () => {
    for(let i = 0; i < cs_json.completed.courses.length; i++) {

    }
});

test('Makes sure the supplementary data provided is present and in the correct form.', () => {

});

test('Verifies that the JavaScript objects produced are exactly as expected.', () => {

});

test('Ensures that two different JavaScript objects produced from the same audit are identical', () => {
    expect(cs_json).toBe(html_parser.audit_to_json(fs.readFileSync("./test/mock_audits/cs_audit.html", "utf-8")));
    expect(cs_math_json).toBe(html_parser.audit_to_json(fs.readFileSync("./test/mock_audits/cs_math_audit.html", "utf-8")));
});
