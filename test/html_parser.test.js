const html_parser = require('../src/html_parser.js');
const fs = require('fs');

// import audit_to_json from '../src/html_parser';

test('Confirms that the generated JSON is of the proper form', () => {
    expect(html_parser.audit_to_json(fs.readFileSync("./test/mock_audits/cs_audit.html", "utf-8"))).toBe(undefined);
});
