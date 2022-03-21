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
import { CreatePlanDto } from "./dto/create-plan.dto";
import { UpdatePlanDto } from "./dto/update-plan.dto";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request";
import { Plan } from "./entities/plan.entity";
import { OwnPlanGuard } from "src/guards/own-plan.guard";

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
  ): Promise<Plan> {
    const plan = await this.planService.create(createPlanDto, req.user);

    if (!plan) {
      throw new BadRequestException();
    }

    return plan;
  }

  @UseGuards(JwtAuthGuard, OwnPlanGuard)
  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<Plan> {
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
  ) {
    const updateResult = await this.planService.update(id, updatePlanDto);

    if (!updateResult) {
      throw new BadRequestException();
    }

    return updateResult;
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, OwnPlanGuard)
  async remove(@Param("id", ParseIntPipe) id: number) {
    const deleteResult = await this.planService.remove(id);
    if (!deleteResult) {
      throw new BadRequestException();
    }

    return deleteResult;
  }
}
