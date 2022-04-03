import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateStudentDto } from "@graduate/common/dto/create-student.dto";
import { AuthService } from "./auth.service";
import { LoginStudentDto } from "@graduate/common/dto/login-student.dto";
import { GetStudentResponse } from "@graduate/common/response-types/student-response-type";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  public async register(
    @Body() createStudentDto: CreateStudentDto
  ): Promise<GetStudentResponse> {
    const student = await this.authService.register(createStudentDto);

    if (!student) {
      throw new BadRequestException();
    }

    return student;
  }

  @Post("login")
  public async login(
    @Body() loginUserDto: LoginStudentDto
  ): Promise<GetStudentResponse> {
    const student = await this.authService.login(loginUserDto);

    if (!student) {
      throw new UnauthorizedException();
    }

    return student;
  }
}
