import { ConsoleLogger, LogLevel } from "@nestjs/common";
import { deepFilter } from "./utils";

const DENYLIST = ["password", "passwordConfirm"];

export class GraduateLogger extends ConsoleLogger {
  protected stringifyMessage(message: unknown, logLevel: LogLevel) {
    message = deepFilter(message, DENYLIST);
    return super.stringifyMessage(message, logLevel);
  }
}
