import { MigrationInterface, QueryRunner } from 'typeorm';

export class JourneyInvoiceRelation1713739130466 implements MigrationInterface {
  name = 'JourneyInvoiceRelation1713739130466';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_invoice" DROP CONSTRAINT "FK_bc720ebcf47103d4fd707d16e93"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invoice" DROP CONSTRAINT "FK_ce9dbc8307de98b23c169844f7d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bc720ebcf47103d4fd707d16e9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ce9dbc8307de98b23c169844f7"`,
    );
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "finished"`);
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "isFinished" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "isInJourney" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "invoice" ADD "journeyId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_62a2b002bd81c8912b20be6dcaf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" DROP CONSTRAINT "FK_d2c82c8bbf211f4b6f86f415024"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transition" DROP CONSTRAINT "FK_98aecd9c9f243623a312de6a2dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_d3bf6cfd98552eb4e9d8416472c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_2eeeb4120c5615944d49bd263a9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "place" DROP CONSTRAINT "PK_96ab91d43aa89c5de1b59ee7cca" CASCADE`,
    );
    await queryRunner.query(`ALTER TABLE "place" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "place" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "place" ADD CONSTRAINT "PK_96ab91d43aa89c5de1b59ee7cca" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "transition" DROP COLUMN "sourcePlaceId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transition" ADD "sourcePlaceId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "transition" DROP COLUMN "targetPlaceId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transition" ADD "targetPlaceId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_62a2b002bd81c8912b20be6dcaf"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "placeId"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "placeId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_62a2b002bd81c8912b20be6dcaf" UNIQUE ("placeId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP COLUMN "senderDepartmentId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "senderDepartmentId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP COLUMN "receiverDepartmentId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "receiverDepartmentId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP COLUMN "currentPlaceId"`,
    );
    await queryRunner.query(`ALTER TABLE "invoice" ADD "currentPlaceId" uuid`);
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "nextPlaceId"`);
    await queryRunner.query(`ALTER TABLE "invoice" ADD "nextPlaceId" uuid`);
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "sourceId"`);
    await queryRunner.query(`ALTER TABLE "event" ADD "sourceId" uuid`);
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "targetId"`);
    await queryRunner.query(`ALTER TABLE "event" ADD "targetId" uuid`);
    await queryRunner.query(
      `CREATE INDEX "IDX_bc720ebcf47103d4fd707d16e9" ON "user_invoice" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ce9dbc8307de98b23c169844f7" ON "user_invoice" ("invoiceId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "transition" ADD CONSTRAINT "FK_98aecd9c9f243623a312de6a2dd" FOREIGN KEY ("sourcePlaceId") REFERENCES "place"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transition" ADD CONSTRAINT "FK_721db3384b4d79e4ee6e568dba2" FOREIGN KEY ("targetPlaceId") REFERENCES "place"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_62a2b002bd81c8912b20be6dcaf" FOREIGN KEY ("placeId") REFERENCES "place"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_d3bf6cfd98552eb4e9d8416472c" FOREIGN KEY ("senderDepartmentId") REFERENCES "place"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_3de47f749f0be294b305a545ef3" FOREIGN KEY ("receiverDepartmentId") REFERENCES "place"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_2eeeb4120c5615944d49bd263a9" FOREIGN KEY ("currentPlaceId") REFERENCES "place"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_e0c7c4293213e9568eaf652f5fd" FOREIGN KEY ("nextPlaceId") REFERENCES "place"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_a0d9ff629c10c9f9379c746215a" FOREIGN KEY ("journeyId") REFERENCES "journey"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "FK_d2c82c8bbf211f4b6f86f415024" FOREIGN KEY ("sourceId") REFERENCES "place"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "FK_004b30690f3572b3366c7f12694" FOREIGN KEY ("targetId") REFERENCES "place"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "event" DROP CONSTRAINT "FK_004b30690f3572b3366c7f12694"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" DROP CONSTRAINT "FK_d2c82c8bbf211f4b6f86f415024"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_a0d9ff629c10c9f9379c746215a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_e0c7c4293213e9568eaf652f5fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_2eeeb4120c5615944d49bd263a9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_3de47f749f0be294b305a545ef3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_d3bf6cfd98552eb4e9d8416472c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_62a2b002bd81c8912b20be6dcaf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transition" DROP CONSTRAINT "FK_721db3384b4d79e4ee6e568dba2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transition" DROP CONSTRAINT "FK_98aecd9c9f243623a312de6a2dd"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ce9dbc8307de98b23c169844f7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bc720ebcf47103d4fd707d16e9"`,
    );
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "targetId"`);
    await queryRunner.query(`ALTER TABLE "event" ADD "targetId" integer`);
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "sourceId"`);
    await queryRunner.query(`ALTER TABLE "event" ADD "sourceId" integer`);
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "nextPlaceId"`);
    await queryRunner.query(`ALTER TABLE "invoice" ADD "nextPlaceId" integer`);
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP COLUMN "currentPlaceId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "currentPlaceId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP COLUMN "receiverDepartmentId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "receiverDepartmentId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP COLUMN "senderDepartmentId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "senderDepartmentId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_62a2b002bd81c8912b20be6dcaf"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "placeId"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "placeId" integer`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_62a2b002bd81c8912b20be6dcaf" UNIQUE ("placeId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "transition" DROP COLUMN "targetPlaceId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transition" ADD "targetPlaceId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "transition" DROP COLUMN "sourcePlaceId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transition" ADD "sourcePlaceId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "place" DROP CONSTRAINT "PK_96ab91d43aa89c5de1b59ee7cca"`,
    );
    await queryRunner.query(`ALTER TABLE "place" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "place" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "place" ADD CONSTRAINT "PK_96ab91d43aa89c5de1b59ee7cca" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_2eeeb4120c5615944d49bd263a9" FOREIGN KEY ("currentPlaceId") REFERENCES "place"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_d3bf6cfd98552eb4e9d8416472c" FOREIGN KEY ("senderDepartmentId") REFERENCES "place"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transition" ADD CONSTRAINT "FK_98aecd9c9f243623a312de6a2dd" FOREIGN KEY ("sourcePlaceId") REFERENCES "place"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "FK_d2c82c8bbf211f4b6f86f415024" FOREIGN KEY ("sourceId") REFERENCES "place"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_62a2b002bd81c8912b20be6dcaf" FOREIGN KEY ("placeId") REFERENCES "place"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "journeyId"`);
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "isInJourney"`);
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "isFinished"`);
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "finished" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ce9dbc8307de98b23c169844f7" ON "user_invoice" ("invoiceId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bc720ebcf47103d4fd707d16e9" ON "user_invoice" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invoice" ADD CONSTRAINT "FK_ce9dbc8307de98b23c169844f7d" FOREIGN KEY ("invoiceId") REFERENCES "invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invoice" ADD CONSTRAINT "FK_bc720ebcf47103d4fd707d16e93" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
