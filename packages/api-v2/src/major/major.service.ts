import { Major2 } from "@graduate/common";
import { Injectable, Logger } from "@nestjs/common";
import { formatServiceCtx } from "../utils";
import { SUPPORTED_MAJOR_YEARS, SUPPORTED_MAJORS } from "./majors";

@Injectable()
export class MajorService {
  private readonly logger: Logger = new Logger();

  constructor() {}

  findByMajorAndYear(majorName: string, catalogYear: number): Major2 | null {
    if (!SUPPORTED_MAJOR_YEARS.includes(catalogYear.toString())) {
      this.logger.debug(
        { mesage: "Major year not found", catalogYear },
        MajorService.formatMajorServiceCtx("findByMajorAndYear")
      );
      return null;
    }

    const { majors, supportedMajorNames } = SUPPORTED_MAJORS[catalogYear];
    if (!supportedMajorNames.includes(majorName)) {
      this.logger.debug(
        { mesage: "Major within year not found", majorName, catalogYear },
        MajorService.formatMajorServiceCtx("findByMajorAndYear")
      );
      return null;
    }

    return majors[majorName];
  }

  getSupportedMajors(): Record<string, string[]> {
    // filter out the majors themselves
    const supportedMajors = {};
    SUPPORTED_MAJOR_YEARS.map((year) => {
      const { supportedMajorNames } = SUPPORTED_MAJORS[year];
      supportedMajors[year] = supportedMajorNames;
    });

    return supportedMajors;
  }

  private static formatMajorServiceCtx(methodName: string) {
    return formatServiceCtx(MajorService.name, methodName);
  }
}
