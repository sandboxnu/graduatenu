import { ConsoleLogger, LogLevel } from "@nestjs/common";
import { deepFilter } from "src/utils";

const BLACKLIST = ["password"];

export class GraduateLogger extends ConsoleLogger {
  protected stringifyMessage(message: unknown, logLevel: LogLevel) {
    message = deepFilter(message, BLACKLIST);
    return super.stringifyMessage(message, logLevel);
  }
}
