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
    // validate the major, year, and concentration
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

  async findOne(id: number): Promise<Plan> {
    return this.planRepository.findOne({
      where: { id },
      relations: ["student"],
    });
  }

  async isPlanOwnedByStudent(
    planId: number,
    loggedInStudent: Student
  ): Promise<boolean> {
    const { student: planOwner } = await this.findOne(planId);

    /** A plan that doesn't exist isn't owned by the anyone so returning false. */
    if (!planOwner) {
      this.logger.debug(
        { message: "Plan doesn't exist in db", planId },
        this.formatPlanServiceCtx("isPlanOwnedByStudent")
      );
      return false;
    }

    return StudentService.isEqualStudents(planOwner, loggedInStudent);
  }

  async update(
    id: number,
    updatePlanDto: UpdatePlanDto
  ): Promise<UpdateResult> {
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
