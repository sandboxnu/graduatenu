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
  GetStudentResponse,
  LoginStudentDto,
  SignUpDto,
} from "../../../common";
import { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  public async register(
    @Res({ passthrough: true }) response: Response,
    @Body() createStudentDto: SignUpDto
  ): Promise<GetStudentResponse> {
    const student = await this.authService.register(createStudentDto);
    const { accessToken, ...studentInfo } = student;

    if (!student) {
      throw new BadRequestException();
    }

    const isSecure = process.env.NODE_ENV !== "development";
    // Store JWT token in a cookie
    response.cookie("auth_cookie", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: isSecure,
    });

    return studentInfo;
  }

  @Post("login")
  public async login(
    @Res({ passthrough: true }) response: Response,
    @Body() loginUserDto: LoginStudentDto
  ): Promise<GetStudentResponse> {
    const student = await this.authService.login(loginUserDto);
    const { accessToken, ...studentInfo } = student;

    if (!student) {
      throw new UnauthorizedException();
    }

    const isSecure = process.env.NODE_ENV !== "development";
    // Store JWT token in a cookie
    response.cookie("auth_cookie", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: isSecure,
    });
    return studentInfo;
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
