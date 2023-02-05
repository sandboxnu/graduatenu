import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { EnvironmentVariables } from "src/environment-variables";

@Injectable()
export default class EmailService {
  private nodemailerTransport: Mail;

  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>
  ) {
    this.nodemailerTransport = createTransport({
      service: this.configService.get("EMAIL_SERVICE"),
      auth: {
        user: this.configService.get("EMAIL_USER"),
        pass: this.configService.get("EMAIL_PASSWORD"),
      },
    });
  }

  sendMail(options: Mail.Options) {
    return this.nodemailerTransport.sendMail(options);
  }
}
