import {MigrationInterface, QueryRunner} from "typeorm";

export class EmailConfirmation1678404621776 implements MigrationInterface {
    name = 'EmailConfirmation1678404621776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" ADD "isEmailConfirmed" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "isEmailConfirmed"`);
    }

}
