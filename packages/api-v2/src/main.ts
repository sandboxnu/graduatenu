import {
  ClassSerializerInterceptor,
  LogLevel,
  LoggerService,
  ValidationPipe,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory, Reflector } from "@nestjs/core";
import { GraduateLogger } from "../src/graduate-logger";
import { AppModule } from "./app.module";
import { EnvironmentVariables } from "./environment-variables";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  // configure custom logger
  const graduateLogger: LoggerService = new GraduateLogger("graduatenu", {
    logLevels: logLevels(process.env.NODE_ENV),
  });

  const app = await NestFactory.create(AppModule, {
    logger: graduateLogger,
    cors: {
      origin:
        "https://graduatenu-frontend-v2-git-christina-move-fro-b625a5-sandboxneu.vercel.app",
      credentials: true,
      methods: ["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH"],
    },
  });

  /**
   * Global pipe that ensures all incoming data is validated according to the
   * class-validator decorators in the incoming data's type.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties from incoming objects that aren't decorated with class-validator
      transformOptions: { exposeUnsetFields: false },
      transform: true, // transforms properties from incoming objects to the type they are decorated with by class-validator
    })
  );

  /** Global middleware to parse cookies from requests. */
  app.use(cookieParser());

  /**
   * Global intercerceptor that transforms outgoing data and strips properties
   * with the "@Exclude" decorator from being sent in the response. For this to
   * work, returned objects in controllers have to be an actual instance of the
   * type with the appropriate decorators.
   */
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  /** All paths are prefixed with /api. */
  app.setGlobalPrefix("api");

  const configService: ConfigService<EnvironmentVariables, true> =
    app.get(ConfigService);

  await app.listen(configService.get("PORT"));
}

function logLevels(env: string): LogLevel[] {
  if (env === "production") {
    return ["error", "warn"];
  }
  return ["log", "error", "warn", "debug"];
}

bootstrap();
