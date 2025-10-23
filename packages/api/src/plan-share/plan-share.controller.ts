import {
  Body,
  Controller,
  Param,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { PlanShareService } from "./plan-share.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { AuthenticatedRequest } from "../auth/interfaces/authenticated-request";
import { CreatePlanShareDto, SharePlanResponse } from "@graduate/common";

@Controller("plans/share")
export class PlanShareController {
  constructor(private readonly planShareService: PlanShareService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async sharePlan(
    @Req() req: AuthenticatedRequest,
    @Body() body: CreatePlanShareDto
  ): Promise<SharePlanResponse> {
    return this.planShareService.createShare({
      studentUuid: req.user.uuid,
      planJson: body.planJson,
      expiresInDays: body.expiresInDays,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post("import/:code")
  async importSharedPlan(
    @Req() req: AuthenticatedRequest,
    @Param("code") code: string
  ) {
    return this.planShareService.importSharedPlan(req.user.uuid, code);
  }

  @Get("view/:code")
  async viewSharedPlan(@Param("code") code: string) {
    return this.planShareService.getSharedPlan(code);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":code")
  async deletePlanCode(
    @Req() req: AuthenticatedRequest,
    @Param("code") code: string
  ) {
    return this.planShareService.deletePlanCode(req.user.uuid, code);
  }
}
