import { MigrationInterface, QueryRunner } from 'typeorm';

export class InvoiceCurrentPlace1701891922195 implements MigrationInterface {
  name = 'InvoiceCurrentPlace1701891922195';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "currentPlaceId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" ALTER COLUMN "time" SET DEFAULT '"2023-12-06T19:45:23.324Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_2eeeb4120c5615944d49bd263a9" FOREIGN KEY ("currentPlaceId") REFERENCES "place"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_2eeeb4120c5615944d49bd263a9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" ALTER COLUMN "time" SET DEFAULT '2023-12-05 19:01:06.531'`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP COLUMN "currentPlaceId"`,
    );
  }
}
