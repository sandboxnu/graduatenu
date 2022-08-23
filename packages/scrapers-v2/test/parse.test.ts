import { HRow, HRowType } from "../src/tokenize/types";
import { parseRows } from "../src/parse/parse";
import {
  IOrCourse2,
  IRequiredCourse,
  Requirement2,
  ResultType,
} from "@graduate/common";
import {
  BACS,
  BSCS,
  CECS,
  CS_BIO,
  CS_BUS_ADMIN,
  CS_CHEM,
  CS_CIVIL_E,
  CS_COG_PSYC,
  CS_COMM,
  CS_CRIM,
  CS_DESIGN,
  CS_ECON,
  CS_ENGLISH,
  CS_ENVIRO,
  CS_GAME,
  CS_GAME_DEV,
  CS_HISTORY,
  CS_JOUR,
  CS_LING,
  CS_MATH,
  CS_MED_ARTS,
  CS_NEURO,
  CYBER,
  DS,
} from "./testUrls";
import { singlePipeline } from "../src/runtime/pipeline";

const course: HRow = {
  type: HRowType.PLAIN_COURSE,
  description: "",
  classId: 2500,
  hour: 4,
  subject: "CS",
};
const orCourse: HRow = {
  type: HRowType.OR_COURSE,
  subject: "CS",
  hour: 1,
  classId: 2501,
  description: "",
};
const output: IRequiredCourse = {
  type: "COURSE",
  classId: 2500,
  subject: "CS",
};
const output2: IRequiredCourse = {
  type: "COURSE",
  classId: 2501,
  subject: "CS",
};
const orCourseOutput: IOrCourse2 = {
  courses: [output, output2, output2],
  type: "OR",
};

describe.skip("parse", () => {
  test("course", () => {
    // streaming-type parser, so produces an extra array
    // expect(parseRows([course, course])).toEqual([[output, output]]);
    // expect(parseRows([course])).toEqual([[output]]);
    expect(parseRows([course, course])).toStrictEqual<Requirement2[]>([
      output,
      output,
    ]);
  });

  test("or courses", () => {
    // expect(parseRows([course, orCourse, orCourse])).toEqual([[orCourseOutput]]);
    expect(parseRows([course, orCourse, orCourse])).toStrictEqual<
      Requirement2[]
    >([orCourseOutput]);
  });

  test("and", () => {
    const input: HRow[] = [
      {
        type: HRowType.AND_COURSE,
        description: "",
        hour: 0,
        courses: [
          { subject: "CS", classId: 2500, description: "" },
          { subject: "CS", classId: 2501, description: "" },
          { subject: "CS", classId: 2510, description: "" },
          { subject: "CS", classId: 2511, description: "" },
        ],
      },
      {
        type: HRowType.AND_COURSE,
        description: "",
        hour: 0,
        courses: [
          { subject: "CS", classId: 3500, description: "" },
          { subject: "CS", classId: 2501, description: "" },
        ],
      },
    ];
    expect(parseRows(input)).toMatchSnapshot();
  });

  test("and and or", () => {
    const input: HRow[] = [
      course,
      orCourse,
      orCourse,
      {
        type: HRowType.AND_COURSE,
        description: "",
        hour: 0,
        courses: [
          { subject: "CS", classId: 2500, description: "" },
          { subject: "CS", classId: 2501, description: "" },
          { subject: "CS", classId: 2510, description: "" },
          { subject: "CS", classId: 2511, description: "" },
        ],
      },
      {
        type: HRowType.AND_COURSE,
        description: "",
        hour: 0,
        courses: [
          { subject: "CS", classId: 3500, description: "" },
          { subject: "CS", classId: 2501, description: "" },
        ],
      },
    ];
    expect(parseRows(input)).toMatchSnapshot();
  });
});

const getTokenized = async (url: URL) => {
  const result = await singlePipeline(url);
  if (result.result.type !== ResultType.Ok) {
    throw result.result.err;
  }
  return result.result.ok.tokenized;
};

const testParsesSnapshot = (name: string, url: URL) =>
  test(name, async () => {
    const t = await getTokenized(url);
    for (const section of t.sections) {
      expect(parseRows(section.entries)).toMatchSnapshot();
      // expect(() => parseRows(section.entries)).not.toThrow();
    }
  });

describe("describe", () => {
  testParsesSnapshot("bscs", BSCS);
  testParsesSnapshot("cs game dev", CS_GAME_DEV);

  testParsesSnapshot("BACS", BACS);
  testParsesSnapshot("cyber", CYBER);
  testParsesSnapshot("ds", DS);
  testParsesSnapshot("cs chem", CS_CHEM);
  testParsesSnapshot("cs civil e", CS_CIVIL_E);
  testParsesSnapshot("cecs", CECS);
  testParsesSnapshot("cs neuro", CS_NEURO);
  testParsesSnapshot("cs bio", CS_BIO);
  testParsesSnapshot("cs business admin", CS_BUS_ADMIN);
  testParsesSnapshot("cs cog psyc", CS_COG_PSYC);
  testParsesSnapshot("cs comm", CS_COMM);
  testParsesSnapshot("cs crim", CS_CRIM);
  testParsesSnapshot("cs design", CS_DESIGN);
  testParsesSnapshot("cs econ", CS_ECON);
  testParsesSnapshot("cs english", CS_ENGLISH);
  testParsesSnapshot("cs environ", CS_ENVIRO);
  testParsesSnapshot("cs game", CS_GAME);
  testParsesSnapshot("cs hist", CS_HISTORY);
  testParsesSnapshot("cs jour", CS_JOUR);
  testParsesSnapshot("cs ling", CS_LING);
  testParsesSnapshot("cs math", CS_MATH);
  testParsesSnapshot("cs media arts", CS_MED_ARTS);
});

