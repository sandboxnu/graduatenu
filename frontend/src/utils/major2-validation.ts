import {
  Concentrations2,
  IAndCourse2,
  ICourseRange2,
  IOrCourse2,
  IRequiredCourse,
  IScheduleCourse,
  IXofManyCourse,
  Major2,
  Requirement2,
  ScheduleCourse,
  Section,
} from "../../../common/types";
import { courseToString } from "./course-helpers";

type Solution = {
  minCredits: number;
  maxCredits: number;
  sol: Array<string>;
};

type MajorValidationError =
  | CourseError
  | RangeError
  | AndError
  | OrError
  | XOMError
  | SectionError;
type CourseError = {
  type: "COURSE";
  requiredCourse: string;
};
const CourseError = (c: IRequiredCourse): CourseError => ({
  type: "COURSE",
  requiredCourse: courseToString(c),
});
type RangeError = {
  type: "RANGE";
  requiredCredits: number;
  maxPossibleCredits: number;
};
const RangeError = (
  r: ICourseRange2,
  maxPossibleCredits: number
): RangeError => ({
  type: "RANGE",
  requiredCredits: r.creditsRequired,
  maxPossibleCredits,
});
type AndError = {
  type: "AND";
  error:
    | {
        type: "UNSATISFIED_CHILD";
        childErrors: Array<{ childIndex: number } & MajorValidationError>;
      }
    | {
        type: "NO_SOLUTION";
        discoveredAtChild: number;
      };
};
const AndErrorUnsatChild = (
  childErrors: Array<MajorValidationError & { childIndex: number }>
): AndError => ({
  type: "AND",
  error: { type: "UNSATISFIED_CHILD", childErrors },
});
export const AndErrorNoSolution = (idx: number): AndError => ({
  type: "AND",
  error: { type: "NO_SOLUTION", discoveredAtChild: idx },
});
type OrError = {
  type: "OR";
  childErrors: Array<{ childIndex: number } & MajorValidationError>;
};
const OrError = (
  childErrors: Array<{ childIndex: number } & MajorValidationError>
): OrError => ({
  type: "OR",
  childErrors,
});
type XOMError = {
  type: "XOM";
  childErrors: Array<{ childIndex: number } & MajorValidationError>;
  minRequiredCredits: number;
  maxPossibleCredits: number;
};
const XOMError = (
  r: IXofManyCourse,
  childErrors: Array<{ childIndex: number } & MajorValidationError>,
  maxPossibleCredits: number
): XOMError => ({
  type: "XOM",
  childErrors,
  minRequiredCredits: r.numCreditsMin,
  maxPossibleCredits,
});
type SectionError = {
  type: "SECTION";
  childErrors: Array<{ childIndex: number } & MajorValidationError>;
  minRequiredChildCount: number;
  maxPossibleChildCount: number;
};
const SectionError = (
  r: Section,
  childErrors: Array<{ childIndex: number } & MajorValidationError>,
  max: number
): SectionError => ({
  type: "SECTION",
  childErrors,
  minRequiredChildCount: r.minRequirementCount,
  maxPossibleChildCount: max,
});
type Result<T, E> = { ok: T; type: "OK" } | { err: E; type: "ERR" };
export const Ok = <T, E>(ok: T): Result<T, E> => ({ ok, type: "OK" });
export const Err = <T, E>(err: E): Result<T, E> => ({ err, type: "ERR" });

const assertUnreachable = (_: never): never => {
  throw new Error("This code is unreachable");
};

const sectionToReq2 = (s: Section): Requirement2 => ({ ...s, type: "SECTION" });

interface CourseValidationTracker {
  get(input: IScheduleCourse): ScheduleCourse | null;

  getCount(input: IScheduleCourse): number;

  getAll(subject: string, start: number, end: number): Array<ScheduleCourse>;

  hasEnoughCoursesForBoth(s1: Solution, s2: Solution): boolean;
}

// exported for testing
export class Major2ValidationTracker implements CourseValidationTracker {
  private currentCourses: Map<string, [ScheduleCourse, number]>;

