import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { HttpModule } from "@nestjs/axios";
import { MetaService } from "./meta.service";
import { MetaController } from "./meta.controller";

@Module({
  controllers: [MetaController],
  providers: [MetaService],
  imports: [HttpModule, TerminusModule],
  exports: [MetaService],
})
export class MetaModule {}
