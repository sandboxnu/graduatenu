import { Injectable } from "@nestjs/common";
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
}
