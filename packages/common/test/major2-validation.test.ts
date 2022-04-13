import {
  AndErrorNoSolution,
  getConcentrationsRequirement,
  Major2ValidationTracker,
  validateMajor2,
  validateRequirement,
} from "../src/major2-validation";
import {
  Concentrations2,
  IAndCourse2,
  ICourseRange2,
  IMajorRequirementGroup,
  IOrCourse2,
  IRequiredCourse,
  IXofManyCourse,
  Major,
  Major2,
  Requirement,
  Requirement2,
  ScheduleCourse,
  Section,
  Err,
  Ok,
} from "../src/types";
import { assertUnreachable, courseToString } from "../src/course-utils";
import bscs from "../../scrapers/test/mock_majors/bscs.json";

type TestCourse = IRequiredCourse & { credits: number };
const course = (
  subject: string,
  classId: number,
  credits?: number
): TestCourse => ({
  subject,
  type: "COURSE",
  classId: classId,
  credits: credits ?? 4,
});
const convert = (c: TestCourse): ScheduleCourse => ({
  ...c,
  classId: String(c.classId),
  name: courseToString(c),
  numCreditsMax: c.credits,
  numCreditsMin: c.credits,
});
const or = (...courses: Requirement2[]): IOrCourse2 => ({
  type: "OR",
  courses,
});
const and = (...courses: Requirement2[]): IAndCourse2 => ({
  type: "AND",
  courses,
});
const range = (
  creditsRequired: number,
  subject: string,
  idRangeStart: number,
  idRangeEnd: number,
  exceptions: IRequiredCourse[]
): ICourseRange2 => ({
  type: "RANGE",
  subject,
  idRangeStart,
  idRangeEnd,
  exceptions,
});
const xom = (
  numCreditsMin: number,
  courses: Requirement2[]
): IXofManyCourse => ({
  type: "XOM",
  numCreditsMin,
  courses,
});
const section = (
  title: string,
  minRequirementCount: number,
  requirements: Requirement2[]
): { type: "SECTION" } & Section => ({
  title,
  requirements,
  minRequirementCount,
  type: "SECTION",
});
const solution = (...sol: (string | TestCourse)[]) => {
  const credits = sol
    .map((c) => (typeof c === "string" ? 4 : c.credits))
    .reduce((total, c) => total + c, 0);
  return {
    minCredits: credits,
    maxCredits: credits,
    sol: sol.map((s) => (typeof s === "string" ? s : courseToString(s))),
  };
};
const concentrations = (
  minOptions: number,
  ...concentrationOptions: Section[]
): Concentrations2 => ({
  minOptions,
  concentrationOptions,
});
const makeTracker = (...courses: TestCourse[]) => {
  return new Major2ValidationTracker(courses.map(convert));
};
const cs2810 = course("CS", 2810);
const cs3950 = course("CS", 3950);
const cs4805 = course("CS", 4805);
const cs4810 = course("CS", 4810);
const cs4830 = course("CS", 4830);
const cs4820 = course("CS", 4820);
const cs4950 = course("CS", 4950, 1);
const ds3000 = course("DS", 3000);
const cy4770 = course("CS", 4770);
const cs1200 = course("CS", 1200, 1);
const cs1210 = course("CS", 1210, 1);
const cs1800 = course("CS", 1800);
const cs1802 = course("CS", 1802, 1);
const cs2500 = course("CS", 2500);
const cs2501 = course("CS", 2501, 1);
const cs2510 = course("CS", 2510);
const cs2511 = course("CS", 2511, 1);
const cs2800 = course("CS", 2800);
const cs2801 = course("CS", 2801, 1);
const cs3000 = course("CS", 3000);
const cs3500 = course("CS", 3500);
const cs3650 = course("CS", 3650);
const cs3700 = course("CS", 3700);
const cs3800 = course("CS", 3800);
const cs4400 = course("CS", 4400);
const cs4500 = course("CS", 4500);
const cs4501 = course("CS", 4501);
const thtr1170 = course("THTR", 1170, 1);
const cs4410 = course("CS", 4410);
const cs2550 = course("CS", 2550);
const ds4300 = course("DS", 4300);
const cs4300 = course("CS", 4300);
const math1341 = course("MATH", 1341);
const math1342 = course("MATH", 1342);
const math2331 = course("MATH", 2331);
const math3081 = course("MATH", 3081);
const phil1145 = course("PHIL", 1145);
const eece2160 = course("EECE", 2160);
const chem1211 = course("CHEM", 1211, 3);
const chem1212 = course("CHEM", 1212, 1);
const chem1213 = course("CHEM", 1213, 1);
const chem1214 = course("CHEM", 1214, 3);
const chem1215 = course("CHEM", 1215, 1);
const chem1216 = course("CHEM", 1216, 1);
const phys1151 = course("PHYS", 1151, 3);
const phys1152 = course("PHYS", 1152, 1);
const phys1153 = course("PHYS", 1153, 1);
const phys1155 = course("PHYS", 1155, 3);
const phys1156 = course("PHYS", 1156, 1);
const phys1157 = course("PHYS", 1157, 1);
const engw1111 = course("ENGW", 1111);
const engw3302 = course("ENGW", 3302);
const cs1990 = course("CS", 1990);
const hist1130 = course("HIST", 1130);
const math2321 = course("MATH", 2321);
const honr1310 = course("HONR", 1310);
const math3527 = course("MATH", 3527);
const artg1250 = course("ARTG", 1250);
const artg2400 = course("ARTG", 2400);
describe("validateRequirement suite", () => {
  // (CS2810 or CS2800) and (CS2810 or DS3000)
  const cs2810orcs2800 = or(cs2810, cs2800);
  const cs2810ords3000 = or(cs2810, ds3000);
  const cs2000tocs3000 = range(8, "CS", 2000, 3000, []);
  const rangeException = range(4, "CS", 2000, 4000, [cs2810]);
  const xom8credits = xom(8, [cs2800, cs2810, ds3000]);
  const xom4credits = xom(4, [cs2500, cs2501]);
  const xom4creditsWrongOrder = xom(4, [cs2501, cs2500]);
  const input = and(cs2810orcs2800, cs2810ords3000);
  const tracker = makeTracker(cs2800, cs2810, ds3000, cs3500);
  const xomTracker = makeTracker(cs2500, cs2501);
  test("or 1", () => {
    expect(validateRequirement(cs2810orcs2800, tracker)).toEqual(
      Ok([solution("CS2810"), solution("CS2800")])
    );
  });
  test("or 2", () => {
    expect(validateRequirement(cs2810ords3000, tracker)).toEqual(
      Ok([solution("CS2810"), solution("DS3000")])
    );
  });
  test("and of ors", () => {
    expect(validateRequirement(input, tracker)).toEqual(
      Ok([
        // (CS2810 or CS2800) and (CS2810 or DS3000)
        solution("CS2810", "DS3000"),
        solution("CS2800", "CS2810"),
        solution("CS2800", "DS3000"),
      ])
    );
  });
  test("and no solutions", () => {
    expect(
      validateRequirement(
        and(and(cs2810, cs2800), and(cs2810, cs2800)),
        tracker
      )
    ).toEqual(Err(AndErrorNoSolution(1)));
  });
  test("range of courses", () => {
    expect(validateRequirement(cs2000tocs3000, tracker)).toEqual(
      Ok([solution(cs2800), solution("CS2800", "CS2810"), solution(cs2810)])
    );
  });
  test("range of courses with exception", () => {
    expect(validateRequirement(rangeException, tracker)).toEqual(
      Ok([solution("CS2800"), solution(cs2800, cs3500), solution("CS3500")])
    );
  });
  test("XOM requirement", () => {
    expect(validateRequirement(xom8credits, tracker)).toEqual(
      Ok([
        solution("CS2800", "CS2810"),
        solution("CS2800", "DS3000"),
        solution("CS2810", "DS3000"),
      ])
    );
  });
  test("XOM requirement without duplicates", () => {
    expect(validateRequirement(xom4credits, xomTracker)).toEqual(
      Ok([solution("CS2500")])
    );
  });
  test("XOM requirement without duplicates in wrong order", () => {
    expect(validateRequirement(xom4creditsWrongOrder, xomTracker)).toEqual(
      Ok([solution(cs2501, cs2500), solution("CS2500")])
    );
  });
  const foundations = section("Foundations", 2, [
    xom(8, [or(and(cs2800, cs2801), cs4820), or(cs4805, cs4810)]),
    xom(8, [
      cs4805,
      cs4810,
      cs4820,
      cs4830,
      and(cs3950, cs4950, cs4950),
      cy4770,
    ]),
  ]);
  const foundationsCourses1 = makeTracker(
    cs2801,
    cs2800,
    cs4810,
    cs4805,
    cs3950,
    cs4950,
    cs4950
  );
  test("integration", () => {
    expect(validateRequirement(foundations, foundationsCourses1)).toEqual(
      Ok([
        solution(cs2800, cs2801, cs4810, cs4805, cs3950, cs4950, cs4950),
        solution(cs2800, cs2801, cs4805, cs4810, cs3950, cs4950, cs4950),
      ])
    );
  });

  test("section", () => {
    const tracker = makeTracker(cs2800, cs2810);
    const r = section("s1", 2, [cs2800, cs2810, cs3500]);
    expect(validateRequirement(r, tracker)).toEqual(
      Ok([solution(cs2800, cs2810)])
    );
  });
  test("range allows duplicates", () => {
    const tracker = makeTracker(cs2800, cs2800);
    const r = range(8, "CS", 2000, 3000, []);
    expect(validateRequirement(r, tracker)).toEqual(
      Ok([solution(cs2800), solution(cs2800, cs2800), solution(cs2800)])
    );
  });
  test("concentrations", () => {
    const twoConcentrations = concentrations(
      2,
      section("1", 1, [cs2800]),
      section("2", 1, [cs2810]),
      section("3", 1, [ds3000])
    );
    expect(
      validateRequirement(
        getConcentrationsRequirement([1, "3"], twoConcentrations)[0],
        tracker
      )
    ).toEqual(Ok([solution(cs2810, ds3000)]));
  });
});

