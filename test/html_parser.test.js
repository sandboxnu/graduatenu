const html_parser = require("../src/html_parser.js");

test('Confirms that the proper JSON file is produced', () => {
    expect(audit_to_json("mock_audits/cs_audit.html")).toBe(3);
});
