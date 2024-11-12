import { Module } from "@nestjs/common";
import { MinorService } from "./minor.service";
import { MinorController } from "./minor.controller";

@Module({
  controllers: [MinorController],
  providers: [MinorService],
  exports: [MinorService],
})
export class MinorModule {}
