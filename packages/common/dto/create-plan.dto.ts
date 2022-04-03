import { IsArray, IsInt, IsObject, IsString, Max, Min } from "class-validator";
import { Schedule } from "../types";
import { CourseWarning, IWarning } from "@graduate/frontend/src/models/types";

export class CreatePlanDto {
  @IsString()
  name: string;

  @IsObject()
  schedule: Schedule;

  @IsString()
  major: string;

  @IsString()
  coopCycle: string;

  @IsString()
  concentration: string;

  @IsInt()
  @Min(1898)
  @Max(3000)
  catalogYear: number;

  @IsArray()
  courseWarnings: CourseWarning[];

  @IsArray()
  warnings: IWarning[];
}
