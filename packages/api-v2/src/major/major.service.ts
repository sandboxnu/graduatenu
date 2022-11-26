import { Major2 } from "@graduate/common";
import { Injectable, Logger } from "@nestjs/common";
import { formatServiceCtx } from "../utils";
import { isSupportedYear, SUPPORTED_MAJORS } from "./majors";

@Injectable()
export class MajorService {
  private readonly logger: Logger = new Logger();

  constructor() {}

  findByMajorAndYear(majorName: string, catalogYear: number): Major2 | null {
    if (!isSupportedYear(catalogYear)) {
      this.logger.debug(
        { mesage: "Major year not found", catalogYear },
        MajorService.formatMajorServiceCtx("findByMajorAndYear")
      );
      return null;
    }

    const { majors, isSupportedMajorName } = SUPPORTED_MAJORS[catalogYear];
    if (!isSupportedMajorName(majorName)) {
      this.logger.debug(
        { mesage: "Major within year not found", majorName, catalogYear },
        MajorService.formatMajorServiceCtx("findByMajorAndYear")
      );
      return null;
    }

    return majors[majorName];
  }

  private static formatMajorServiceCtx(methodName: string) {
    return formatServiceCtx(MajorService.name, methodName);
  }
}