  constructor(courses: ScheduleCourse[]) {
    this.currentCourses = new Map();
    for (const c of courses) {
      const cs = courseToString(c);
      let tup = this.currentCourses.get(cs);
      if (!tup) {
        // assume each course instance is the same
        tup = [c, 0];
        this.currentCourses.set(cs, tup);
      }
      tup[1] += 1;
    }
  }

  get(input: IScheduleCourse) {
    return this.currentCourses.get(courseToString(input))?.[0] ?? null;
  }

  getCount(input: IScheduleCourse) {
    return this.currentCourses.get(courseToString(input))?.[1] ?? 0;
  }

  getAll(subject: string, start: number, end: number) {
    return Array.from(this.currentCourses.values()).flatMap(([c, count]) => {
      let cid = Number(c.classId);
      let valid = c.subject === subject && cid >= start && cid <= end;
      if (!valid) return [];
      return Array(count).fill(c);
    });
  }

  hasEnoughCoursesForBoth(s1: Solution, s2: Solution) {
    let s1map = Major2ValidationTracker.createTakenMap(s1);
    let s2map = Major2ValidationTracker.createTakenMap(s2);
    // iterate through the solution with fewer courses for speed
    let [fst, snd] =
      s1.sol.length < s2.sol.length ? [s1map, s2map] : [s2map, s1map];
    // for all courses in both solutions, check we have enough courses
    for (let [cs, fstCount] of fst) {
      let sndCount = snd.get(cs);
      if (!sndCount) continue;
      const neededCount = fstCount + sndCount;
      const tup = this.currentCourses.get(cs);
      if (!tup) {
        throw new Error("Solution contained a course that the tracker did not");
      }
      const actualCount = tup[1];
      if (actualCount < neededCount) {
        return false;
      }
    }
    return true;
  }

  private static createTakenMap(s: Solution): Map<string, number> {
    const map = new Map();
    for (const c of s.sol) {
      const val = map.get(c) ?? 0;
      map.set(c, val + 1);
    }
    return map;
  }
}

// students may not have chosen a concentration yet
export function validateMajor2(
  major: Major2,
  taken: ScheduleCourse[],
  concentrations?: string | number | (string | number)[]
) {
  const tracker = new Major2ValidationTracker(taken);
  validateConcentrations(concentrations, major.concentrations, tracker);

  const courses = major.requirementSections.map(sectionToReq2);

  const solutions = validateSectionRequirement(
    {
      title: "Overall Major Validation (Generated by Major validation)",
      requirements: courses,
      minRequirementCount: courses.length,
    },
    tracker
  );
  if (solutions.type === "ERR") {
    /*
    error base cases:
    - requirement course - single error
    - range - single error
    - or
    - xom
    - section
    - and
    - - in the above cases (excluding course) we can include child errors

    or: you didn't satisfy 1 or more of these. here's why: <all child errors>
    xom: you didn't satisfy the min credit count. <non-valid child errors>
    section: you didn't satisfy the min child count. <non-valid child errors>
    and: you didn't satisfy all the children. <non-valid child errors>

    (a & b)
    a errors ->
    And([child 0 failed: a not satisfied])

    type Error: SingleError | ParentError

    type SingleError:
    - type: "SINGLE"
    - req type:
    - message: string

    type ParentError extends
    - type: "PARENT"
    - req type: what req caused the error
    - message: string
    - child errors: Array<{ childIndex: number, e: Error }>
    */
  }

  throw new Error("unimplemented!");

  const totalCreditsRequiredError = validateTotalCreditsRequired(
    major.totalCreditsRequired,
    taken
  );
}

