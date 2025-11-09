import { MigrationInterface, QueryRunner } from "typeorm";

export class addPlanShareEntity1759950553862 implements MigrationInterface {
  name = "addPlanShareEntity1759950553862";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "plan_share" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "planCode" character varying(5) NOT NULL, "planJson" json NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "expiresAt" TIMESTAMP NOT NULL, "revokedAt" TIMESTAMP, "studentUuid" uuid, CONSTRAINT "UQ_e3725e1918d4f5000fb9c261009" UNIQUE ("planCode"), CONSTRAINT "PK_aa404185ca33eb242b5dca81c94" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "plan_share" ADD CONSTRAINT "FK_eb3a62a0fde28fea61b9095400d" FOREIGN KEY ("studentUuid") REFERENCES "student"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "plan_share" DROP CONSTRAINT "FK_eb3a62a0fde28fea61b9095400d"`
    );
    await queryRunner.query(`DROP TABLE "plan_share"`);
  }
}
