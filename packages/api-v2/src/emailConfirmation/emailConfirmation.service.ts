import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { EnvironmentVariables } from "src/environment-variables";
import EmailService from "../email/email.service";

@Injectable()
export default class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    private readonly emailService: EmailService
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

  public confirmEmail;
}
