import {
  Major2ValidationTracker,
  validateConcentrations,
  validateRequirement,
} from "frontend/src/utils/major2-validation";
import {
  Concentrations2,
  IAndCourse2,
  ICourseRange2,
  IOrCourse2,
  IRequiredCourse,
  IXofManyCourse,
  Requirement2,
  ScheduleCourse,
  Section,
} from "../../common/types";
import { courseToString } from "frontend/src/utils/course-helpers";

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
  creditsRequired,
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
    .map(c => (typeof c === "string" ? 4 : c.credits))
    .reduce((total, c) => total + c, 0);
  return {
    minCredits: credits,
    maxCredits: credits,
    sol: sol.map(s => (typeof s === "string" ? s : courseToString(s))),
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
describe("validateRequirement suite", () => {
  // (CS2810 or CS2800) and (CS2810 or DS3000)
  const cs2800 = course("CS", 2800);
  const cs2810 = course("CS", 2810);
  const ds3000 = course("DS", 3000);
  const cs3500 = course("CS", 3500);
  const cs2810orcs2800 = or(cs2810, cs2800);
  const cs2810ords3000 = or(cs2810, ds3000);
  const cs2000tocs3000 = range(8, "CS", 2000, 3000, []);
  const rangeException = range(4, "CS", 2000, 4000, [cs2810]);
  const xom8credits = xom(8, [cs2800, cs2810, ds3000]);
  const input = and(cs2810orcs2800, cs2810ords3000);
  const tracker = makeTracker(cs2800, cs2810, ds3000, cs3500);
  test("or 1", () => {
    expect(validateRequirement(cs2810orcs2800, tracker)).toEqual([
      solution("CS2810"),
      solution("CS2800"),
    ]);
  });
  test("or 2", () => {
    expect(validateRequirement(cs2810ords3000, tracker)).toEqual([
      solution("CS2810"),
      solution("DS3000"),
    ]);
  });
  test("and of ors", () => {
    expect(validateRequirement(input, tracker)).toEqual([
      solution("CS2810", "DS3000"),
      solution("CS2800", "CS2810"),
      solution("CS2800", "DS3000"),
    ]);
  });
  test("and no solutions", () => {
    expect(
      validateRequirement(
        and(and(cs2810, cs2800), and(cs2810, cs2800)),
        tracker
      )
    ).toEqual([]);
  });
  test("range of courses", () => {
    expect(validateRequirement(cs2000tocs3000, tracker)).toEqual([
      solution("CS2800", "CS2810"),
    ]);
  });
  test("range of courses with exception", () => {
    expect(validateRequirement(rangeException, tracker)).toEqual([
      solution("CS2800"),
      solution("CS3500"),
    ]);
  });
  test("XOM requirement", () => {
    expect(validateRequirement(xom8credits, tracker)).toEqual([
      solution("CS2800", "CS2810"),
      solution("CS2800", "DS3000"),
      solution("CS2810", "DS3000"),
    ]);
  });
  const cs2801 = course("CS", 2801, 1);
  const cs4820 = course("CS", 4820);
  const cs4805 = course("CS", 4805);
  const cs4810 = course("CS", 4810);
  const cs4830 = course("CS", 4830);
  const cs3950 = course("CS", 3950);
  const cs4950 = course("CS", 4950, 1);
  const cy4770 = course("CS", 4770);
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
    expect(validateRequirement(foundations, foundationsCourses1)).toEqual([
      solution(cs2800, cs2801, cs4810, cs4805, cs3950, cs4950, cs4950),
      solution(cs2800, cs2801, cs4805, cs4810, cs3950, cs4950, cs4950),
    ]);
  });

  test("section", () => {
    const tracker = makeTracker(cs2800, cs2810);
    const r = section("s1", 2, [cs2800, cs2810, cs3500]);
    expect(validateRequirement(r, tracker)).toEqual([solution(cs2800, cs2810)]);
  });
  test("range allows duplicates", () => {
    const tracker = makeTracker(cs2800, cs2800);
    const r = range(8, "CS", 2000, 3000, []);
    expect(validateRequirement(r, tracker).length).toBeGreaterThan(0);
  });
  test("concentrations", () => {
    const twoConcentrations = concentrations(
      2,
      section("1", 1, [cs2800]),
      section("2", 1, [cs2810]),
      section("3", 1, [ds3000])
    );
    expect(
      validateConcentrations([1, "3"], twoConcentrations, tracker)
    ).toEqual([solution(cs2810, ds3000)]);
  });
});
