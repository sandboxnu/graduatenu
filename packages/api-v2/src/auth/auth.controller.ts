import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  emailAlreadyExistsError,
  GetStudentResponse,
  LoginStudentDto,
  SignUpStudentDto,
} from "@graduate/common";
import { Response } from "express";
import EmailConfirmationService from "src/emailConfirmation/emailConfirmation.service";
import { EmailAlreadyExists } from "src/student/student.errors";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailConfirmationService: EmailConfirmationService
  ) {}

  @Post("register")
  public async register(
    @Res({ passthrough: true }) response: Response,
    @Body() createStudentDto: SignUpStudentDto
  ): Promise<GetStudentResponse> {
    const student = await this.authService.register(createStudentDto);

    if (student instanceof EmailAlreadyExists) {
      throw new BadRequestException(emailAlreadyExistsError);
    }

    if (!student) {
      throw new BadRequestException();
    }

    const { accessToken } = student;

    const isSecure = process.env.NODE_ENV !== "development";
    // Store JWT token in a cookie
    response.cookie("auth_cookie", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: isSecure,
    });
    await this.emailConfirmationService.sendVerificationLink(
      createStudentDto.email
    );
    return student;
  }

  @Post("login")
  public async login(
    @Res({ passthrough: true }) response: Response,
    @Body() loginUserDto: LoginStudentDto
  ): Promise<GetStudentResponse> {
    const student = await this.authService.login(loginUserDto);

    if (!student) {
      throw new UnauthorizedException();
    }

    const { accessToken } = student;

    const isSecure = process.env.NODE_ENV !== "development";
    // Store JWT token in a cookie
    response.cookie("auth_cookie", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: isSecure,
    });

    return student;
  }

  @Get("logout")
  @HttpCode(204)
  public async logout(
    @Res({ passthrough: true }) response: Response
  ): Promise<void> {
    const isSecure = process.env.NODE_ENV !== "development";
    response.clearCookie("auth_cookie", {
      httpOnly: true,
      sameSite: "strict",
      secure: isSecure,
    });
  }
}
