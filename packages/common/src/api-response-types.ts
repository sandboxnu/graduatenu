import { ScheduleCourse, Schedule2 } from "./types";

/** Types our API responds with. */

export class PlanModel<T> {
  id: number;
  name: string;
  student: StudentModel<null>;
  schedule: Schedule2<T>;
  major: string;
  coopCycle: string;
  concentration: string | undefined;
  catalogYear: number;
  createdAt: Date;
  updatedAt: Date;
}

export class GetPlanResponse extends PlanModel<null> {}

export class UpdatePlanResponse extends PlanModel<null> {}

export class StudentModel<T> {
  uuid: string;
  nuid: string;
  isOnboarded: boolean;
  fullName: string;
  email: string;
  academicYear: number | undefined;
  graduateYear: number | undefined;
  catalogYear: number | undefined;
  major: string | undefined;
  coopCycle: string | undefined;
  coursesCompleted: ScheduleCourse[] | undefined;
  coursesTransfered: ScheduleCourse[] | undefined;
  primaryPlanId: number;
  plans: PlanModel<T>[];
  concentration: string | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export class GetStudentResponse extends StudentModel<null> {}

export class UpdateStudentResponse extends StudentModel<null> {}
