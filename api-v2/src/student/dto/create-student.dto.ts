export class CreateStudentDto {
  fullName: string;
  email: string;
  password: string;
  academicYear?: number;
  graduateYear?: number;
  catalogYear?: number;
  major?: string;
}
