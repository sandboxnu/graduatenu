import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlanShare } from "./entities/plan-share.entity";
import { PlanShareService } from "./plan-share.service";
import { PlanShareController } from "./plan-share.controller";

@Module({
  imports: [TypeOrmModule.forFeature([PlanShare])],
  providers: [PlanShareService],
  controllers: [PlanShareController],
})
export class PlanShareModule {}
