import { ScheduleCourse } from "../types";
import { PlanModel } from "./plan-response-type";

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
