import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import EmailService from "./email.service";
import { JwtModule } from "@nestjs/jwt";
import EmailConfirmationService from "../emailConfirmation/emailConfirmation.service";
import { StudentModule } from "../../src/student/student.module";
import { EmailConfirmationController } from "../../src/emailConfirmation/emailConfirmation.controller";

@Module({
  imports: [
    StudentModule,
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRE_TIME_EMAIL,
      },
    }),
  ],
  controllers: [EmailConfirmationController],
  providers: [EmailService, EmailConfirmationService],
  exports: [EmailService, EmailConfirmationService],
})
export class EmailModule {}
