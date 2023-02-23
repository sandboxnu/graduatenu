import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1675976227120 implements MigrationInterface {
  name = "InitialMigration1675976227120";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "student" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "nuid" character varying, "fullName" character varying, "isOnboarded" boolean NOT NULL DEFAULT false, "email" character varying NOT NULL, "password" character varying NOT NULL, "academicYear" smallint, "graduateYear" smallint, "catalogYear" smallint, "major" character varying, "coopCycle" character varying, "coursesCompleted" json, "coursesTransfered" json, "primaryPlanId" integer, "concentration" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(), CONSTRAINT "UQ_a56c051c91dbe1068ad683f536e" UNIQUE ("email"), CONSTRAINT "PK_e11fbd60aaa3196597d36f2bbfb" PRIMARY KEY ("uuid"))`
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "plan" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "schedule" json NOT NULL, "major" character varying NOT NULL, "concentration" character varying, "catalogYear" smallint NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "studentUuid" uuid, CONSTRAINT "PK_54a2b686aed3b637654bf7ddbb3" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "plan" DROP CONSTRAINT IF EXISTS "FK_d45229c252c6776e9f4a58502b0"; ALTER TABLE "plan" ADD CONSTRAINT IF NOT EXISTS "FK_d45229c252c6776e9f4a58502b0" FOREIGN KEY ("studentUuid") REFERENCES "student"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "plan" DROP CONSTRAINT "FK_d45229c252c6776e9f4a58502b0"`
    );
    await queryRunner.query(`DROP TABLE "plan"`);
    await queryRunner.query(`DROP TABLE "student"`);
  }
}
