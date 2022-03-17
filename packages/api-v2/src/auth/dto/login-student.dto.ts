import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginStudentDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
