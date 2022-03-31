import {
  AndErrorNoSolution,
  assertUnreachable,
  Err,
  getConcentrationsRequirement,
  Major2ValidationTracker,
  Ok,
  sectionToReq2,
  validateMajor2,
  validateRequirement,
} from "../src/utils/major2-validation";
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
} from "@graduate/common";
import { courseToString } from "../src/utils/course-helpers";
import bscs from "../../scrapers/test/mock_majors/bscs.json";

// case where two of the same course is required, should be false
// a & a, [a] -> false
// case where course could be used in two places, but only one produces OK
// (a | c) & a, [a, c] -> true
// same as above, but not toplevel and
// (a | (b & c)) & (a | (b & c)), [a, b, c] -> true
// (a | b | c | d) & (a | b), [b, d] -> true
// (a | b | c | d) & (a | b), [b] -> false

// foundations
// https://catalog.northeastern.edu/undergraduate/computer-information-science/computer-science/bscs/#programrequirementstext
// (((a & b) | c) & (d | e)) & (d | e)
// [d, e, c] -> true
// [d, e, a, b] -> true
// [d, c] -> false
// [d, a, b] -> false

// counterexample
// (a | b | c) & a, [a, b]
// generative recursion -> non-structural recursion
// ((a | b) & (b | d)) & a, [a, b, d]
// generative recursion -> non0-structural recursion
// ((a    ) & (b    )) & error -> ideally we pop all the way back to when we used 'a'
// ((a    ) & (    d)) & error
// ((  | b) & (    d)) & a -> OK

// OR we can use a-normal form! above gets transformed into the following:
// let 1 = a | b
// let 2 = b | d
// let 3 = 1 & 2
// let 4 = a
// 3 & 4

// let's say we implement this. what next?
// => we need errors!
// what error should we use? probably the deepest one in the ANF expression
// => also, what is the solution?
// if the solution is different from the default one, we should display a warning telling student where they will need to override
// to do this, diff our solution w the default one
// default: meaning the one the audit uses by default (w/out overrides)
// => are there other solutions?
// idk if we'll need this yet

// but wait! how simple is the anf _really_?
// ((a & b) | (c & d)) & b
// let 1 = a & b
// let 2 = c & d
// let 3 = 1 | 2
// let 4 = 3 & b

// problem! we evaluate 1 and 2, but we should only evaluate 1 _or_ 2
// solution:
// And(l, r) -> If((l,true), (true, r), false)
// Or(l, r)  -> If((l,false), true, (false, r))
// ((a & b) | (c & d)) & b =>
// let 1 = (If (a & b) then true else (c & d))
// let 4 = (If 1 then b else false)
// transform & of more than 2 items
// (a & b & c) =>
// let 1 = if a then b else false
// let 2 = if 1 then c else false
//

// david feedback
// doesn't seem too complicated?

// sumit
// compute all cases, take the intersection.
// consider all non-intersecting options, permute
// reach out to Pete Manolios (logic and computation)

// dillon idea
// important idea: iterate by course, not by req.
// 1. create mapping [course -> list of atoms that it could satisfy], where atom = range or coursereq
// 2. pick the first course. perform backtracking with each course.
// important: include the case where the course is not used.
// potential problem: might be very slow. it runs into solutions LAST, vs previous req, will go through everything

// things to do:
// - 1. look into how we can use https://github.com/charkour/csps, perhaps read into background of how
//      csps work: http://aima.cs.berkeley.edu/
// - 2. begin thinking about how to structure/design a program for dillon's algorithm.
// -    would be a way to structural recursion backtracking.

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
const math1341 = course("MATH", 1341);
const math1342 = course("MATH", 1342);
const math2331 = course("MATH", 2331);
const math3081 = course("MATH", 3081);
const phil1145 = course("PHIL", 1145);
const eece2160 = course("EECE", 2160);
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
          title: c.name,
          minRequirementCount: c.requirementGroups.length,
          requirements: Object.values(c.requirementGroupMap)
            .map(convertToSection)
            .map(sectionToReq2),
        })
      ),
    },
  };
}

function convertToSection(r: IMajorRequirementGroup): Section {
  switch (r.type) {
    case "AND":
      return {
        minRequirementCount: r.requirements.length,
        requirements: r.requirements.map(convertToRequirement2),
        title: r.name,
      };
    case "OR":
      return {
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
      validateRequirement(sectionToReq2(r), tracker);
    });
  }
  test("full major", () => {
    const actual = validateMajor2(bscs2, scheduleCourses);
    const expected = {
      ok: true,
      majorRequirementsError: null,
      totalCreditsRequirementError: null,
      solutions: [
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
      ],
    };
    expect(actual).toEqual(expected);
    expect(taken.length).toBeGreaterThan(expected.solutions[0].sol.length);
  });

  // const bscsMajor2 =convertToMajor2(bscs as Major);
});
