import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import ormconfig from "../ormconfig";
import { StudentModule } from "./student/student.module";
import { AuthModule } from "./auth/auth.module";
import { PlanModule } from "./plan/plan.module";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { LoggingInterceptor } from "./interceptors/logging.interceptor";
import { MajorModule } from "./major/major.module";
import { EmailModule } from "./email/email.module";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { MetaModule } from "./meta/meta.module";
import { MinorModule } from "./minor/minor.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}.local`],
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // no more than 100 requests in a minute
        limit: 100,
      },
    ]),
    StudentModule,
    AuthModule,
    PlanModule,
    MajorModule,
    MinorModule,
    EmailModule,
    MetaModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
