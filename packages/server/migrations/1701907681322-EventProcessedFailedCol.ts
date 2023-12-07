import { MigrationInterface, QueryRunner } from 'typeorm';

export class EventProcessedFailedCol1701907681322
  implements MigrationInterface
{
  name = 'EventProcessedFailedCol1701907681322';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event" ADD "processed" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" ADD "failed" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "failed"`);
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "processed"`);
  }
}
