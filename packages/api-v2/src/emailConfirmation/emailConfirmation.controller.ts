import {
  Controller,
  ClassSerializerInterceptor,
  UseInterceptors,
  Post,
  Body,
  UseGuards,
  Req,
} from "@nestjs/common";

import JwtAuthenticationGuard from "../authentication/jwt-authentication.guard";
import RequestWithUser from "../authentication/requestWithUser.interface";
import { ConfirmEmailDto } from "@graduate/common";
import EmailConfirmationService from "./emailConfirmation.service";

@Controller("email-confirmation")
@UseInterceptors(ClassSerializerInterceptor)
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService
  ) {}

  @Post("confirm")
  async confirm(@Body() confirmationData: ConfirmEmailDto) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(
      confirmationData.token
    );
    await this.emailConfirmationService.confirmEmail(email);
  }
}