export function validateConcentrations(
  inputConcentrations: undefined | string | number | (string | number)[],
  concentrationsRequirement: Concentrations2,
  tracker: Major2ValidationTracker
) {
  const selectedConcentrations = convertToConcentrationsArray(
    inputConcentrations
  );
  const concentrationRequirements = [];
  for (const c of selectedConcentrations) {
    const found = concentrationsRequirement.concentrationOptions.find(
      (cf, idx) => {
        switch (typeof c) {
          case "number":
            return c === idx;
          case "string":
            return c === cf.title;
          default:
            return assertUnreachable(c);
        }
      }
    );
    if (!found) {
      throw new Error(
        `Concentration specified was not found in the major: ${c}`
      );
    }
    concentrationRequirements.push(found);
  }
  return validateSectionRequirement(
    {
      title: "Concentrations Section (Generated by concentration validation)",
      requirements: concentrationRequirements.map(sectionToReq2),
      minRequirementCount: concentrationsRequirement.minOptions,
    },
    tracker
  );
}

function convertToConcentrationsArray(
  concentrations: undefined | string | number | (string | number)[]
) {
  if (concentrations === undefined) {
    return [];
  }
  if (
    typeof concentrations === "string" ||
    typeof concentrations === "number"
  ) {
    return [concentrations];
  }
  return concentrations;
}

// invariant: the solutions returned will each ALWAYS have no duplicate courses
export const validateRequirement = (
  req: Requirement2,
  tracker: CourseValidationTracker
): Result<Array<Solution>, MajorValidationError> => {
  switch (req.type) {
    // base cases
    case "RANGE":
      return validateRangeRequirement(req, tracker);
    case "COURSE":
      return validateCourseRequirement(req, tracker);
    // inductive cases
    case "AND":
      return validateAndRequirement(req, tracker);
    case "XOM":
      return validateXomRequirement(req, tracker);
    case "OR":
      return validateOrRequirement(req, tracker);
    case "SECTION":
      return validateSectionRequirement(req, tracker);
    default:
      return assertUnreachable(req);
  }
};

function validateTotalCreditsRequired(
  requiredCredits: number,
  coursesTaken: ScheduleCourse[]
) {
  const takenCredits = coursesTaken.reduce(
    (total, course) => total + course.numCreditsMax,
    0
  );

  if (takenCredits < requiredCredits) {
    return {
      message: `Total credits taken ${takenCredits} does not meet number of required credits ${requiredCredits}`,
      takenCredits,
      requiredCredits,
    };
  }
  return null;
}

function validateCourseRequirement(
  r: IRequiredCourse,
  tracker: CourseValidationTracker
): Result<Array<Solution>, MajorValidationError> {
  const c = tracker.get(r);
  if (c) {
    return Ok([
      {
        minCredits: c.numCreditsMin,
        maxCredits: c.numCreditsMax,
        sol: [courseToString(c)],
      },
    ]);
  }
  return Err(CourseError(r));
}

function validateRangeRequirement(
  r: ICourseRange2,
  tracker: CourseValidationTracker
): Result<Array<Solution>, MajorValidationError> {
  const exceptions = new Set(r.exceptions.map(courseToString));
  let courses = tracker
    .getAll(r.subject, r.idRangeStart, r.idRangeEnd)
    .filter(c => !exceptions.has(courseToString(c)));

  let unfinishedSolutionsSoFar: Array<Solution> = [];
  let finishedSolutions: Array<Solution> = [];
  // Diff solutions of each requirement in the req

  for (let course of courses) {
    let unfinishedSolutionsWithCourse: Array<Solution> = [];
    const cs = courseToString(course);
    const courseSol = {
      sol: [cs],
      minCredits: course.numCreditsMin,
      maxCredits: course.numCreditsMax,
    };
    for (let solutionSoFar of unfinishedSolutionsSoFar) {
      // TODO: if i take a course twice, can both count in the same range?
      // for now assume yes. but ask khoury, then remove this note
      const currentSol: Solution = combineSolutions(solutionSoFar, courseSol);
      if (currentSol.minCredits >= r.creditsRequired) {
        finishedSolutions.push(currentSol);
      } else {
        unfinishedSolutionsWithCourse.push(currentSol);
      }
    }
    if (course.numCreditsMin >= r.creditsRequired) {
      finishedSolutions.push(courseSol);
    } else {
      unfinishedSolutionsWithCourse.push(courseSol);
    }
    unfinishedSolutionsSoFar.push(...unfinishedSolutionsWithCourse);
  }
  if (finishedSolutions.length > 0) {
    return Ok(finishedSolutions);
  }
  const max = unfinishedSolutionsSoFar.reduce(
    (a, b) => Math.max(a, b.minCredits),
    0
  );
  return Err(RangeError(r, max));
}

