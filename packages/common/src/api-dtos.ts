import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
import { Schedule, ScheduleCourse } from "./types";

/**
 * Data transfer objects for data going into our API. Class validator decorators
 * are used to validate incoming data.
 */

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
}

export class UpdatePlanDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsObject()
  schedule?: Schedule;

  @IsOptional()
  @IsString()
  major?: string;

  @IsOptional()
  @IsString()
  coopCycle?: string;

  @IsOptional()
  @IsString()
  concentration?: string;

  @IsOptional()
  @IsInt()
  @Min(1898)
  @Max(3000)
  catalogYear?: number;
}

export class SignUpStudentDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  passwordConfirm: string;
}
export class UpdateStudentDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  nuid?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  password?: string;

  @IsOptional()
  @IsInt()
  @Min(1898) // the year NEU was established
  @Max(3000) // will GraduateNU last beyond year 3000?!
  academicYear?: number;

  @IsOptional()
  @IsInt()
  @Min(1898)
  @Max(3000)
  graduateYear?: number;

  @IsOptional()
  @IsInt()
  @Min(1898)
  @Max(3000)
  catalogYear?: number;

  @IsOptional()
  @IsString()
  major?: string;

  @IsOptional()
  @IsString()
  coopCycle?: string;

  @IsOptional()
  @IsObject()
  coursesCompleted?: ScheduleCourse[];

  @IsOptional()
  @IsObject()
  coursesTransfered?: ScheduleCourse[];

  @IsOptional()
  @IsInt()
  primaryPlanId?: number;

  @IsOptional()
  @IsString()
  concentration?: string;

  @IsOptional()
  @IsBoolean()
  isOnboarded?: boolean;
}

export class OnboardStudentDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsString()
  nuid: string;

  @IsInt()
  @Min(1898) // the year NEU was established
  @Max(3000) // will GraduateNU last beyond year 3000!
  academicYear: number;

  @IsInt()
  @Min(1898)
  @Max(3000)
  graduateYear: number;

  @IsInt()
  @Min(1898)
  @Max(3000)
  catalogYear: number;

  @IsString()
  major: string;

  @IsString()
  coopCycle: string;

  @IsObject()
  coursesCompleted: ScheduleCourse[];

  @IsObject()
  coursesTransfered: ScheduleCourse[];

  @IsInt()
  primaryPlanId: number;

  @IsString()
  concentration: string;
}

export class LoginStudentDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}