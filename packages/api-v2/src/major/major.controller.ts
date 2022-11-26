import { GetSupportedMajorsResponse, Major2 } from "@graduate/common";
import {
  BadRequestException,
  Controller,
  Get,
  // NotFoundException,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { MajorService } from "./major.service";
import { SUPPORTED_MAJORS } from "./majors";

@Controller("majors")
export class MajorController {
  constructor(private readonly majorService: MajorService) {}

  @Get("/:catalogYear/:majorName")
  getMajor(
    @Param("catalogYear", ParseIntPipe) catalogYear: number,
    @Param("majorName") majorName: string
  ): Major2 {
    const major = this.majorService.findByMajorAndYear(majorName, catalogYear);
    if (!major) {
      throw new BadRequestException();
    }

    return major;
  }

  @Get("supportedMajors")
  getSupportedMajors(): GetSupportedMajorsResponse {
    const supportedMajors = {};

    // filter out the major predicates
    Object.keys(SUPPORTED_MAJORS).forEach((year) => {
      const { majors } = SUPPORTED_MAJORS[year];
      supportedMajors[year] = majors;
    });

    return { supportedMajors };
  }
}
