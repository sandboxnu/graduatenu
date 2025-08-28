import { MigrationInterface, QueryRunner } from "typeorm";

export class ReplaceStudentMajorWithMajorsArray1756349431153
  implements MigrationInterface
{
  name = "ReplaceStudentMajorWithMajorsArray1756349431153";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student" RENAME COLUMN "major" TO "majors"`
    );
    await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "majors"`);
    await queryRunner.query(`ALTER TABLE "student" ADD "majors" text array`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "majors"`);
    await queryRunner.query(
      `ALTER TABLE "student" ADD "majors" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "student" RENAME COLUMN "majors" TO "major"`
    );
  }
}
