import { GetSupportedMinorsResponse, Minor } from "@graduate/common";
import { MinorService } from "./minor.service";
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from "@nestjs/common";

@Controller("minors")
export class MinorController {
  constructor(private readonly minorService: MinorService) {}
  @Get("/:catalogYear/:minorName")
  getMinor(
    @Param("catalogYear", ParseIntPipe) catalogYear: number,
    @Param("minorName") minorName: string
  ): Minor {
    const minor = this.minorService.findByMinorAndYear(minorName, catalogYear);
    if (!minor) {
      throw new NotFoundException();
    }

    return minor;
  }

  @Get("supportedMinors")
  getSupportedMinors(): GetSupportedMinorsResponse {
    const supportedMinors = this.minorService.getSupportedMinors();
    return { supportedMinors };
  }
}
