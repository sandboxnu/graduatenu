import { Schedule } from "../types";
import { StudentModel } from "./student-response-type";

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
