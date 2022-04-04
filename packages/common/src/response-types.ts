import { Schedule, ScheduleCourse } from "./types";

export class PlanModel {
  id: number;
  name: string;
  student: StudentModel;
  schedule: Schedule;
  major: string;
  coopCycle: string;
  concentration: string | null;
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
  academicYear: number | null;
  graduateYear: number | null;
  catalogYear: number | null;
  major: string | null;
  coopCycle: string | null;
  coursesCompleted: ScheduleCourse[] | null;
  coursesTransfered: ScheduleCourse[] | null;
  primaryPlanId: number | true;
  plans: PlanModel[];
  concentration: string | null;
  createdAt: Date;
  updatedAt: Date;
  accessToken?: string;
}

export class GetStudentResponse extends StudentModel {}

export class UpdateStudentResponse extends StudentModel {}
