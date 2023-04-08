import {MigrationInterface, QueryRunner} from "typeorm";

export class OptionalMajorInPlan1680386712510 implements MigrationInterface {
    name = 'OptionalMajorInPlan1680386712510'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan" ALTER COLUMN "major" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plan" ALTER COLUMN "catalogYear" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan" ALTER COLUMN "catalogYear" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plan" ALTER COLUMN "major" SET NOT NULL`);
    }

}
