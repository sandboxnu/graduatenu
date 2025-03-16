import { type MetaInfo } from "@graduate/common";
import { Injectable } from "@nestjs/common";
import {
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
  HealthCheckResult,
} from "@nestjs/terminus";

@Injectable()
export class MetaService {
  getMetaInfo(): MetaInfo {
    return {
      commit: process.env.COMMIT_HASH ?? false,
      commitMessage: process.env.COMMIT_MESSAGE ?? false,
      environment: process.env.NODE_ENV ?? false,
    };
  }

  getHealthInfo(
    health: HealthCheckService,
    http: HttpHealthIndicator,
    db: TypeOrmHealthIndicator
  ): Promise<HealthCheckResult> {
    return health.check([
      () =>
        http.pingCheck("graduate_api", "https://graduatenu.com/api/meta/info"),
      () => db.pingCheck("database"),
    ]);
  }
}
