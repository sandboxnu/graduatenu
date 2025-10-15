import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PlanShare } from "./entities/plan-share.entity";
import { Plan } from "../plan/entities/plan.entity";
import { Student } from "../student/entities/student.entity";

@Injectable()
export class PlanShareService {
  constructor(
    @InjectRepository(PlanShare)
    private planShareRepository: Repository<PlanShare>,
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>
  ) {}

  async getPlanByCode(planCode: string): Promise<PlanShare> {
    const planShare = await this.planShareRepository.findOne({
      where: { planCode },
      relations: ["student"],
    });

    if (!planShare) {
      throw new NotFoundException("Plan not found");
    }

    const now = new Date();
    if (planShare.expiresAt < now || planShare.revokedAt) {
      throw new NotFoundException("Plan share has expired or been revoked");
    }

    return planShare;
  }

  async importPlanByCode(planCode: string, student: Student): Promise<Plan> {
    const planShare = await this.getPlanByCode(planCode);

    const newPlan = this.planRepository.create({
      name: `${planShare.planJson.name} (Imported)`,
      schedule: planShare.planJson.schedule,
      major: planShare.planJson.major,
      minor: planShare.planJson.minor,
      concentration: planShare.planJson.concentration,
      catalogYear: planShare.planJson.catalogYear,
      student,
    });

    const savedPlan = await this.planRepository.save(newPlan);

    // Fetch the plan with student relation to match GetPlanResponse type
    return this.planRepository.findOne({
      where: { id: savedPlan.id },
      relations: ["student"],
    });
  }

  async deleteShareCode(planCode: string, student: Student): Promise<void> {
    const planShare = await this.planShareRepository.findOne({
      where: { planCode, student: { uuid: student.uuid } },
    });

    if (!planShare) {
      throw new NotFoundException(
        "Plan share not found or does not belong to student"
      );
    }

    planShare.revokedAt = new Date();
    await this.planShareRepository.save(planShare);
  }
}
