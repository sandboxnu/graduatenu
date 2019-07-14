const html_parser = require('../src/html_parser.js');

// import audit_to_json from '../src/html_parser';

test('Confirms that the proper JSON is produced', () => {
    expect(html_parser.audit_to_json("../test/mock_audits/cs_audit.html")).toBe(undefined);
});
