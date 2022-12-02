import {
  Major2,
  SupportedMajorForYear,
  SupportedMajors,
} from "@graduate/common";
import { Injectable, Logger } from "@nestjs/common";
import { formatServiceCtx } from "../utils";
import { SUPPORTED_MAJOR_YEARS, SUPPORTED_MAJORS } from "./majors";

@Injectable()
export class MajorService {
  private readonly logger: Logger = new Logger();

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

  getSupportedMajors(): SupportedMajors {
    const supportedMajors: SupportedMajors = {};
    SUPPORTED_MAJOR_YEARS.forEach((year) => {
      const { supportedMajorNames } = SUPPORTED_MAJORS[year];

      const supportedMajorForYear: SupportedMajorForYear = {};
      supportedMajorNames.forEach((majorName) => {
        const major = this.findByMajorAndYear(majorName, parseInt(year, 10));
        const concentrations = major.concentrations.concentrationOptions.map(
          (concentration) => concentration.title
        );
        supportedMajorForYear[majorName] = {
          concentrations,
          minRequiredConcentrations: major.concentrations.minOptions,
        };
      });

      supportedMajors[year] = supportedMajorForYear;
    });

    return supportedMajors;
  }

  private static formatMajorServiceCtx(methodName: string) {
    return formatServiceCtx(MajorService.name, methodName);
  }
}
