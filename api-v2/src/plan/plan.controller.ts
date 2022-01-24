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
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request';
import { Plan } from './entities/plan.entity';
import { OwnPlanGuard } from 'src/guards/own-plan.guard';

@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  /**
   * Creates a plan for the signed in user.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createPlanDto: CreatePlanDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Plan> {
    try {
      return await this.planService.create(createPlanDto, req.user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, OwnPlanGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Plan> {
    try {
      return await this.planService.findOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, OwnPlanGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlanDto: UpdatePlanDto,
  ) {
    try {
      return await this.planService.update(id, updatePlanDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, OwnPlanGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.planService.remove(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
