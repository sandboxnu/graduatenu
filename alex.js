
const html_parser = require('./build/html_parser.js');
const fs = require("fs");




// --------------------
// test and write html_parser 

// let html_audit = html_parser.audit_to_json(fs.readFileSync("./test/mock_audits/cs_audit.html", "utf-8"));
// let html_audit1 = html_parser.audit_to_json(fs.readFileSync("./test/mock_audits/cs_audit2.html", "utf-8"));
let html_audit2 = html_parser.audit_to_json(fs.readFileSync("./test/mock_audits/cs_math_grad_audit.html", "utf-8"));

// fs.writeFileSync('./test/mock_parsed_audits/cs_json.json', JSON.stringify(html_audit, null, 2));
// fs.writeFileSync('./test/mock_parsed_audits/cs_json2.json', JSON.stringify(html_audit1, null, 2));
fs.writeFileSync('./test/mock_parsed_audits/cs__math_grad_json.json', JSON.stringify(html_audit2, null, 2));

// ---------------------
// test json_parser.json_to_schedule(...)

// const json_loader = require('./build/json_loader.js');
// const json_parser = require('./build/json_parser.js');

// // the classMapParent constant
// const PARENT = json_loader.loadClassMaps();

// let cs_sched = PARENT.then(result => {
//   console.log(result);
//   let html_audit = fs.readFileSync("./test/mock_audits/cs_audit.html", "utf-8");

//   let audit_json = html_parser.audit_to_json(html_audit);
//   console.log(audit_json);

//   let sched = json_parser.toSchedule(audit_json, result);
//   console.log(sched);

//   return sched;
// });