import { IRequiredCourse } from "./types";

export const courseToString = (c: {
  subject: string;
  classId: number | string;
}) => `${c.subject.toUpperCase()}${c.classId}`;

type CourseIdentifier = { classId: number | string; subject: string };
export const courseEq = (c1: CourseIdentifier, c2: CourseIdentifier) =>
  String(c1.classId) === String(c2.classId) && c1.subject === c2.subject;

export const coursesToString = (c: IRequiredCourse[]) =>
  c.map(courseToString).join(",");

export const assertUnreachable = (_: never): never => {
  throw new Error("This code is unreachable");
};

export const unimpl = (): never => {
  throw new Error("unimplmemented!");
};
