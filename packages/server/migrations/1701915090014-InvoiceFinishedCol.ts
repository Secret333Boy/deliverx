import { MigrationInterface, QueryRunner } from 'typeorm';

export class InvoiceFinishedCol1701915090014 implements MigrationInterface {
  name = 'InvoiceFinishedCol1701915090014';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "finished" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "finished"`);
  }
}
