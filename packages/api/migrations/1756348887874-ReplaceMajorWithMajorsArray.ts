import { MigrationInterface, QueryRunner } from "typeorm";

export class ReplaceMajorWithMajorsArray1756348887874
  implements MigrationInterface
{
  name = "ReplaceMajorWithMajorsArray1756348887874";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "plan" RENAME COLUMN "major" TO "majors"`
    );
    await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "majors"`);
    await queryRunner.query(`ALTER TABLE "plan" ADD "majors" text array`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "majors"`);
    await queryRunner.query(
      `ALTER TABLE "plan" ADD "majors" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "plan" RENAME COLUMN "majors" TO "major"`
    );
  }
}
