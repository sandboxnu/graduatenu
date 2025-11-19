import { Module } from "@nestjs/common";
import { StudentService } from "./student.service";
import { StudentController } from "./student.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Student } from "./entities/student.entity";
import { PlanModule } from "src/plan/plan.module";

@Module({
  imports: [TypeOrmModule.forFeature([Student]), PlanModule],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
