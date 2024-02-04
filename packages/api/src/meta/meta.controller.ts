import { Controller, Get } from "@nestjs/common";
import { MetaService } from "./meta.service";
import { type MetaInfo } from "@graduate/common";

@Controller("meta")
export class MetaController {
  constructor(private readonly metaService: MetaService) {}

  @Get("/info")
  getMetaInfo(): MetaInfo {
    return this.metaService.getMetaInfo();
  }
}
