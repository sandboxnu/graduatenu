import {
  CourseTakenTracker,
  INEUCourse,
  IScheduleCourse,
  IXofManyCourse,
  Major2,
  Requirement2,
  Schedule,
  ScheduleCourse,
  Section,
} from "../../../common/types";
import { courseEq, courseToString } from "./course-helpers";
import { stringify } from "querystring";

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
  addCourses(toAdd: IScheduleCourse[]): void;

  contains(input: IScheduleCourse): boolean;

  addCourse(toAdd: IScheduleCourse): void;
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

type ValidateCourse<T> = (
  req: T,
  taken: ScheduleCourse[],
  tracker: CourseValidationTracker
) => { result: ValidationError | null; credits: number };

const assertUnreachable = (x: never): never => {
  throw new Error("This code is unreachable");
};

function validateMajor2(major: Major2, taken: ScheduleCourse[]) {
  const coursesTaken: Set<string> = new Set();
  const tracker = {
    addCourse(toAdd: IScheduleCourse): void {
      coursesTaken.add(courseToString(toAdd));
    },
    addCourses(toAdd: IScheduleCourse[]): void {
      for (const course of toAdd) {
        tracker.addCourse(course);
      }
    },
    contains(input: IScheduleCourse): boolean {
      return coursesTaken.has(courseToString(input));
    },
  };

  const totalCreditsRequiredError = validateTotalCreditsRequired(
    major.totalCreditsRequired,
    taken
  );

  const requirementAndSectionErrors = major.requirementSections.map(s =>
    validateAndRequirements(s.requirements, taken, tracker)
  );

  // const requirementOrSectionErrors = major.requirementSections.map(s =>
  //   validateOrSection(s, taken, tracker)
  // );
  //
  // const requirementSectionErrors = major.requirementSections.map(s =>
  //   validateSections(s, taken, tracker)
  // );
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

function validateSection(
  section: Section,
  taken: ScheduleCourse[],
  tracker: CourseValidationTracker
) {
  // ignore section.minRequirementCount for now
  return section.requirements.map(req =>
    validateRequirement(req, taken, tracker)
  );
}

const validateXomCourses: ValidateCourse<IXofManyCourse> = (
  req,
  taken,
  tracker
) => {
  // req.courses.map(course => validateRequirement(course, taken, tracker));
  throw new Error("unimplemented");
};

function unimple() {
  throw new Error("unimplemented");
}

const validateRequirement: ValidateCourse<Requirement2> = (
  req,
  taken,
  tracker
) => {
  throw new Error("unimplemented");
  // switch (req.type) {
  //   case "XOM":
  //     return validateXomCourses(req, taken, tracker);
  //   case "OR":
  //     return validateOrCourses(taken, used, requirement);
  //   case "RANGE":
  //     return validateRangeCourses(take, used, requirement);
  //   case "COURSE":
  //     return validateCourse(take, used, requirement);
  //   case "AND":
  //     return validateAndSection(taken, used, requirement);
  //   case "section":
  //     return validateSection(section, taken, tracker);
  // }
};
