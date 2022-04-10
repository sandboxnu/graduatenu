import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
  ParseIntPipe,
} from "@nestjs/common";
import { PlanService } from "./plan.service";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request";
import { OwnPlanGuard } from "src/guards/own-plan.guard";
import {
  CreatePlanDto,
  UpdatePlanDto,
  GetPlanResponse,
  UpdatePlanResponse,
} from "../../../common";

@Controller("plans")
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  /**
   * Creates a plan for the signed in user.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createPlanDto: CreatePlanDto,
    @Req() req: AuthenticatedRequest
  ): Promise<GetPlanResponse> {
    const plan = await this.planService.create(createPlanDto, req.user);

    if (!plan) {
      throw new BadRequestException();
    }

    return plan;
  }

  @UseGuards(JwtAuthGuard, OwnPlanGuard)
  @Get(":id")
  async findOne(
    @Param("id", ParseIntPipe) id: number
  ): Promise<GetPlanResponse> {
    const plan = await this.planService.findOne(id);

    if (!plan) {
      throw new BadRequestException();
    }

    return plan;
  }

  @UseGuards(JwtAuthGuard, OwnPlanGuard)
  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updatePlanDto: UpdatePlanDto
  ): Promise<UpdatePlanResponse> {
    const updateResult = await this.planService.update(id, updatePlanDto);

    if (!updateResult) {
      throw new BadRequestException();
    }

    const plan = await this.planService.findOne(id);

    if (!plan) {
      throw new BadRequestException();
    }

    return plan;
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, OwnPlanGuard)
  async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    const deleteResult = await this.planService.remove(id);
    if (!deleteResult) {
      throw new BadRequestException();
    }
  }
}
