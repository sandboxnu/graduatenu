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
  emailDoesNotExistError,
  emailHasNotBeenConfirmed,
  ForgotPasswordDto,
  forgotPasswordTokenExpiredError,
  GetStudentResponse,
  LoginStudentDto,
  mustUseHuskyEmailError,
  ResetPasswordDto,
  SignUpStudentDto,
  weakPasswordError,
} from "@graduate/common";
import { Response } from "express";
import EmailConfirmationService from "../emailConfirmation/emailConfirmation.service";
import {
  EmailAlreadyExists,
  EmailNotConfirmed,
  MustUseHuskyEmail,
  NoSuchEmail,
  WeakPassword,
} from "../student/student.errors";
import { BadToken, InvalidPayload, TokenExpiredError } from "./auth.errors";
import { Throttle } from "@nestjs/throttler";
import { COOKIE_DOMAIN } from "../constants";

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

    if (student instanceof MustUseHuskyEmail) {
      throw new BadRequestException(mustUseHuskyEmailError);
    }

    if (student instanceof WeakPassword) {
      throw new BadRequestException(weakPasswordError);
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
      domain: COOKIE_DOMAIN,
    });
    if (process.env.NODE_ENV !== "testing") {
      await this.emailConfirmationService.sendVerificationLink(
        createStudentDto.email
      );
    }
    return student;
  }

  @Throttle({ default: { limit: 20, ttl: 60000 } }) // restrict to no more than 20 requests per minute
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
      domain: COOKIE_DOMAIN,
    });

    return student;
  }

  @Post("forgot-password")
  public async forgotPassword(
    @Body() forgotPasswordData: ForgotPasswordDto
  ): Promise<void> {
    const student = await this.authService.forgotPassword(
      forgotPasswordData.email
    );

    if (student instanceof NoSuchEmail) {
      throw new BadRequestException(emailDoesNotExistError);
    }
    if (student instanceof EmailNotConfirmed) {
      throw new BadRequestException(emailHasNotBeenConfirmed);
    }
  }

  @Post("reset-password")
  public async resetPassword(
    @Body() resetPasswordData: ResetPasswordDto
  ): Promise<void | Error> {
    const email = await this.authService.decodeResetPassToken(
      resetPasswordData.token
    );
    // Unsure what errors to write here
    if (email instanceof InvalidPayload) {
      throw new BadRequestException();
    }
    if (email instanceof BadToken) {
      throw new BadRequestException();
    }
    if (email instanceof TokenExpiredError) {
      throw new BadRequestException(forgotPasswordTokenExpiredError);
    }
    if (email instanceof Error) {
      throw new BadRequestException();
    }

    const resetPasswordResult = await this.authService.resetPassword(
      email,
      resetPasswordData
    );
    if (resetPasswordResult instanceof WeakPassword) {
      throw new BadRequestException(weakPasswordError);
    }
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
      domain: COOKIE_DOMAIN,
    });
  }
}
