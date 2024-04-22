import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransitionUniquePlaces1713744390906 implements MigrationInterface {
  name = 'TransitionUniquePlaces1713744390906';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transition" DROP CONSTRAINT "FK_721db3384b4d79e4ee6e568dba2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transition" DROP CONSTRAINT "FK_98aecd9c9f243623a312de6a2dd"`,
    );
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
    await queryRunner.query(
      `ALTER TABLE "transition" ALTER COLUMN "sourcePlaceId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transition" ALTER COLUMN "targetPlaceId" SET NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bc720ebcf47103d4fd707d16e9" ON "user_invoice" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ce9dbc8307de98b23c169844f7" ON "user_invoice" ("invoiceId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "transition" ADD CONSTRAINT "UQ_ecb8961b2b6cc9386c39aeb7342" UNIQUE ("sourcePlaceId", "targetPlaceId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "transition" ADD CONSTRAINT "FK_98aecd9c9f243623a312de6a2dd" FOREIGN KEY ("sourcePlaceId") REFERENCES "place"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "transition" ADD CONSTRAINT "FK_721db3384b4d79e4ee6e568dba2" FOREIGN KEY ("targetPlaceId") REFERENCES "place"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
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
      `ALTER TABLE "transition" DROP CONSTRAINT "FK_721db3384b4d79e4ee6e568dba2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transition" DROP CONSTRAINT "FK_98aecd9c9f243623a312de6a2dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transition" DROP CONSTRAINT "UQ_ecb8961b2b6cc9386c39aeb7342"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ce9dbc8307de98b23c169844f7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bc720ebcf47103d4fd707d16e9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transition" ALTER COLUMN "targetPlaceId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transition" ALTER COLUMN "sourcePlaceId" DROP NOT NULL`,
    );
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
    await queryRunner.query(
      `ALTER TABLE "transition" ADD CONSTRAINT "FK_98aecd9c9f243623a312de6a2dd" FOREIGN KEY ("sourcePlaceId") REFERENCES "place"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transition" ADD CONSTRAINT "FK_721db3384b4d79e4ee6e568dba2" FOREIGN KEY ("targetPlaceId") REFERENCES "place"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