function convertToMajor2(old: Major): Major2 {
  return {
    name: old.name,
    totalCreditsRequired: old.totalCreditsRequired,
    yearVersion: old.yearVersion,
    requirementSections: Object.values(old.requirementGroupMap).map(
      convertToSection
    ),
    concentrations: {
      minOptions: old.concentrations.minOptions,
      concentrationOptions: old.concentrations.concentrationOptions.map(
        (c) => ({
          type: "SECTION",
          title: c.name,
          minRequirementCount: c.requirementGroups.length,
          requirements: Object.values(c.requirementGroupMap).map(
            convertToSection
          ),
        })
      ),
    },
  };
}

function convertToSection(r: IMajorRequirementGroup): Section {
  switch (r.type) {
    case "AND":
      return {
        type: "SECTION",
        minRequirementCount: r.requirements.length,
        requirements: r.requirements.map(convertToRequirement2),
        title: r.name,
      };
    case "OR":
      return {
        type: "SECTION",
        title: r.name,
        minRequirementCount: 1,
        requirements: [
          {
            type: "XOM",
            numCreditsMin: r.numCreditsMin,
            courses: r.requirements.map(convertToRequirement2),
          },
        ],
      };
    case "RANGE":
      return {
        type: "SECTION",
        title: r.name,
        minRequirementCount: 1,
        requirements: [convertToRequirement2(r.requirements)],
      };
    default:
      return assertUnreachable(r);
  }
}