/**
 * CS2810 -> Array<Solution> -> [{ min: 4, max: 4, sol: [CS2810]}]
 *
 * (CS2810 or CS2800) -> ???
 * -> Array<Solution> -> [{ min: 4, max: 4, sol: [CS2810]}, { min: 4, max: 4, sol: [CS2800]}]
 *
 * (CS2810 or CS2800) and (CS2810 or DS3000)
 *
 * [{ min: 4, max: 4, sol: [CS2810]}, { min: 4, max: 4, sol: [CS2800]}] -> solutions for r1
 * [{ min: 4, max: 4, sol: [CS2810]}, { min: 4, max: 4, sol: [DS3000]}] -> solutions for r2
 *
 * final set of solutions
 * [{ min: 8, max: 8, sol: [CS2810, DS3000]},
 * { min: 8, max: 8, sol: [CS2800, CS2810]},
 * { min: 8, max: 8, sol: [CS2800, DS3000]}]
 **/
function validateAndRequirement(
  r: IAndCourse2,
  tracker: CourseValidationTracker
): Result<Array<Solution>, MajorValidationError> {
  const [allChildRequirementSolutions, childErrors] = splitChildResults(
    r.courses,
    tracker
  );
  if (childErrors.length > 0) {
    return Err(AndErrorUnsatChild(childErrors));
  }

  // valid solutions for all the requirements so far
  let solutionsSoFar: Array<Solution> = [
    { maxCredits: 0, minCredits: 0, sol: [] },
  ];

  // Diff solutions of each requirement in the AND
  for (
    let childIdx = 0;
    childIdx < allChildRequirementSolutions.length;
    childIdx += 1
  ) {
    const childRequirementSolutions = allChildRequirementSolutions[childIdx];
    const solutionsSoFarWithChild: Array<Solution> = [];
    for (const solutionSoFar of solutionsSoFar) {
      // Each solution of each subsolution
      for (const childSolution of childRequirementSolutions) {
        // if the intersection of us and the solution so far is empty, combine them and add to current solutions
        if (tracker.hasEnoughCoursesForBoth(childSolution, solutionSoFar)) {
          solutionsSoFarWithChild.push(
            combineSolutions(solutionSoFar, childSolution)
          );
        }
      }
    }
    // if there were no solutions added, then there are no valid solutions for the whole and
    if (solutionsSoFarWithChild.length === 0) {
      return Err(AndErrorNoSolution(childIdx));
    }
    solutionsSoFar = solutionsSoFarWithChild;
  }
  return Ok(solutionsSoFar);
}

function validateXomRequirement(
  r: IXofManyCourse,
  tracker: CourseValidationTracker
): Result<Array<Solution>, MajorValidationError> {
  const [allChildRequirementSolutions, childErrors] = splitChildResults(
    r.courses,
    tracker
  );
  if (allChildRequirementSolutions.length === 0 && r.numCreditsMin > 0) {
    return Err(XOMError(r, childErrors, 0));
  }

  let unfinishedSolutionsSoFar: Array<Solution> = [];
  let finishedSolutions: Array<Solution> = [];

  // Diff solutions of each requirement in the req
  for (let childRequirementSolutions of allChildRequirementSolutions) {
    let unfinishedSolutionsWithChild: Array<Solution> = [];
    for (let childSolution of childRequirementSolutions) {
      // Each solution of each subsolution
      for (let solutionSoFar of unfinishedSolutionsSoFar) {
        if (tracker.hasEnoughCoursesForBoth(childSolution, solutionSoFar)) {
          const currentSol = combineSolutions(solutionSoFar, childSolution);
          if (currentSol.minCredits >= r.numCreditsMin) {
            finishedSolutions.push(currentSol);
          } else {
            unfinishedSolutionsWithChild.push(currentSol);
          }
        }
      }
      if (childSolution.minCredits >= r.numCreditsMin) {
        finishedSolutions.push(childSolution);
      } else {
        unfinishedSolutionsWithChild.push(childSolution);
      }
    }
    unfinishedSolutionsSoFar.push(...unfinishedSolutionsWithChild);
  }
  if (finishedSolutions.length > 0) {
    return Ok(finishedSolutions);
  }
  const max = unfinishedSolutionsSoFar.reduce(
    (a, b) => Math.max(a, b.minCredits),
    0
  );
  return Err(XOMError(r, childErrors, max));
}

