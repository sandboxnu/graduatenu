import { Controller, Get } from "@nestjs/common";
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  TypeOrmHealthIndicator,
  HealthCheckResult,
} from "@nestjs/terminus";
import { MetaService } from "./meta.service";
import { type MetaInfo } from "@graduate/common";

@Controller("meta")
export class MetaController {
  constructor(
    private readonly metaService: MetaService,
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator
  ) {}

  @Get("/info")
  getMetaInfo(): MetaInfo {
    return this.metaService.getMetaInfo();
  }

  @Get("/health")
  @HealthCheck()
  async getHealthInfo(): Promise<HealthCheckResult> {
    return await this.metaService.getHealthInfo(
      this.health,
      this.http,
      this.db
    );
  }
}
