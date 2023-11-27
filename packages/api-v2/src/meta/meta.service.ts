import { type MetaInfo } from "@graduate/common";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MetaService {
  getMetaInfo(): MetaInfo {
    return {
      commit: process.env.COMMIT_HASH ?? false,
      commitMessage: process.env.COMMIT_MESSAGE ?? false,
      build_timestamp:
        process.env.BUILD_TIMESTAMP !== undefined
          ? Number(process.env.BUILD_TIMESTAMP)
          : false,
      environment: process.env.NODE_ENV ?? false,
    };
  }
}
