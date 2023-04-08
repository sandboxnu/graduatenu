import {
  Major2,
  SupportedMajorsForYear,
  SupportedMajors,
  SupportedConcentrations,
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

      const supportedMajorForYear: SupportedMajorsForYear = {};
      supportedMajorNames.forEach((majorName) => {
        const supportedConcentrations = this.getConcentrationsInfoForMajor(
          majorName,
          parseInt(year)
        );
        supportedMajorForYear[majorName] = supportedConcentrations;
      });

      supportedMajors[year] = supportedMajorForYear;
    });

    return supportedMajors;
  }

  getConcentrationsInfoForMajor(
    majorName: string,
    catalogYear: number
  ): SupportedConcentrations | null {
    const major = this.findByMajorAndYear(majorName, catalogYear);
    if (!major) {
      return null;
    }

    const concentrations =
      major.concentrations?.concentrationOptions.map(
        (concentration) => concentration.title
      ) ?? [];

    return {
      concentrations,
      minRequiredConcentrations: major.concentrations?.minOptions ?? 0,
    };
  }

  isValidConcentrationForMajor(
    majorName: string,
    catalogYear: number,
    concentrationName: string
  ): boolean {
    const concentrationsInfo = this.getConcentrationsInfoForMajor(
      majorName,
      catalogYear
    );

    if (!concentrationsInfo) {
      this.logger.debug(
        {
          message: "Concentration info for major not found.",
          majorName,
          catalogYear,
          concentrationName,
        },
        MajorService.formatMajorServiceCtx("isValidConcentrationForMajor")
      );

      return false;
    }

    const { concentrations, minRequiredConcentrations } = concentrationsInfo;

    // major doesn't have any concentrations
    if (concentrations.length === 0) {
      return concentrationName === "";
    }

    if (minRequiredConcentrations > 0 && !concentrationName) {
      this.logger.debug(
        {
          message:
            "Concentration not provided for major with a required concentration.",
          majorName,
          catalogYear,
          concentrationName,
          minRequiredConcentrations,
        },
        MajorService.formatMajorServiceCtx("isValidConcentrationForMajor")
      );

      return false;
    }

    const isValidConcentrationName = concentrations.some(
      (c) => c === concentrationName
    );

    if (!isValidConcentrationName) {
      this.logger.debug(
        {
          message: "Invalid concentration name for major.",
          majorName,
          catalogYear,
          concentrationName,
        },
        MajorService.formatMajorServiceCtx("isValidConcentrationForMajor")
      );

      return false;
    }

    return true;
  }

  private static formatMajorServiceCtx(methodName: string) {
    return formatServiceCtx(MajorService.name, methodName);
  }
}
