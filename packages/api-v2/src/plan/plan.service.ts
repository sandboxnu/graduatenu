import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Student } from "../student/entities/student.entity";
import { StudentService } from "../student/student.service";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { CreatePlanDto, UpdatePlanDto } from "@graduate/common";
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
    // validate the major, year, concentration
    const {
      major: majorName,
      catalogYear,
      concentration: concentrationName,
    } = createPlanDto;
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

    const isValidConcentrationForMajor =
      this.majorService.isValidConcentrationForMajor(
        majorName,
        catalogYear,
        concentrationName
      );

    if (!isValidConcentrationForMajor) {
      this.logger.debug(
        {
          message:
            "Attempting to create a plan with an unsupported concentration.",
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
    const {
      major: newMajorName,
      catalogYear: newCatalogYear,
      concentration: newConcentrationName,
      schedule: newSchedule,
    } = updatePlanDto;

    const currentPlan = await this.findOne(id);

    if (!currentPlan) {
      this.logger.debug(
        { message: "Plan doesn't exist in db", id },
        this.formatPlanServiceCtx("update")
      );
      return null;
    }

    /**
     * Either all info related to major needs to be updated, or only the
     * schedule needs to be updated.
     *
     * TODO: Fix the DTO issue that populates undefined values for fields not
     * present. https://github.com/sandboxnu/graduatenu/issues/533
     */
    const isMajorInfoUpdate =
      newMajorName && newCatalogYear && newConcentrationName;
    const isScheduleUpdate = newSchedule && !isMajorInfoUpdate;

    if (!(isMajorInfoUpdate || isScheduleUpdate)) {
      this.logger.debug(
        { message: "Either update all major fields or only the schedule", id },
        this.formatPlanServiceCtx("update")
      );
      return null;
    }

    // validate the major, year, concentration pair if either one is being update
    const major = this.majorService.findByMajorAndYear(
      newMajorName,
      newCatalogYear
    );

    if (!major) {
      this.logger.debug(
        {
          message: "Attempting to update a plan with an unsupported major.",
          newMajorName,
          newCatalogYear,
        },
        this.formatPlanServiceCtx("update")
      );

      return null;
    }

    const isValidConcentrationForMajor =
      this.majorService.isValidConcentrationForMajor(
        newMajorName,
        newCatalogYear,
        newConcentrationName
      );

    if (!isValidConcentrationForMajor) {
      this.logger.debug(
        {
          message:
            "Attempting to update a plan with an unsupported concentration.",
          newMajorName,
          newCatalogYear,
        },
        this.formatPlanServiceCtx("update")
      );

      return null;
    }

    /**
     * If schedule is not being updated, we use previous schedule or else we use
     * new schedule. This is needed cause we get schedule: undefined in the DTO
     * if schedule is not being updated. Hence, if we simply update the plan
     * with the DTO we override the schedule with undefined in the database,
     * essentially wiping it out.
     *
     * This should go away with TODO: https://github.com/sandboxnu/graduatenu/issues/533
     */
    let schedule = currentPlan.schedule;
    if (newSchedule) {
      schedule = newSchedule;
    }

    const newPlan = { ...updatePlanDto, schedule };
    const updateResult = await this.planRepository.update(id, newPlan);

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
