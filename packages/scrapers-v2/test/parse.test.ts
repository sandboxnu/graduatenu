import { HRow, HRowType } from "../src/tokenize/types";
import { parseRows } from "../src/parse/parse";
import { IOrCourse2, IRequiredCourse, Requirement2 } from "@graduate/common";

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

describe("parse", () => {
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
