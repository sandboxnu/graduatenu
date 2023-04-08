import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { EnvironmentVariables } from "src/environment-variables";
import { StudentService } from "src/student/student.service";
import { UpdateResult } from "typeorm";
import EmailService from "../email/email.service";
import {
  EmailAlreadyConfirmed,
  UnableToSendEmail,
} from "./emailConfirmationErrors";

@Injectable()
export default class EmailConfirmationService {
  private readonly logger: Logger = new Logger();
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    private readonly emailService: EmailService,
    private readonly studentService: StudentService
  ) {}

  public sendVerificationLink(email: string): Promise<any> {
    const payload = { email };
    const token = this.jwtService.sign(payload);
    const url = `${this.configService.get(
      "EMAIL_CONFIRMATION_URL"
    )}?token=${token}`;
    const text = `Welcome to GraduateNU! Visit the following link to confirm click your email: ${url}`;

    return this.emailService.sendMail({
      to: email,
      subject: "GradauteNU - Email Verification",
      text,
    });
  }

  public async confirmEmail(
    email: string
  ): Promise<UpdateResult | EmailAlreadyConfirmed> {
    const student = await this.studentService.findByEmail(email);

    if (student.isEmailConfirmed) {
      this.logger.debug({
        message: "Email is already confirmed",
        student,
      });
      return new EmailAlreadyConfirmed();
    }

    return await this.studentService.markEmailAsConfirmed(email);
  }

  public async decodeConfirmationToken(token: string): Promise<string | Error> {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get("JWT_SECRET_KEY"),
      });

      if (
        typeof payload === "object" &&
        "email" in payload &&
        typeof payload.email === "string"
      ) {
        return payload.email;
      }
      this.logger.debug({
        message: "Invalid payload",
        payload,
      });
      return new Error();
    } catch (error) {
      if (error?.name === "TokenExpiredError") {
        this.logger.debug({
          message: "Email confirmation token expired",
          error,
        });
        return new Error();
      }
      this.logger.debug({
        message: "Bad confirmation token",
      });
      return new Error();
    }
  }

  public async resendConfirmationLink(
    uuid: string
  ): Promise<EmailAlreadyConfirmed | UnableToSendEmail> {
    const student = await this.studentService.findByUuid(uuid);
    if (student.isEmailConfirmed) {
      this.logger.debug({
        message: "Email is already confirmed",
        student,
      });
      return new EmailAlreadyConfirmed();
    }
    // TODO: Disable old JWT token
    const result = await this.sendVerificationLink(student.email);
    if (!result) {
      this.logger.debug({
        message: "Unable to send verification link",
      });
      return new UnableToSendEmail();
    }
    return result;
  }
}
