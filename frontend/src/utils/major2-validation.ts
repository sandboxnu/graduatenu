import {
  IAndCourse2,
  IOrCourse2,
  IScheduleCourse,
  IXofManyCourse,
  Major2,
  Requirement2,
  ScheduleCourse,
  IRequiredCourse,
  ICourseRange2,
  Section,
} from "../../../common/types";
import { courseToString } from "./course-helpers";

type Solution = {
  minCredits: number;
  maxCredits: number;
  sol: Array<string>;
};

const assertUnreachable = (_: never): never => {
  throw new Error("This code is unreachable");
};

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

export function validateMajor2(major: Major2, taken: ScheduleCourse[]) {
  const tracker = new Major2ValidationTracker(taken);

  const courses = major.requirementSections.map(s => ({
    ...s,
    type: "SECTION" as const,
  }));

  const solutions = validateAndRequirement(
    {
      type: "AND",
      courses,
    },
    tracker
  );

  throw new Error("unimplemented!");

  const totalCreditsRequiredError = validateTotalCreditsRequired(
    major.totalCreditsRequired,
    taken
  );
}

// invariant: the solutions returned will each ALWAYS have no duplicate courses
export const validateRequirement = (
  req: Requirement2,
  tracker: CourseValidationTracker
): Array<Solution> => {
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
) {
  const c = tracker.get(r);
  if (c) {
    return [
      {
        minCredits: c.numCreditsMin,
        maxCredits: c.numCreditsMax,
        sol: [courseToString(c)],
      },
    ];
  }
  return [];
}

function validateRangeRequirement(
  r: ICourseRange2,
  tracker: CourseValidationTracker
) {
  let courses = tracker.getAll(r.subject, r.idRangeStart, r.idRangeEnd);
  const exceptions = new Set(r.exceptions.map(courseToString));
  courses = courses.filter(c => !exceptions.has(courseToString(c)));

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
  return finishedSolutions;
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
) {
  const allChildRequirementSolutions = r.courses.map(r =>
    validateRequirement(r, tracker)
  );

  // valid solutions for all the requirements so far
  let solutionsSoFar: Array<Solution> = [
    { maxCredits: 0, minCredits: 0, sol: [] },
  ];

  // Diff solutions of each requirement in the AND
  for (let childRequirementSolutions of allChildRequirementSolutions) {
    let solutionsSoFarWithChild: Array<Solution> = [];
    for (let solutionSoFar of solutionsSoFar) {
      // Each solution of each subsolution
      for (let childSolution of childRequirementSolutions) {
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
      return [];
    }
    solutionsSoFar = solutionsSoFarWithChild;
  }
  return solutionsSoFar;
}

function validateXomRequirement(
  r: IXofManyCourse,
  tracker: CourseValidationTracker
) {
  const allChildRequirementSolutions = r.courses.map(r =>
    validateRequirement(r, tracker)
  );

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
  return finishedSolutions;
}

function validateOrRequirement(
  r: IOrCourse2,
  tracker: CourseValidationTracker
) {
  return r.courses.flatMap(r => validateRequirement(r, tracker));
}

function validateSectionRequirement(
  r: Section,
  tracker: CourseValidationTracker
) {
  if (r.minRequirementCount < 1) {
    throw new Error("Section requirement count must be >= 1");
  }

  const allChildRequirementSolutions = r.requirements.map(r =>
    validateRequirement(r, tracker)
  );

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
  return finishedSolutions;
}

// assumes the solutions share no courses
function combineSolutions(s1: Solution, s2: Solution) {
  return {
    minCredits: s1.minCredits + s2.minCredits,
    maxCredits: s1.maxCredits + s2.maxCredits,
    sol: [...s1.sol, ...s2.sol],
  };
}
