import { HRow, HRowType } from "../src/tokenize/types";
import { parseRows } from "../src/parse/parse";
import { IOrCourse2, IRequiredCourse } from "@graduate/common";

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
    expect(parseRows([course, course])).toMatchSnapshot();
  });

  test("or courses", () => {
    // expect(parseRows([course, orCourse, orCourse])).toEqual([[orCourseOutput]]);
    expect(parseRows([course, orCourse, orCourse])).toMatchSnapshot();
  });
});
