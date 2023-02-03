import { GetSupportedMajorsResponse, Major2 } from "../../../common";
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { MajorService } from "./major.service";

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
      throw new NotFoundException();
    }

    return major;
  }

  @Get("supportedMajors")
  getSupportedMajors(): GetSupportedMajorsResponse {
    const supportedMajors = this.majorService.getSupportedMajors();
    return { supportedMajors };
  }
}
