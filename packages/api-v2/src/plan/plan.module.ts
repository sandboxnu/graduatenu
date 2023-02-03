import { Module } from "@nestjs/common";
import { PlanService } from "./plan.service";
import { PlanController } from "./plan.controller";
import { Plan } from "./entities/plan.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MajorModule } from "../major/major.module";

@Module({
  imports: [TypeOrmModule.forFeature([Plan]), MajorModule],
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}
