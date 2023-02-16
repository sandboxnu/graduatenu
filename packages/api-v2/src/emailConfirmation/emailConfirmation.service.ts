import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { EnvironmentVariables } from "src/environment-variables";
import EmailService from "../email/email.service";
import { StudentService } from "src/student/student.service";

@Injectable()
export default class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    private readonly emailService: EmailService,
    private readonly studentService: StudentService
  ) {}

  public sendVerificationLink(email: string) {
    const payload = { email };
    const token = this.jwtService.sign(payload);
    const url = `${this.configService.get(
      "EMAIL_CONFIRMATION_URL"
    )}?token=${token}`;
    const text = `Welcome to Graduate, to confirm click here: ${url}`;

    return this.emailService.sendMail({
      to: email,
      subject: "Email Confirmation",
      text,
    });
  }

  public async confirmEmail(email: string) {
    const student = await this.studentService.findByEmail(email);

    if (student.isEmailConfirmed) {
      throw new BadRequestException("Email already confirmed");
    }

    await this.studentService.markEmailAsConfirmed(email);
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get("JWT_SECRET_KEY"),
      });

      if (typeof payload === "object" && "email" in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === "TokenExpiredError") {
        throw new BadRequestException("Email confirmation token expired");
      }
      throw new BadRequestException("Bad confirmation token");
    }
  }

  public async resendConfirmationLink(uuid: string) {
    const student = await this.studentService.findByUuid(uuid);
    if (student.isEmailConfirmed) {
      throw new BadRequestException("Email already confirmed");
    }
    await this.sendVerificationLink(student.email);
  }
}
