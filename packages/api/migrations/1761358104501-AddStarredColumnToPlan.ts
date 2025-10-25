import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStarredColumnToPlan1761358104501 implements MigrationInterface {
  name = "AddStarredColumnToPlan1761358104501";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "plan" ADD "starred" boolean NOT NULL DEFAULT false`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "starred"`);
  }
}
