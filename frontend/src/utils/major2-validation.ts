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

// num total credits requirements

interface CourseValidationTracker {
  contains(input: IScheduleCourse): boolean;

  pushCourse(toAdd: IScheduleCourse): void;

  get(input: IScheduleCourse): ScheduleCourse | null;

  getAll(subject: string, start: number, end: number): Array<ScheduleCourse>;
}

type Solution = {
  minCredits: number;
  maxCredits: number;
  sol: Array<string>;
};

const assertUnreachable = (x: never): never => {
  throw new Error("This code is unreachable");
};

export function validateMajor2(major: Major2, taken: ScheduleCourse[]) {
  const coursesTaken: Set<string> = new Set();

  // const totalCreditsRequiredError = validateTotalCreditsRequired(
  //   major.totalCreditsRequired,
  //   taken
  // );
  //
  const solutions = validateAndRequirement(
    {
      type: "AND",
      courses: major.requirementSections.map(s => ({
        ...s,
        type: "SECTION" as const,
      })),
    },
    tracker
  );
  throw new Error("unimplemented!");
}

function validateRangeRequirement(
  req: ICourseRange2,
  tracker: CourseValidationTracker
) {
  let courses = tracker.getAll(req.subject, req.idRangeStart, req.idRangeEnd);
  let exceptions = new Set(req.exceptions.map(courseToString));
  courses = courses.filter(c => !exceptions.has(courseToString(c)));

  const combinate = <T>(array: Array<T>) => {
    const combinate2 = (
      n: number,
      src: Array<T>,
      got: Array<T>,
      all: Array<Array<T>>
    ) => {
      if (n === 0) {
        if (got.length > 0) {
          all.push(got);
        }
        return;
      }
      for (let j = 0; j < src.length; j++) {
        combinate2(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
      }
      return;
    };
    let all: T[][] = [];
    for (let i = 1; i < array.length; i++) {
      combinate2(i, array, [], all);
    }
    all.push(array);
    return all;
  };

  const combinatedCourses = combinate(courses);

  return combinatedCourses.flatMap(c => {
    // edge case of 3 + 5 credits or non - 4 + 1 credits to fulfil a credit req of 4 or 8
    const credits = c.reduce((a, b) => a + b.numCreditsMax, 0);
    if (credits === req.creditsRequired) {
      return [
        {
          minCredits: credits,
          maxCredits: credits,
          sol: c.map(courseToString),
        },
      ];
    }
    return [];
  });
}

function validateSectionRequirement(
  requirements: Section,
  tracker: CourseValidationTracker
) {
  const courses = requirements.requirements;
  return validateAndRequirement({ type: "AND", courses }, tracker);
}

// invariant: the solutions returned will each ALWAYS have no duplicate courses
export const validateRequirement = (
  req: Requirement2,
  tracker: CourseValidationTracker
): Array<Solution> => {
  switch (req.type) {
    case "AND":
      return validateAndRequirement(req, tracker);
    case "XOM":
      // return validateXomRequirement(req, tracker);
      throw "unimpl";
    case "OR":
      return validateOrRequirement(req, tracker);
    case "RANGE":
      return validateRangeRequirement(req, tracker);
    case "COURSE":
      return validateCourseRequirement(req, tracker);
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

function validateAndRequirement(
  r: IAndCourse2,
  tracker: CourseValidationTracker
) {
  const allChildRequirementSolutions = r.courses.map(r =>
    validateRequirement(r, tracker)
  );
  // return all possible solutions
  /*
  CS2810 -> Array<Solution> -> [{ min: 4, max: 4, sol: [CS2810]}]

  (CS2810 or CS2800) -> ???
  -> Array<Solution> -> [{ min: 4, max: 4, sol: [CS2810]}, { min: 4, max: 4, sol: [CS2800]}]

  (CS2810 or CS2800) and (CS2810 or DS3000)

  [{ min: 4, max: 4, sol: [CS2810]}, { min: 4, max: 4, sol: [CS2800]}] -> solutions for r1
  [{ min: 4, max: 4, sol: [CS2810]}, { min: 4, max: 4, sol: [DS3000]}] -> solutions for r2

  final set of solutions
  [{ min: 8, max: 8, sol: [CS2810, DS3000]},
   { min: 8, max: 8, sol: [CS2800, CS2810]},
   { min: 8, max: 8, sol: [CS2800, DS3000]}]
   */

  // valid solutions for all the requirements so far
  let solutionsSoFar: Array<Solution> = [
    { maxCredits: 0, minCredits: 0, sol: [] },
  ];

  for (let childRequirementSolutions of allChildRequirementSolutions) {
    let solutionsSoFarWithChild: Array<Solution> = [];
    for (let solutionSoFar of solutionsSoFar) {
      for (let childSolution of childRequirementSolutions) {
        // if the intersection of us and the solution so far is empty, combine them and add to current solutions
        let childCourses = new Set(childSolution.sol);
        let solutionCourses = new Set(solutionSoFar.sol);
        if (isIntersectionEmpty(childCourses, solutionCourses)) {
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

function isIntersectionEmpty(s1: Set<string>, s2: Set<string>): boolean {
  let base = s1.size < s2.size ? s1 : s2;
  for (let entry of s1) {
    if (s2.has(entry)) {
      return false;
    }
  }
  return true;
}

// assumes the solutions share no courses
function combineSolutions(s1: Solution, s2: Solution) {
  return {
    minCredits: s1.minCredits + s2.minCredits,
    maxCredits: s1.maxCredits + s2.maxCredits,
    sol: [...s1.sol, ...s2.sol],
  };
}

function validateOrRequirement(
  r: IOrCourse2,
  tracker: CourseValidationTracker
) {
  return r.courses.flatMap(r => validateRequirement(r, tracker));
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

function validateXomRequirement(
  r: IXofManyCourse,
  tracker: CourseValidationTracker
) {}