function validateOrRequirement(
  r: IOrCourse2,
  tracker: CourseValidationTracker
): Result<Array<Solution>, MajorValidationError> {
  const [oks, errs] = splitChildResults(r.courses, tracker);
  if (oks.length === 0) {
    return Err(OrError(errs));
  }
  return Ok(oks.flat());
}

function validateSectionRequirement(
  r: Section,
  tracker: CourseValidationTracker
): Result<Array<Solution>, MajorValidationError> {
  if (r.minRequirementCount < 1) {
    throw new Error("Section requirement count must be >= 1");
  }

  const [allChildRequirementSolutions, childErrors] = splitChildResults(
    r.requirements,
    tracker
  );
  if (allChildRequirementSolutions.length < r.minRequirementCount) {
    return Err(
      SectionError(r, childErrors, allChildRequirementSolutions.length)
    );
  }

  type Solution1 = Solution & { count: number };
  // invariant: requirementCount of unfinished solutions < minRequirementCount
  let unfinishedSolutionsSoFar: Array<Solution1> = [];
  let finishedSolutions: Array<Solution> = [];

  // Diff solutions of each requirement in the req
  for (let childRequirementSolutions of allChildRequirementSolutions) {
    let unfinishedSolutionsWithChild: Array<Solution1> = [];
    for (let childSolution of childRequirementSolutions) {
      for (let {
        count: solutionSoFarCount,
        ...solutionSoFar
      } of unfinishedSolutionsSoFar) {
        if (tracker.hasEnoughCoursesForBoth(childSolution, solutionSoFar)) {
          const currentSol = combineSolutions(solutionSoFar, childSolution);
          const currentSolCount = solutionSoFarCount + 1;
          if (currentSolCount === r.minRequirementCount) {
            finishedSolutions.push(currentSol);
          } else {
            unfinishedSolutionsWithChild.push({
              ...currentSol,
              count: currentSolCount,
            });
          }
        }
      }
      if (r.minRequirementCount === 1) {
        finishedSolutions.push(childSolution);
      } else {
        unfinishedSolutionsWithChild.push({ ...childSolution, count: 1 });
      }
    }
    unfinishedSolutionsSoFar.push(...unfinishedSolutionsWithChild);
  }
  if (finishedSolutions.length > 0) {
    return Ok(finishedSolutions);
  }
  const max = unfinishedSolutionsSoFar.reduce(
    (a, b) => Math.max(a, b.count),
    0
  );
  return Err(SectionError(r, childErrors, max));
}

// assumes the solutions share no courses
function combineSolutions(s1: Solution, s2: Solution) {
  return {
    minCredits: s1.minCredits + s2.minCredits,
    maxCredits: s1.maxCredits + s2.maxCredits,
    sol: [...s1.sol, ...s2.sol],
  };
}

function splitChildResults(
  reqs: Requirement2[],
  tracker: CourseValidationTracker
): [Solution[][], Array<MajorValidationError & { childIndex: number }>] {
  const oks = [];
  const errs = [];
  for (let i = 0; i < reqs.length; i += 1) {
    const c = reqs[i];
    const result = validateRequirement(c, tracker);
    if (result.type === "OK") oks.push(result.ok);
    else errs.push({ ...result.err, childIndex: i });
  }
  return [oks, errs];
}
