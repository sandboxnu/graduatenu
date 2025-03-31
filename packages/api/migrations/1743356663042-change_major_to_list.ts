import { MigrationInterface, QueryRunner } from "typeorm";

export class changeMajorToList1743356663042 implements MigrationInterface {
  name = "changeMajorToList1743356663042";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "plan" ADD "majors" json`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "majors"`);
  }
}
