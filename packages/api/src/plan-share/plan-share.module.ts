import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlanShare } from "./entities/plan-share.entity";
import { Plan } from "../plan/entities/plan.entity";
import { Student } from "../student/entities/student.entity";
import { PlanShareService } from "./plan-share.service";
import { PlanShareController } from "./plan-share.controller";

@Module({
  imports: [TypeOrmModule.forFeature([PlanShare, Plan, Student])],
  providers: [PlanShareService],
  controllers: [PlanShareController],
})
export class PlanShareModule {}
