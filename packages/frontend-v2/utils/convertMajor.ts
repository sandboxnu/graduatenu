/**
 * Describes an abbreviation for one of Northeastern's NUPath academic breadth
 * requirements. Each two-character NUPath directly corresponds to
 * Northeastern's abbreviation of the requirement.
 */
enum NUPathEnum {
  ND = "ND",
  EI = "EI",
  IC = "IC",
  FQ = "FQ",
  SI = "SI",
  AD = "AD",
  DD = "DD",
  ER = "ER",
  WF = "WF",
  WD = "WD",
  WI = "WI",
  EX = "EX",
  CE = "CE",
}

/**
 * A Major, containing all the requirements.
 *
 * @param name                 The name of the major.
 * @param requirementGroups    A list of the sections of this major
 * @param requirementGroupMap  An object containing the sections of this major.
 * @param yearVersion          Which major version the user has, based on the year.
 * @param isLanguageRequired   True if a language is required.
 * @param totalCreditsRequired The total number of credit-hours required for the major.
 * @param nupaths              The nupaths required for the major.
 */
interface Major {
  name: string;
  requirementGroups: string[];
  requirementGroupMap: { [key: string]: IMajorRequirementGroup };
  yearVersion: number;
  isLanguageRequired: boolean;
  totalCreditsRequired: number;
  nupaths: NUPathEnum[];
  concentrations: Concentrations;
}

/**
 * A list of concentration options and the min/max number of concentrations they can do
 *
 * @param minOptions           Minimum required concentrations
 * @param maxOptions           Maximum number of concentrations they can take
 * @param concentrationOptions All of the concentrations that they can choose from
 */
interface Concentrations {
  minOptions: number;
  maxOptions: number;
  concentrationOptions: Concentration[];
}
/**
 * A single Concentration and it's requirements
 *
 * @param name                The name of the concentration
 * @param requirementGroups   A list of the sections of this concentration
 * @param requirementGroupMap An object containing the sections of this concentration
 */
interface Concentration {
  name: string;
  requirementGroups: string[];
  requirementGroupMap: { [key: string]: IMajorRequirementGroup };
}

/** A generic Major requirment group. */
type IMajorRequirementGroup = ANDSection | ORSection | RANGESection;

/**
 * A section that must have everything completed in it.
 *
 * @param type         The type of the section
 * @param requirements The requirements of the section
 * @param name         The name of the section
 */
interface ANDSection {
  type: "AND";
  requirements: Requirement[];
  name: string;
}

/**
 * A section that has a credit requirement
 *
 * @param type          The type of this requirement
 * @param requirements  The possible choices for earning credits
 * @param numCreditsMin The minimum number of credits needed to satisfy this major
 * @param numCreditsMax The maximum number of credits needed to satisfy this major
 * @param name          The name of this section
 */
interface ORSection {
  type: "OR";
  requirements: Requirement[];
  numCreditsMin: number;
  numCreditsMax: number;
  name: string;
}

/**
 * A section that has a credit requirement, that can be fulfilled by taking
 * courses in any of the range requirements.
 *
 * @param type          The type of this requirement
 * @param requirements  The possible choices for earning credits
 * @param numCreditsMin The minimum number of credits needed to satisfy this major
 * @param numCreditsMax The maximum number of credits needed to satisfy this major
 * @param name          The name of this section
 */
interface RANGESection {
  type: "RANGE";
  requirements: ICourseRange;
  numCreditsMin: number;
  numCreditsMax: number;
  name: string;
}

/**
 * A variety of ranges of courses, one or more of which can be taken to satisfy
 * the number of credits required.
 *
 * @param creditsRequired - The number of credits required to be taken from the
 *   provided ranges.
 * @param ranges          - The ranges of courses from which courses can be selected.
 */
interface ICourseRange {
  type: "RANGE";
  creditsRequired: number;
  // Potentially add a min/max to ICourseRange
  ranges: ISubjectRange[];
}

/**
 * A range of courses within a single subject.
 *
 * @param subject      - The subject the course range is concerned with.
 * @param idRangeStart - The classId at the start of the course range.
 * @param idRangeEnd   - The classId at the end of the course range.
 */
interface ISubjectRange {
  subject: string;
  idRangeStart: number;
  idRangeEnd: number;
}

/**
 * A single required course.
 *
 * @param classId - The numeric ID of the course.
 * @param subject - The subject that the course is concerned with, such as CS
 *   (Computer Science).
 */
interface IRequiredCourse {
  type: "COURSE";
  classId: number;
  subject: string;
}

/** Represents a degree requirement that has not yet been satisfied. */
type Requirement =
  | IOrCourse
  | IAndCourse
  | ICourseRange
  | IRequiredCourse
  | ICreditRangeCourse;

interface ICreditRangeCourse {
  type: "CREDITS";
  minCredits: number;
  maxCredits: number;
  courses: Requirement[];
}

// TODO: with interfaces, the additional type parameter may not be necessary
/**
 * An 'OR' set of courses.
 *
 * @param courses: A list of courses, one of which can be taken to satisfy this
 *   requirement.
 */
interface IOrCourse {
  type: "OR";
  courses: Requirement[];
}

/**
 * An 'AND' series of courses.
 *
 * @param courses - A list of courses, all of which must be taken to satisfy
 *   this requirement.
 */
interface IAndCourse {
  type: "AND";
  courses: Requirement[];
}

import { Major2, Requirement2, Section } from "@graduate/common";
import bscs from "../../common/test/mock-majors/bscs.json";

export const getMajor2Example = () => {
  return convertToMajor2(bscs as any);
};

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

export const assertUnreachable = (_: never): never => {
  throw new Error("This code is unreachable");
};
