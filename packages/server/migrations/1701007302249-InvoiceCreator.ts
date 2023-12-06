import { MigrationInterface, QueryRunner } from 'typeorm';

export class InvoiceCreator1701007302249 implements MigrationInterface {
  name = 'InvoiceCreator1701007302249';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoice" ADD "creatorId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_ceac56c4cba5ed9ecb1451e778d" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_ceac56c4cba5ed9ecb1451e778d"`,
    );
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "creatorId"`);
  }
}
