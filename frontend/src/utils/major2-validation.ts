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
import { courseToString } from "./course-helpers";

export {};

// num total credits requirements
// interface

interface ValidationError {
  message: string;
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
  const requirementSectionErrors = major.requirementSections.map(s =>
    validateSection(s, taken, tracker)
  );
}

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

type ValidateCourse<T> = (
  req: T,
  taken: ScheduleCourse[],
  tracker: CourseValidationTracker
) => { result: ValidationError | null; credits: number };

const validateXomCourses: ValidateCourse<IXofManyCourse> = (
  req,
  taken,
  tracker
) => {
  req.courses.map(course => validateRequirement(course, taken, tracker));
};

const validateRequirement: ValidateCourse<Requirement2> = (
  req,
  taken,
  tracker
) => {
  switch (req.type) {
    case "XOM":
      return validateXomCourses(req, taken, tracker);
    case "OR":
      return validateOrCourses(taken, used, requirement);
    case "RANGE":
      return validateRangeCourses(take, used, requirement);
    case "COURSE":
      return validateCourse(take, used, requirement);
    case "AND":
      return validateAndSection(taken, used, requirement);
    case "section":
      return validateSection(section, taken, tracker);
  }
};
