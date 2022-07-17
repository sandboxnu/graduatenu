import { Schedule, ScheduleCourse } from "./types";

export class PlanModel {
  id: number;
  name: string;
  student: StudentModel;
  schedule: Schedule;
  major: string;
  coopCycle: string;
  concentration: string | undefined;
  catalogYear: number;
  createdAt: Date;
  updatedAt: Date;
}

export class GetPlanResponse extends PlanModel {}

export class UpdatePlanResponse extends PlanModel {}

export class StudentModel {
  uuid: string;
  nuid: string;
  fullName: string;
  email: string;
  academicYear: number | undefined;
  graduateYear: number | undefined;
  catalogYear: number | undefined;
  major: string | undefined;
  coopCycle: string | undefined;
  coursesCompleted: ScheduleCourse[] | undefined;
  coursesTransfered: ScheduleCourse[] | undefined;
  primaryPlanId: number | true;
  plans: PlanModel[];
  concentration: string | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export class GetStudentResponse extends StudentModel {}

export class UpdateStudentResponse extends StudentModel {}
