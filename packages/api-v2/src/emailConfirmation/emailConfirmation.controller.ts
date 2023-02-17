import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";

import { ConfirmEmailDto } from "@graduate/common";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import EmailConfirmationService from "./emailConfirmation.service";

@Controller("email-confirmation")
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

  @Post("resend-confirmation-link")
  @UseGuards(JwtAuthGuard)
  async resendConfirmationLink(@Req() request: AuthenticatedRequest) {
    await this.emailConfirmationService.resendConfirmationLink(
      request.user.uuid
    );
  }
}
