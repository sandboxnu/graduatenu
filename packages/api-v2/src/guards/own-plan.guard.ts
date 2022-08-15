import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  Logger,
} from "@nestjs/common";
import { PlanService } from "src/plan/plan.service";
import { Student } from "src/student/entities/student.entity";
import { formatServiceCtx } from "src/utils";

/**
 * Used to protect GET/PUT/PATCH :id Plan controller methods from being accessed
 * by users that don't own the plan. Plan methods that aren't for a specific
 * plan and hence don't have the id param are allowed by this guard.
 */
@Injectable()
export class OwnPlanGuard implements CanActivate {
  private readonly logger: Logger = new Logger();

  constructor(@Inject(PlanService) private readonly planService: PlanService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // allow any controller methods that aren't a part of the Plan controller
    const handlerClassName = context.getClass().name;
    if (handlerClassName !== "PlanController") {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // user is attached by passport if the request has an attached jwt and the jwt is verfied
    const loggedInUser = request.user as Student;

    if (!loggedInUser) {
      return false;
    }

    const planId = request.params.id;

    /**
     * Allow methods that don't have an id param, since they shouldn't be
     * guarded by this guard in the first place.
     */
    if (!planId) {
      return true;
    }

    // ensure the plan is owned by the logged in user
    const res = this.planService.isPlanOwnedByStudent(planId, loggedInUser);
    if (!res) {
      this.logger.debug(
        { message: "Plan not owned by student", loggedInUser, planId },
        formatServiceCtx("OwnPlanGuard", "canActivate")
      );
    }
  }
}
