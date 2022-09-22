import {
  IMajorRequirementGroup,
  Major,
  Major2,
  Requirement,
  Requirement2,
  Section,
} from "@graduate/common";
import bscs from "../../scrapers/test/mock_majors/bscs.json";

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