function convertToRequirement2(r: Requirement): Requirement2 {
  switch (r.type) {
    case "OR":
      return {
        type: "OR",
        courses: r.courses.map(convertToRequirement2),
      };
    case "AND":
      return {
        type: "AND",
        courses: r.courses.map(convertToRequirement2),
      };
    case "RANGE":
      return {
        type: "XOM",
        numCreditsMin: r.creditsRequired,
        courses: r.ranges.map((r) => ({
          type: "RANGE",
          exceptions: [],
          idRangeStart: r.idRangeStart,
          idRangeEnd: r.idRangeEnd,
          subject: r.subject,
        })),
      };
    case "COURSE":
      return r;
    case "CREDITS":
      return {
        type: "XOM",
        numCreditsMin: r.minCredits,
        courses: r.courses.map(convertToRequirement2),
      };
    default:
      return assertUnreachable(r);
  }
}

describe("integration suite", () => {
  const bscs2 = convertToMajor2(bscs as any);
  const taken = [
    cs1200,
    cs1210,
    cs1800,
    cs1802,
    cs2500,
    cs2501,
    cs2510,
    cs2511,
    cs2800,
    cs2801,
    cs3000,
    cs3500,
    cs3650,
    cs3700,
    cs3800,
    cs4400,
    cs4500,
    cs4501,
    cs4410,
    cs2550,
    ds4300,
    cs1990,
    cs1990,
    thtr1170,
    math1341,
    math1342,
    math2331,
    math3081,
    phil1145,
    eece2160,
    phys1151,
    phys1152,
    phys1153,
    phys1155,
    phys1156,
    phys1157,
    engw1111,
    engw3302,
    hist1130,
    math2321,
    honr1310,
    math3527,
    artg1250,
    artg2400,
  ];
  const tracker = makeTracker(...taken);
  const scheduleCourses = taken.map(convert);
  for (const r of bscs2.requirementSections) {
    test(r.title, () => {
      validateRequirement(r, tracker);
    });
  }
  test("alex's full major", () => {
    const actual = validateMajor2(bscs2, scheduleCourses);
    const expected = [
      solution(
        cs1200,
        cs1210,
        cs1800,
        cs1802,
        cs2500,
        cs2501,
        cs2510,
        cs2511,
        cs2800,
        cs2801,
        cs3000,
        cs3500,
        cs3650,
        cs3700,
        cs3800,
        cs4400,
        cs4500,
        cs4501,
        thtr1170,
        cs4410,
        cs2550,
        ds4300,
        math1341,
        math1342,
        math2331,
        math3081,
        phil1145,
        eece2160,
        phys1151,
        phys1152,
        phys1153,
        phys1155,
        phys1156,
        phys1157,
        engw1111,
        engw3302
      ),
    ];
    expect(actual).toEqual(Ok(expected));
    expect(taken.length).toBeGreaterThan(expected.length);
  });
  test("cindy's full major", () => {
    const taken = [
      cs1200,
      cs1800,
      cs1802,
      cs2500,
      cs2501,
      engw1111,
      cs2510,
      cs2511,
      cs2810,
      cs2800,
      cs2801,
      cs3500,
      math3081,
      math1341,
      math1342,
      math2331,
      cs1210,
      cs3000,
      cs3650,
      thtr1170,
      engw3302,
      chem1211,
      chem1212,
      chem1213,
      chem1214,
      chem1215,
      chem1216,
      cs3700,
      cs3800,
      phil1145,
      phys1151,
      phys1152,
      phys1153,
      phys1155,
      phys1156,
      phys1157,
      ds3000,
      cs4400,
      cs4500,
      cs4501,
      cs4300,
      eece2160,
    ];
    const baseClasses = [
      cs1200,
      cs1210,
      cs1800,
      cs1802,
      cs2500,
      cs2501,
      cs2510,
      cs2511,
      cs2800,
      cs2801,
      cs3000,
      cs3500,
      cs3650,
      cs3700,
      cs3800,
      cs4400,
      cs4500,
      cs4501,
      thtr1170,
      cs4300,
      cs2810,
      ds3000,
      math1341,
      math1342,
      math2331,
      math3081,
      phil1145,
      eece2160,
    ];
    const engReqs = [engw1111, engw3302];
    const physReqs = [
      phys1151,
      phys1152,
      phys1153,
      phys1155,
      phys1156,
      phys1157,
    ];
    const chemReqs = [
      chem1211,
      chem1212,
      chem1213,
      chem1214,
      chem1215,
      chem1216,
    ];
    const expectedWithChem = solution(...baseClasses, ...chemReqs, ...engReqs);
    const expectedWithPhys = solution(...baseClasses, ...physReqs, ...engReqs);
    const scheduleCourses = taken.map(convert);
    const actual = validateMajor2(bscs2, scheduleCourses);
    expect(actual).toEqual(Ok([expectedWithChem, expectedWithPhys]));
  });
});
