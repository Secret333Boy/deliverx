import { MigrationInterface, QueryRunner } from 'typeorm';

export class InvoiceNextPlace1702827566180 implements MigrationInterface {
  name = 'InvoiceNextPlace1702827566180';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoice" ADD "nextPlaceId" integer`);
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_e0c7c4293213e9568eaf652f5fd" FOREIGN KEY ("nextPlaceId") REFERENCES "place"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_e0c7c4293213e9568eaf652f5fd"`,
    );
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "nextPlaceId"`);
  }
}
