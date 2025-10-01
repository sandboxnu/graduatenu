import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ParsedCourse } from "@graduate/common";
import { UtilsService } from "./utils.service";

@Controller("utils")
export class UtilsController {
  constructor(private readonly utilsService: UtilsService) {}

  @Post("parse-pdf-courses")
  @UseInterceptors(FileInterceptor("pdf"))
  async parsePdfCourses(
    @UploadedFile() file: Express.Multer.File
  ): Promise<ParsedCourse[]> {
    return this.utilsService.parsePdfCourses(file.buffer);
  }
}
