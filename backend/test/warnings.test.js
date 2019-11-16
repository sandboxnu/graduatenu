const warning_generator = require("../../frontend/src/utils/generate-warnings.ts");
const fs = require("fs");

// the following code converts parsed audits into new schedules:
// const json_loader = require("../src/json_loader.ts");
// let parent = json_loader.loadClassMaps();
// parent.then(result => {
//   let cs_sched_text = fs.readFileSync("./test/mock_parsed_audits/cs_json.json", "utf-8");
//   let cs_sched_obj = JSON.parse(cs_sched_text);
//   let cs_new_sched = warning_generator.oldToNew(cs_sched_obj, result);
//   let cs_new_text = JSON.stringify(cs_new_sched, null, 2);
//   fs.writeFileSync("./test/mock_schedules/cs_sched_1.json", cs_new_text);
// });
// parent.then(result => {
//   let cs_sched_text = fs.readFileSync("./test/mock_parsed_audits/cs_json2.json", "utf-8");
//   let cs_sched_obj = JSON.parse(cs_sched_text);
//   let cs_new_sched = warning_generator.oldToNew(cs_sched_obj, result);
//   let cs_new_text = JSON.stringify(cs_new_sched, null, 2);
//   fs.writeFileSync("./test/mock_schedules/cs_sched_2.json", cs_new_text);
// });

test("Tests warnings produce properly for cs_sched_1.json", () => {
  // read in a schedule
  let cs_sched = fs.readFileSync(
    "./backend/test/mock_schedules/cs_sched_1.json",
    "utf-8"
  );
  let cs_sched_obj = JSON.parse(cs_sched);
  let cs_sched_warn = warning_generator.produceWarnings(cs_sched_obj);

  expect(cs_sched_warn.length).toBeGreaterThan(0);

  for (const warning of cs_sched_warn) {
    expect(warning).toBeDefined();
    expect(warning).toHaveProperty("message");
    expect(warning).toHaveProperty("termId");
  }

  expect(cs_sched_warn).toContainEqual({
    message: "Enrolled in a max of 20 credits. May be over-enrolled.",
    termId: 201910,
  });
  expect(cs_sched_warn).toContainEqual({
    message: "Enrolled in a min of 20 credits. May be over-enrolled.",
    termId: 201910,
  });
  expect(cs_sched_warn).toContainEqual({
    message: "BIOL1112: prereqs not satisfied: AND: BIOL1111",
    termId: 201860,
  });
  expect(cs_sched_warn).toContainEqual({
    message:
      "BIOL1113: prereqs not satisfied: OR: BIOL1101,BIOL1107,BIOL1111,BIOL1115",
    termId: 201860,
  });
  expect(cs_sched_warn).toContainEqual({
    message: "BIOL1114: prereqs not satisfied: AND: BIOL1113",
    termId: 201860,
  });
  expect(cs_sched_warn).toContainEqual({
    message:
      "PHYS1151: prereqs not satisfied: OR: MATH1241,MATH1251,MATH1340,MATH1341,MATH1342,MATH2321",
    termId: 201860,
  });
  expect(cs_sched_warn).toContainEqual({
    message: "Enrolled in a max of 51 credits. May be over-enrolled.",
    termId: 201860,
  });
  expect(cs_sched_warn).toContainEqual({
    message: "Enrolled in a min of 48 credits. May be over-enrolled.",
    termId: 201860,
  });
  expect(cs_sched_warn).toContainEqual({
    message: "Overloaded: Enrolled in 10 four-credit courses.",
    termId: 201860,
  });
});

test("Tests warnings produce properly for cs_sched_2.json", () => {
  // read in a schedule
  let cs_sched = fs.readFileSync(
    "./backend/test/mock_schedules/cs_sched_2.json",
    "utf-8"
  );
  let cs_sched_obj = JSON.parse(cs_sched);
  let cs_sched_warn = warning_generator.produceWarnings(cs_sched_obj);

  expect(cs_sched_warn.length).toBeGreaterThan(0);

  for (const warning of cs_sched_warn) {
    expect(warning).toBeDefined();
    expect(warning).toHaveProperty("message");
    expect(warning).toHaveProperty("termId");
  }

  expect(cs_sched_warn).toContainEqual({
    message: "Enrolled in a max of 20 credits. May be over-enrolled.",
    termId: 201910,
  });
  expect(cs_sched_warn).toContainEqual({
    message: "Enrolled in a min of 20 credits. May be over-enrolled.",
    termId: 201910,
  });
  expect(cs_sched_warn).toContainEqual({
    message: "Enrolled in a max of 29 credits. May be over-enrolled.",
    termId: 201860,
  });
  expect(cs_sched_warn).toContainEqual({
    message: "Enrolled in a min of 23 credits. May be over-enrolled.",
    termId: 201860,
  });
});

