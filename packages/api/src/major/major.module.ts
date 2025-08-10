import { Module } from "@nestjs/common";
import { MajorService } from "./major.service";
import { MajorController } from "./major.controller";
import { TemplateController } from "./templates.controller";

@Module({
  controllers: [MajorController, TemplateController],
  providers: [MajorService],
  exports: [MajorService],
})
export class MajorModule {}
