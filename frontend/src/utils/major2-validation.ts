import {
  IAndCourse2,
  IOrCourse2,
  IScheduleCourse,
  IXofManyCourse,
  Major2,
  Requirement2,
  ScheduleCourse,
  Section,
  IRequiredCourse,
  INEUCourse,
} from "../../../common/types";
import { courseEq, courseToString } from "./course-helpers";

// num total credits requirements
// interface

interface ValidationError {
  message: string;
}

interface ValidationStackError extends ValidationError {
  stackTrace: number[];
}

interface TotalRequiredCreditsError extends ValidationError {
  requiredCredits: number;
  takenCredits: number;
}

interface CourseValidationTracker {
  used: {
    contains(input: IScheduleCourse): boolean;
    // remember all the changes we make from here on out.
    // if we ever want to revert everything, just call popUntil(idx)
    pushMarker(): number;
    popUntilMarker(id: number): void;
    pushCourse(toAdd: IScheduleCourse): void;
  };
  taken: {
    get(input: IScheduleCourse): null | ScheduleCourse;
  };
}

type Major2ValidationResult = {
  name: string;
  isValid: boolean;
  totalCreditsRequiredError: ValidationError | null;
  // invariant: is the same length as major requirementSections
  // and inner array has the same length of requirement array
  requirementSectionErrors: Array<Array<ValidationError>>;
  // invariant: is the same length as # of concentration sections
  // assumption: we will only validate a single concentration
  concentrationErrors: Array<Array<ValidationError>>;
};

const assertUnreachable = (x: never): never => {
  throw new Error("This code is unreachable");
};

export function validateMajor2(
  major: Major2,
  taken: ScheduleCourse[]
): Major2ValidationResult {
  const coursesTaken: Set<string> = new Set();

  // const totalCreditsRequiredError = validateTotalCreditsRequired(
  //   major.totalCreditsRequired,
  //   taken
  // );
  //
  // const requirementAndSectionErrors = major.requirementSections.map(s =>
  //   validateAndRequirements(s.requirements, taken, tracker)
  // );
  throw new Error("unimplemented!");
}

type NestedErrorResult = {
  nested: Array<ValidationStackError>;
  credits: number;
};

const validateAndRequirements = (
  requirements: Requirement2[],
  taken: ScheduleCourse[],
  tracker: CourseValidationTracker
): NestedErrorResult => {
  const errors = requirements.map(r =>
    validateSingleAndRequirement(r, taken, tracker)
  );
  const credits = errors.reduce((total, e) => e.credits + total, 0);
  const nested = errors.flatMap((e, index) => {
    e.nested.forEach(e => e.stackTrace.unshift(index));
    return e.nested;
  });
  return { nested, credits };
};

const validateSingleAndRequirement = (
  req: Requirement2,
  taken: ScheduleCourse[],
  tracker: CourseValidationTracker
): NestedErrorResult => {
  switch (req.type) {
    case "AND":
      return validateAndRequirements(req.courses, taken, tracker);
    case "XOM":
    case "OR":
    case "RANGE":
      return { nested: [], credits: 0 };
    case "COURSE":
      const c = taken.find(c => courseEq(c, req));
      if (c && !tracker.contains(req)) {
        tracker.addCourse(req);
        return { nested: [], credits: c.numCreditsMax };
      }
      const stringifiedCourse = courseToString(req);
      const message = `Requirement unsatisfiable, missing course: ${stringifiedCourse}`;
      return { nested: [{ message, stackTrace: [] }], credits: 0 };
    case "section":
      return validateAndRequirements(req.requirements, taken, tracker);
    default:
      return assertUnreachable(req);
  }
};

function validateTotalCreditsRequired(
  requiredCredits: number,
  coursesTaken: ScheduleCourse[]
): TotalRequiredCreditsError | null {
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

type ReturnType = { ok: boolean };

function* validateRequirement(
  r: Requirement2,
  tracker: CourseValidationTracker
): Generator<ReturnType> {
  switch (r.type) {
    case "AND":
      return validateAndRequirement(r, tracker);
    case "XOM":
      return validateXomRequirement(r, tracker);
    case "OR":
      return validateOrRequirement(r, tracker);
    case "RANGE":
      break;
    case "COURSE":
      return validateCourseRequirement(r, tracker);
    case "section":
      break;
    default:
      assertUnreachable(r);
  }
}

function getNextOkOrNull(it: Iterator<ReturnType>) {
  let next = it.next();
  while (!next.done) {
    if (next.value.ok) return next;
    next = it.next();
  }
  return null;
}

function* validateAndRequirement(
  r: IAndCourse2,
  tracker: CourseValidationTracker
) {
  let nextRequirement = 0;
  // list of [context, the index of the requirement it belongs to]
  const contexts: [Generator<ReturnType>, number][] = [];
  while (nextRequirement < r.courses.length) {
    const c = r.courses[nextRequirement];
    const context = validateRequirement(c, tracker);
    const nextOk = getNextOkOrNull(context);
    if (nextOk) {
      // push a tuple
      nextRequirement += 1;
      contexts.push([context, nextRequirement]);
      continue;
    }
    // there is no next ok. pop and retry
    while (true) {
      const pop = contexts.pop();
      if (!pop) {
        // if we were the first, then exit
        return { ok: false };
      }
      const [prevContext, nextIdx] = pop;
      const next = getNextOkOrNull(prevContext);
      if (next) {
        // continue with the index after the previous context
        contexts.push([prevContext, nextIdx]);
        nextRequirement = nextIdx;
        break;
      }
      // pop the next context
    }
  }
  while (true) {
    // handle retry logic
    yield { ok: true };
    const pop = contexts.pop();
    if (!pop) {
      // if we were the first, then exit
      return { ok: false };
    }
    const [prevContext, nextIdx] = pop;
    const next = getNextOkOrNull(prevContext);
    if (next) {
      // continue with the index after the previous context
      contexts.push([prevContext, nextIdx]);
      nextRequirement = nextIdx;
      break;
    }
  }
}

function* validateOrRequirement(
  r: IOrCourse2,
  tracker: CourseValidationTracker
) {
  for (const c of r.courses) {
    const marker = tracker.used.pushMarker();
    const result = validateRequirement(c, tracker);
    for (const next of result) {
      if (next.ok) {
        // create context we can jump back to
        yield { ok: true };
      }
    }
    tracker.used.popUntilMarker(marker);
  }
  return { ok: false };
}

function validateCourseRequirement(
  r: IRequiredCourse,
  tracker: CourseValidationTracker
) {
  const c = tracker.taken.get(r);
  if (c && !tracker.used.contains(r)) {
    tracker.used.pushCourse(r);
    return { ok: true };
  }
  return { ok: false };
}

function validateXomRequirement(
  r: IXofManyCourse,
  tracker: CourseValidationTracker
) {}