test("perfect schedule, no requirement group warnings for cs_pos_1.json", () => {
  let cs_sched = fs.readFileSync(
    "./backend/test/mock_schedules/cs_pos_1.json",
    "utf-8"
  );
  let cs_sched_obj = JSON.parse(cs_sched);

  let csMajor = fs.readFileSync(
    "./backend/test/mock_majors/bscs.json",
    "utf-8"
  );

  let csMajor_obj = JSON.parse(csMajor);

  let reqWarnings = warning_generator.produceRequirementGroupWarning(
    cs_sched_obj,
    csMajor_obj
  );
  expect(reqWarnings.length).toBe(0);
});

test("Range section warning produced for cs_pos_2.json", () => {
  let cs_sched = fs.readFileSync(
    "./backend/test/mock_schedules/cs_pos_2.json",
    "utf-8"
  );
  let cs_sched_obj = JSON.parse(cs_sched);

  let csMajor = fs.readFileSync(
    "./backend/test/mock_majors/bscs.json",
    "utf-8"
  );

  let csMajor_obj = JSON.parse(csMajor);

  let reqWarnings = warning_generator.produceRequirementGroupWarning(
    cs_sched_obj,
    csMajor_obj
  );

  expect(reqWarnings.length).toBe(1);

  expect(reqWarnings).toContainEqual({
    message:
      "Computer Science Elective Courses: requirement not satisfied: (complete 8 credits from CS 2500-5010 IS 2000-4900 DS 2000-4900)",
    requirementGroup: "Computer Science Elective Courses",
  });
});

test("Requirement group warnings produced appropriately for cs_sched_1.json", () => {
  let cs_sched = fs.readFileSync(
    "./backend/test/mock_schedules/cs_sched_1.json",
    "utf-8"
  );
  let cs_sched_obj = JSON.parse(cs_sched);

  let csMajor = fs.readFileSync(
    "./backend/test/mock_majors/bscs.json",
    "utf-8"
  );

  let csMajor_obj = JSON.parse(csMajor);

  let reqWarnings = warning_generator.produceRequirementGroupWarning(
    cs_sched_obj,
    csMajor_obj
  );

  expect(reqWarnings.length).toBeGreaterThan(0);

  for (const warning of reqWarnings) {
    expect(warning).toBeDefined();
    expect(warning).toHaveProperty("message");
    expect(warning).toHaveProperty("requirementGroup");
  }

  expect(reqWarnings).toContainEqual({
    message: "Computer Science Overview: requirement not satisfied: CS 1210",
    requirementGroup: "Computer Science Overview",
  });

  expect(reqWarnings).toContainEqual({
    message:
      "Computer Science Required Courses: requirement not satisfied: CS 3700 AND CS 3800 AND CS 4400 AND (CS 4500 and CS 4501)",
    requirementGroup: "Computer Science Required Courses",
  });

  expect(reqWarnings).toContainEqual({
    message: "Presentation Requirement: requirement not satisfied: THTR 1170",
    requirementGroup: "Presentation Requirement",
  });

  expect(reqWarnings).toContainEqual({
    message:
      "Advanced Writing in the Disciplines: requirement not satisfied: (ENGW 3302 or ENGW 3315)",
    requirementGroup: "Advanced Writing in the Disciplines",
  });
});

test("Requirement group warnings produced appropriately for cs_sched_2.json", () => {
  let cs_sched = fs.readFileSync(
    "./backend/test/mock_schedules/cs_sched_2.json",
    "utf-8"
  );
  let cs_sched_obj = JSON.parse(cs_sched);

  let csMajor = fs.readFileSync(
    "./backend/test/mock_majors/bscs.json",
    "utf-8"
  );

  let csMajor_obj = JSON.parse(csMajor);

  let reqWarnings = warning_generator.produceRequirementGroupWarning(
    cs_sched_obj,
    csMajor_obj
  );

  expect(reqWarnings.length).toBeGreaterThan(0);

  for (const warning of reqWarnings) {
    expect(warning).toBeDefined();
    expect(warning).toHaveProperty("message");
    expect(warning).toHaveProperty("requirementGroup");
  }

  // and course
  expect(reqWarnings).toContainEqual({
    message: "Computer Science Overview: requirement not satisfied: CS 1210",
    requirementGroup: "Computer Science Overview",
  });

  //and section
  expect(reqWarnings).toContainEqual({
    message:
      "Computer Science Required Courses: requirement not satisfied: CS 3700 AND CS 4400 AND (CS 4500 and CS 4501)",
    requirementGroup: "Computer Science Required Courses",
  });

  //and section
  expect(reqWarnings).toContainEqual({
    message: "Presentation Requirement: requirement not satisfied: THTR 1170",
    requirementGroup: "Presentation Requirement",
  });

  //or section
  expect(reqWarnings).toContainEqual({
    message:
      "Computer Science Capstone: requirement not satisfied: need 4 credits from: (CS 4100 or CS 4300 or CS 4410 or CS 4150 or CS 4550 or CS 4991 or IS 4900)",
    requirementGroup: "Computer Science Capstone",
  });

  expect(reqWarnings).toContainEqual({
    message:
      "Advanced Writing in the Disciplines: requirement not satisfied: (ENGW 3302 or ENGW 3315)",
    requirementGroup: "Advanced Writing in the Disciplines",
  });
});
