import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Student } from "../student/entities/student.entity";
import { StudentService } from "../student/student.service";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { CreatePlanDto, UpdatePlanDto } from "../../../common";
import { Plan } from "./entities/plan.entity";
import { formatServiceCtx } from "../../src/utils";
import { MajorService } from "../major/major.service";

@Injectable()
export class PlanService {
  private readonly logger: Logger = new Logger();

  constructor(
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
    private readonly majorService: MajorService
  ) {}

  create(createPlanDto: CreatePlanDto, student: Student): Promise<Plan> {
    // validate the major, year
    const { major: majorName, catalogYear } = createPlanDto;
    const major = this.majorService.findByMajorAndYear(majorName, catalogYear);
    if (!major) {
      this.logger.debug(
        {
          message: "Attempting to create a plan with an unsupported major.",
          major,
          catalogYear,
        },
        this.formatPlanServiceCtx("create")
      );

      return null;
    }

    const newPlan = this.planRepository.create({ ...createPlanDto, student });

    try {
      return this.planRepository.save(newPlan);
    } catch (error) {
      return null;
    }
  }

  /** Returns the plan if it exists, else returns nothing. */
  async findOne(id: number): Promise<Plan | void> {
    const plan = await this.planRepository.findOne({
      where: { id },
      relations: ["student"],
    });

    if (!plan) {
      this.logger.debug(
        { message: "Plan doesn't exist in db", id },
        this.formatPlanServiceCtx
      );
      return;
    }

    return plan;
  }

  async isPlanOwnedByStudent(
    planId: number,
    loggedInStudent: Student
  ): Promise<boolean> {
    const plan = await this.findOne(planId);
    if (!plan) {
      this.logger.debug(
        { message: "Plan doesn't exist in db", planId },
        this.formatPlanServiceCtx("isPlanOwnedByStudent")
      );
      return false;
    }

    const planOwner = plan.student;

    return StudentService.isEqualStudents(planOwner, loggedInStudent);
  }

  async update(
    id: number,
    updatePlanDto: UpdatePlanDto
  ): Promise<UpdateResult> {
    const { major: newMajorName, catalogYear: newCatalogYear } = updatePlanDto;

    // validate the major, year pair if either one is being updated
    if (newCatalogYear || newMajorName) {
      let catalogYear = newCatalogYear;
      let majorName = newMajorName;

      // if either one isn't updated, fetch it from db
      if (!newCatalogYear || !newMajorName) {
        const plan = await this.findOne(id);

        // updating a non-existent plan
        if (!plan) {
          return null;
        }

        if (!newCatalogYear) {
          catalogYear = plan.catalogYear;
        }

        if (!newMajorName) {
          majorName = plan.major;
        }
      }

      const major = this.majorService.findByMajorAndYear(
        majorName,
        catalogYear
      );
      if (!major) {
        this.logger.debug(
          {
            message: "Attempting to create a plan with an unsupported major.",
            major,
            catalogYear,
          },
          this.formatPlanServiceCtx("create")
        );

        return null;
      }
    }

    const updateResult = await this.planRepository.update(id, updatePlanDto);

    if (updateResult.affected === 0) {
      // no plan was updated, which implies a plan with the given id wasn't found
      this.logger.debug(
        { message: "Plan doesn't exist in db", id },
        this.formatPlanServiceCtx("update")
      );
      return null;
    }

    return updateResult;
  }

  async remove(id: number): Promise<DeleteResult> {
    const deleteResult = await this.planRepository.delete(id);

    if (deleteResult.affected === 0) {
      // no plan was deleted, which implies a plan with the given id wasn't found
      this.logger.debug(
        { message: "Plan doesn't exist in db", id },
        this.formatPlanServiceCtx("delete")
      );
      return null;
    }

    return deleteResult;
  }

  private formatPlanServiceCtx(methodName: string): string {
    return formatServiceCtx(PlanService.name, methodName);
  }
}
