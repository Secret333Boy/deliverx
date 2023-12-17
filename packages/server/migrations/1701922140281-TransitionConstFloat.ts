import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransitionConstFloat1701922140281 implements MigrationInterface {
  name = 'TransitionConstFloat1701922140281';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transition" DROP COLUMN "cost"`);
    await queryRunner.query(
      `ALTER TABLE "transition" ADD "cost" double precision NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transition" DROP COLUMN "cost"`);
    await queryRunner.query(
      `ALTER TABLE "transition" ADD "cost" integer NOT NULL`,
    );
  }
}
