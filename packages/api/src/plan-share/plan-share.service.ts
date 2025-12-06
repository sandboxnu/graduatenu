import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PlanShare } from "./entities/plan-share.entity";
import { Student } from "../student/entities/student.entity";
import { generateCode } from "../utils/generate-code";

type CreateShareInput = {
  studentUuid: string;
  planJson: any;
  // default in 14 days
  expiresInDays?: number;
};

@Injectable()
export class PlanShareService {
  constructor(
    @InjectRepository(PlanShare) private readonly shares: Repository<PlanShare>,
    @InjectRepository(Student) private readonly students: Repository<Student>
  ) {}

  // gets the correct url for sharing
  private getSharingUrl() {
    return process.env.SHARE_BASE_URL || "https://graduatenu.com/share";
  }

  // tells us if the db error is caused by a duplicate
  private isDuplicateError(e: any) {
    return String(e?.code || "").includes("duplicate");
  }

  // Helper function to compare two plan JSONs (ignoring metadata like createdAt, updatedAt, student)
  private arePlansEqual(plan1: any, plan2: any): boolean {
    if (!plan1 || !plan2) return false;

    // Normalize the plans by removing metadata fields that don't affect the plan content
    const normalizePlan = (plan: any) => {
      const {
        createdAt: _createdAt,
        updatedAt: _updatedAt,
        student: _student,
        ...rest
      } = plan;
      // Sort keys for consistent comparison
      const sorted = Object.keys(rest)
        .sort()
        .reduce((acc, key) => {
          acc[key] = rest[key];
          return acc;
        }, {} as any);
      return JSON.stringify(sorted);
    };
    return normalizePlan(plan1) === normalizePlan(plan2);
  }

  // creates a plan share and saves it
  async createShare({
    studentUuid,
    planJson,
    expiresInDays = 14,
  }: CreateShareInput): Promise<{
    planCode: string;
    url: string;
    expiresAt: string;
  }> {
    const student = await this.students.findOneOrFail({ uuid: studentUuid });
    const planId = planJson?.id;

    // Check if there's an existing active share for this plan
    if (planId) {
      const existingShares = await this.shares.find({
        where: {
          student: { uuid: studentUuid },
        },
        relations: ["student"],
      });

      // Find an active share for this plan that hasn't been modified
      const activeShare = existingShares.find(
        (share) =>
          share.planJson?.id === planId &&
          !share.revokedAt &&
          share.expiresAt > new Date() &&
          this.arePlansEqual(share.planJson, planJson)
      );

      if (activeShare) {
        // Return the existing share code
        const shareLink = this.getSharingUrl();
        return {
          planCode: activeShare.planCode,
          url: `${shareLink}/${activeShare.planCode}`,
          expiresAt: activeShare.expiresAt.toISOString(),
        };
      }
    }

    // No existing active share found, create a new one
    const expiresAt = new Date(
      Date.now() + expiresInDays * 24 * 60 * 60 * 1000
    );

    // generate a code and save it
    // allowing retries for the slim chance that codes are dupes
    for (let tries = 0; tries < 10; tries++) {
      const planCode = generateCode(5).toUpperCase();
      try {
        const share = this.shares.create({
          planCode,
          planJson,
          expiresAt,
          student,
        });
        await this.shares.save(share);

        const shareLink = this.getSharingUrl();
        return {
          planCode,
          url: `${shareLink}/${planCode}`,
          expiresAt: share.expiresAt.toISOString(),
        };
      } catch (e: any) {
        // if the code is a dupe, try again
        if (this.isDuplicateError(e)) continue;
        throw e;
      }
    }
    throw new Error("Unable to share plan. Please try again.");
  }

  async getSharedPlan(code: string) {
    const share = await this.shares.findOne({
      where: { planCode: code.toUpperCase() },
      relations: ["student"],
    });

    //no plan found
    if (!share) {
      throw new Error("plan code not found");
    }

    //expired
    if (share.revokedAt) {
      throw new Error("plan code has been revoked");
    }

    return {
      planJson: share.planJson,
      createdAt: share.createdAt,
      expiresAt: share.expiresAt,
    };
  }

  async importSharedPlan(studentUuid: string, code: string) {
    const plan = await this.getSharedPlan(code);

    return {
      success: true,
      planJson: plan.planJson,
      message: "plan imported",
    };
  }

  async deletePlanCode(studentUuid: string, code: string) {
    const share = await this.shares.findOne({
      where: { planCode: code.toUpperCase() },
      relations: ["student"],
    });

    //no plan found
    if (!share) {
      throw new NotFoundException("plan code not found");
    }

    //student can only delete their own plan
    if (share.student.uuid !== studentUuid) {
      throw new ForbiddenException(
        "you do not have permission to delete this shared plan"
      );
    }

    //revokedAt
    share.revokedAt = new Date();
    await this.shares.save(share);

    return {
      success: true,
      message: "share link revoked",
    };
  }
}
