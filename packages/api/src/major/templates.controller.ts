import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  NotFoundException,
  Logger,
} from "@nestjs/common";
import { Template } from "@graduate/common";
import { TEMPLATES } from "./major-collator";

@Controller("templates")
export class TemplateController {
  private readonly logger: Logger = new Logger();

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
    const year = String(catalogYear);
    if (!TEMPLATES[year]) {
      this.logger.debug({
        message: "No templates found for year",
        catalogYear,
      });
      return null;
    }

    return TEMPLATES[year];
  }

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
    const template = TEMPLATES[catalogYear]?.[majorName];
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
}
