import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import EmailService from "./email.service";
import { JwtModule } from "@nestjs/jwt";
import EmailConformationService from "./emailConformation.service";

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRE_TIME,
      },
    }),
  ],
  controllers: [],
  providers: [EmailService, EmailConformationService],
  exports: [EmailService, EmailConformationService],
})
export class EmailModule {}
