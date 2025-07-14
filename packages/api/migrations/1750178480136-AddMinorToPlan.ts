import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMinorToPlan1750178480136 implements MigrationInterface {
  name = "AddMinorToPlan1750178480136";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "plan" ADD "minor" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "minor"`);
  }
}
