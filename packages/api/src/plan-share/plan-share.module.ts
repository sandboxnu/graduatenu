import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlanShare } from "./entities/plan-share.entity";
import { PlanShareService } from "./plan-share.service";
import { PlanShareController } from "./plan-share.controller";
import { Student } from "../student/entities/student.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PlanShare, Student])],
  providers: [PlanShareService],
  controllers: [PlanShareController],
})
export class PlanShareModule {}
