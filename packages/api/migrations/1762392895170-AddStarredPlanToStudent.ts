import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStarredPlanToStudent1762392895170
  implements MigrationInterface
{
  name = "AddStarredPlanToStudent1762392895170";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "student" ADD "starredPlan" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "starredPlan"`);
  }
}
