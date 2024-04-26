import { MigrationInterface, QueryRunner } from 'typeorm';

export class JourneyStartedAt1713763044734 implements MigrationInterface {
  name = 'JourneyStartedAt1713763044734';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_invoice" DROP CONSTRAINT "FK_ce9dbc8307de98b23c169844f7d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invoice" DROP CONSTRAINT "FK_bc720ebcf47103d4fd707d16e93"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bc720ebcf47103d4fd707d16e9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ce9dbc8307de98b23c169844f7"`,
    );
    await queryRunner.query(`ALTER TABLE "journey" ADD "startedAt" TIMESTAMP`);
    await queryRunner.query(
      `CREATE INDEX "IDX_bc720ebcf47103d4fd707d16e9" ON "user_invoice" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ce9dbc8307de98b23c169844f7" ON "user_invoice" ("invoiceId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invoice" ADD CONSTRAINT "FK_bc720ebcf47103d4fd707d16e93" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invoice" ADD CONSTRAINT "FK_ce9dbc8307de98b23c169844f7d" FOREIGN KEY ("invoiceId") REFERENCES "invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_invoice" DROP CONSTRAINT "FK_ce9dbc8307de98b23c169844f7d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invoice" DROP CONSTRAINT "FK_bc720ebcf47103d4fd707d16e93"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ce9dbc8307de98b23c169844f7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bc720ebcf47103d4fd707d16e9"`,
    );
    await queryRunner.query(`ALTER TABLE "journey" DROP COLUMN "startedAt"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_ce9dbc8307de98b23c169844f7" ON "user_invoice" ("invoiceId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bc720ebcf47103d4fd707d16e9" ON "user_invoice" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invoice" ADD CONSTRAINT "FK_bc720ebcf47103d4fd707d16e93" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invoice" ADD CONSTRAINT "FK_ce9dbc8307de98b23c169844f7d" FOREIGN KEY ("invoiceId") REFERENCES "invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
