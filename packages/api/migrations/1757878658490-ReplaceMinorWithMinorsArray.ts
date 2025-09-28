import { MigrationInterface, QueryRunner } from "typeorm";

export class ReplaceMinorWithMinorsArray1757878658490
  implements MigrationInterface
{
  name = "ReplaceMinorWithMinorsArray1757878658490";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student" RENAME COLUMN "minor" TO "minors"`
    );
    await queryRunner.query(
      `ALTER TABLE "plan" RENAME COLUMN "minor" TO "minors"`
    );
    await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "minors"`);
    await queryRunner.query(`ALTER TABLE "student" ADD "minors" text array`);
    await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "minors"`);
    await queryRunner.query(`ALTER TABLE "plan" ADD "minors" text array`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "minors"`);
    await queryRunner.query(
      `ALTER TABLE "plan" ADD "minors" character varying`
    );
    await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "minors"`);
    await queryRunner.query(
      `ALTER TABLE "student" ADD "minors" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "plan" RENAME COLUMN "minors" TO "minor"`
    );
    await queryRunner.query(
      `ALTER TABLE "student" RENAME COLUMN "minors" TO "minor"`
    );
  }
}
