import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
} from "@nestjs/common";
import { PlanShareService } from "./plan-share.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { AuthenticatedRequest } from "../auth/interfaces/authenticated-request";
import { GetPlanResponse } from "@graduate/common";

interface PublicPlanResponse {
  id: number;
  name: string;
  schedule: any;
  major: string;
  minor: string;
  concentration: string;
  catalogYear: number;
  createdAt: Date;
  updatedAt: Date;
}

@Controller("plan")
export class PlanShareController {
  constructor(private readonly planShareService: PlanShareService) {}

  @Get("view/:code")
  async viewPlanByCode(
    @Param("code") code: string
  ): Promise<PublicPlanResponse> {
    const planShare = await this.planShareService.getPlanByCode(code);

    return {
      id: planShare.planJson.id,
      name: planShare.planJson.name,
      schedule: planShare.planJson.schedule,
      major: planShare.planJson.major,
      minor: planShare.planJson.minor,
      concentration: planShare.planJson.concentration,
      catalogYear: planShare.planJson.catalogYear,
      createdAt: planShare.planJson.createdAt,
      updatedAt: planShare.planJson.updatedAt,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post("share/import/:code")
  async importPlanByCode(
    @Param("code") code: string,
    @Req() req: AuthenticatedRequest
  ): Promise<GetPlanResponse> {
    const newPlan = await this.planShareService.importPlanByCode(
      code,
      req.user
    );

    return newPlan;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":code")
  async deleteShareCode(
    @Param("code") code: string,
    @Req() req: AuthenticatedRequest
  ): Promise<void> {
    await this.planShareService.deleteShareCode(code, req.user);
  }
}
