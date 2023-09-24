import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import {
  ConfirmEmailDto,
  emailAlreadyConfirmed,
  unableToSendEmail,
} from "@graduate/common";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import EmailConfirmationService from "./emailConfirmation.service";
import {
  EmailAlreadyConfirmed,
  UnableToSendEmail,
} from "./emailConfirmationErrors";

@Controller("email-confirmation")
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService
  ) {}

  @Post("confirm")
  async confirm(@Body() confirmationData: ConfirmEmailDto): Promise<void> {
    const email = await this.emailConfirmationService.decodeConfirmationToken(
      confirmationData.token
    );
    if (email instanceof Error) {
      throw new BadRequestException();
    }
    const updateResult =
      await this.emailConfirmationService.confirmEmail(email);
    if (updateResult instanceof EmailAlreadyConfirmed) {
      throw new BadRequestException("Email is already confirmed");
    }
  }

  @Post("resend-confirmation-link")
  @UseGuards(JwtAuthGuard)
  async resendConfirmationLink(
    @Req() request: AuthenticatedRequest
  ): Promise<void> {
    const result = await this.emailConfirmationService.resendConfirmationLink(
      request.user.uuid
    );
    if (result instanceof EmailAlreadyConfirmed) {
      throw new BadRequestException(emailAlreadyConfirmed);
    } else if (result instanceof UnableToSendEmail) {
      throw new BadRequestException(unableToSendEmail);
    }
  }
}
