import { emailConfirmationMsg } from "@graduate/common";
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { AuthenticatedRequest } from "../auth/interfaces/authenticated-request";
import { formatServiceCtx } from "../utils";

@Injectable()
export class EmailConfirmationGuard implements CanActivate {
  private readonly logger: Logger = new Logger();

  canActivate(context: ExecutionContext) {
    const request: AuthenticatedRequest = context.switchToHttp().getRequest();

    if (!request.user?.isEmailConfirmed) {
      this.logger.debug(
        { message: "email not confirmed", user: request.user },
        formatServiceCtx("OwnPlanGuard", "canActivate")
      );

      throw new UnauthorizedException(emailConfirmationMsg);
    }

    return true;
  }
}