/*
Syntax error at index 0
Unexpected {"hour":0,"description":"Environment","type":"SUBHEADER"}.
count: 17

problem: there is a weird table break in between the first comment and the rest of the requirements
fix: if there are two tables in a section (h1), and the first is a comment, merge them.

'https://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/data-science-international-affairs-bs/',
'https://catalog.northeastern.edu/undergraduate/science/marine-environmental/environmental-studies-international-affairs-ba/',
'https://catalog.northeastern.edu/undergraduate/social-sciences-humanities/international-affairs/international-affairs-criminal-justice-ba/',
'https://catalog.northeastern.edu/undergraduate/social-sciences-humanities/cultures-societies-global-studies/spanish-international-affairs-ba/',
'https://catalog.northeastern.edu/undergraduate/social-sciences-humanities/international-affairs/economics-ba/',
'https://catalog.northeastern.edu/undergraduate/social-sciences-humanities/international-affairs/international-affairs-history-ba/',
'https://catalog.northeastern.edu/undergraduate/social-sciences-humanities/human-services/human-services-international-affairs-ba/',
'https://catalog.northeastern.edu/undergraduate/social-sciences-humanities/international-affairs/international-affairs-ba/',
'https://catalog.northeastern.edu/undergraduate/social-sciences-humanities/international-affairs/african-studies-concentration-ba/',
'https://catalog.northeastern.edu/undergraduate/social-sciences-humanities/international-affairs/asian-studies-concentration-ba/',
'https://catalog.northeastern.edu/undergraduate/social-sciences-humanities/international-affairs/european-studies-concentration-ba/',
'https://catalog.northeastern.edu/undergraduate/social-sciences-humanities/international-affairs/latin-american-studies-concentration-ba/',
'https://catalog.northeastern.edu/undergraduate/social-sciences-humanities/international-affairs/middle-east-studies-concentration-ba/',
'https://catalog.northeastern.edu/undergraduate/social-sciences-humanities/international-affairs/cultural-anthropology-ba/',
'https://catalog.northeastern.edu/undergraduate/social-sciences-humanities/international-affairs/religious-studies-ba/',
'https://catalog.northeastern.edu/undergraduate/social-sciences-humanities/political-science/political-science-international-affairs-ba/',
'https://catalog.northeastern.edu/undergraduate/social-sciences-humanities/sociology-anthropology/sociology-international-affairs-ba/'


Syntax error at index 12
Unexpected {"hour":0,"description":"Pre-19th Century Literature","type":"SUBHEADER"}.
count: 10

'https://catalog.northeastern.edu/undergraduate/social-sciences-humanities/english/english-communication-studies-ba/',
'https://catalog.northeastern.edu/undergraduate/arts-media-design/communication-studies/media-screen-studies-english-ba/',
'https://catalog.northeastern.edu/undergraduate/arts-media-design/journalism/journalism-english-ba/',
'https://catalog.northeastern.edu/undergraduate/social-sciences-humanities/english/english-theatre-ba/',
'https://catalog.northeastern.edu/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-english-bs/',
'https://catalog.northeastern.edu/undergraduate/social-sciences-humanities/cultures-societies-global-studies/africana-studies-english-ba/',
'https://catalog.northeastern.edu/undergraduate/social-sciences-humanities/english/english-criminal-justice-ba/',
'https://catalog.northeastern.edu/undergraduate/social-sciences-humanities/english/english-cultural-anthropology-ba/',
'https://catalog.northeastern.edu/undergraduate/social-sciences-humanities/english/english-philosophy-ba/',
'https://catalog.northeastern.edu/undergraduate/social-sciences-humanities/english/english-political-science-ba/'

Syntax error at index 16
Unexpected {"hour":0,"description":"A maximum of one course may be applied to requirements of a second concentration.","type":"COMMENT"}
count: 9

'https://catalog.northeastern.edu/undergraduate/business/business-administration-bsba/',
'https://catalog.northeastern.edu/undergraduate/business/international-business-bsib/',
'https://catalog.northeastern.edu/undergraduate/business/business-administration-combined-majors/design-bs/',
'https://catalog.northeastern.edu/undergraduate/business/business-administration-combined-majors/business-administration-communication-studies-bs/',
'https://catalog.northeastern.edu/undergraduate/business/business-administration-combined-majors/business-administration-psychology-bs/',
'https://catalog.northeastern.edu/undergraduate/computer-information-science/computer-science/cybersecurity-business-administration-bs/',
'https://catalog.northeastern.edu/undergraduate/health-sciences/community-health-behavioral-sciences/health-science-business-administration-bs/',
'https://catalog.northeastern.edu/undergraduate/social-sciences-humanities/political-science/political-science-business-administration-bs/',
'https://catalog.northeastern.edu/undergraduate/business/concentrations/brand-management/'

Syntax error at index 1
Unexpected {"hour":0,"description":"Physics 1","type":"SUBHEADER"}
count: 5

'https://catalog.northeastern.edu/undergraduate/science/physics/physics-music-bs/',
'https://catalog.northeastern.edu/undergraduate/science/physics/physics-bs/',
'https://catalog.northeastern.edu/undergraduate/science/physics/applied-physics-bs/',
'https://catalog.northeastern.edu/undergraduate/science/physics/biomedical-physics-bs/',
'https://catalog.northeastern.edu/undergraduate/science/physics/physics-philosophy-bs/'

 */
