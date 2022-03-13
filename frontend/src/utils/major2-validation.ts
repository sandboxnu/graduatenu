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
  ICourseRange2,
} from "../../../common/types";
import { courseEq, courseToString } from "./course-helpers";

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
  // const requirementAndSectionErrors = major.requirementSections.map(s =>
  //   validateAndRequirements(s.requirements, taken, tracker)
  // );
  throw new Error("unimplemented!");
}

function validateRangeRequirement(
  req: ICourseRange2,
  tracker: CourseValidationTracker
) {
  let courses = tracker.getAll(req.subject, req.idRangeStart, req.idRangeEnd);
  let exceptions = new Set(req.exceptions.map(courseToString));
  courses = courses.filter(c => !exceptions.has(courseToString(c)));

  const combinate = (array: Array<any>) => {
    const combinate2 = (
      n: number,
      src: Array<any>,
      got: Array<any>,
      all: Array<any>
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
    let all: any[] = [];
    for (let i = 1; i < array.length; i++) {
      combinate2(i, array, [], all);
    }
    all.push(array);
    return all;
  };

  const combinatedCourses: Array<Array<ScheduleCourse>> = combinate(courses);

  return combinatedCourses.flatMap(c => {
    // edge case of 3 + 5 credits or non - 4 + 1 credits to fulfil a credit req of 4 or 8
    const credits = c.reduce((a, b) => a + b.numCreditsMax, 0);
    if (credits === req.creditsRequired) {
      return [
        {
          minCredits: credits,
          maxCredits: credits,
          sol: c,
        },
      ];
    }
    return [];
  });
}

function validateSectionRequirement(
  requirements: Requirement2[],
  taken: ScheduleCourse[],
  tracker: CourseValidationTracker
) {
  return undefined;
}

const validateRequirement = (
  req: Requirement2,
  taken: ScheduleCourse[],
  tracker: CourseValidationTracker
) => {
  switch (req.type) {
    case "AND":
      return validateAndRequirement(req, tracker);
    case "XOM":
      return validateXomRequirement(req, tracker);
    case "OR":
      return validateOrRequirement(req, tracker);
    case "RANGE":
      return validateRangeRequirement(req, tracker);
    case "COURSE":
      return validateCourseRequirement(req, tracker);
    case "section":
      return validateSectionRequirement(req.requirements, taken, tracker);
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
) {}

function validateOrRequirement(
  r: IOrCourse2,
  tracker: CourseValidationTracker
) {}

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
