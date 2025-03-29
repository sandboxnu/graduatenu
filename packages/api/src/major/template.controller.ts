import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  NotFoundException,
  Logger,
} from "@nestjs/common";
import { MajorService } from "./major.service";
import { Template } from "@graduate/common";

@Controller("templates")
export class TemplateController {
  private readonly logger: Logger = new Logger();

  constructor(private readonly majorService: MajorService) {}

  /**
   * Get a template for a specific major and catalog year
   *
   * @param   majorName   Name of the major
   * @param   catalogYear Catalog year
   * @returns             The template for the specified major
   */
  @Get(":catalogYear/:majorName")
  getTemplateForMajor(
    @Param("majorName") majorName: string,
    @Param("catalogYear", ParseIntPipe) catalogYear: number
  ): Template {
    const template = this.majorService.getTemplateForMajor(
      majorName,
      catalogYear
    );

    if (!template) {
      this.logger.debug({
        message: "Template not found",
        majorName,
        catalogYear,
      });
      throw new NotFoundException(
        `Template not found for major ${majorName} in catalog year ${catalogYear}`
      );
    }

    return template;
  }

  /**
   * Get all templates for a specific catalog year
   *
   * @param   catalogYear Catalog year
   * @returns             Map of major names to their templates
   */
  @Get(":catalogYear")
  getTemplatesForYear(
    @Param("catalogYear", ParseIntPipe) catalogYear: number
  ): Record<string, Template> {
    const templates = this.majorService.getTemplatesForYear(catalogYear);

    if (!templates) {
      this.logger.debug({
        message: "No templates found for year",
        catalogYear,
      });
      throw new NotFoundException(
        `No templates found for catalog year ${catalogYear}`
      );
    }

    return templates;
  }

  /**
   * Get all templates across all catalog years
   *
   * @returns Map of catalog years to maps of major names to templates
   */
  @Get()
  getAllTemplates(): Record<string, Record<string, Template>> {
    return this.majorService.getAllTemplates();
  }
}
