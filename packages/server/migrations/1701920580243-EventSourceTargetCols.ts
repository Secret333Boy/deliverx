import { MigrationInterface, QueryRunner } from 'typeorm';

export class EventSourceTargetCols1701920580243 implements MigrationInterface {
  name = 'EventSourceTargetCols1701920580243';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event" DROP CONSTRAINT "FK_371d70f0b60c965131094519a2d"`,
    );
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "transitionId"`);
    await queryRunner.query(`ALTER TABLE "event" ADD "sourceId" integer`);
    await queryRunner.query(`ALTER TABLE "event" ADD "targetId" integer`);
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "FK_d2c82c8bbf211f4b6f86f415024" FOREIGN KEY ("sourceId") REFERENCES "place"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "FK_004b30690f3572b3366c7f12694" FOREIGN KEY ("targetId") REFERENCES "place"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event" DROP CONSTRAINT "FK_004b30690f3572b3366c7f12694"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" DROP CONSTRAINT "FK_d2c82c8bbf211f4b6f86f415024"`,
    );
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "targetId"`);
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "sourceId"`);
    await queryRunner.query(`ALTER TABLE "event" ADD "transitionId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "FK_371d70f0b60c965131094519a2d" FOREIGN KEY ("transitionId") REFERENCES "transition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
