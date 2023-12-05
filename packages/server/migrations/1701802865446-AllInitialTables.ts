import { MigrationInterface, QueryRunner } from 'typeorm';

export class AllInitialTables1701802865446 implements MigrationInterface {
  name = 'AllInitialTables1701802865446';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transition" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cost" integer NOT NULL, "sourcePlaceId" integer, "targetPlaceId" integer, CONSTRAINT "PK_bb9daff96e2e8586928b5757e4e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "vehicle" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "driverId" uuid, CONSTRAINT "REL_cbb46518af7f7bf832253c62e0" UNIQUE ("driverId"), CONSTRAINT "PK_187fa17ba39d367e5604b3d1ec9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "journey" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startTime" TIMESTAMP NOT NULL, "vehicleId" uuid, "transitionId" uuid, CONSTRAINT "PK_0dfc23b6e61590ef493cf3adcde" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."event_type_enum" AS ENUM('0', '1', '2', '3')`,
    );
    await queryRunner.query(
      `CREATE TABLE "event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."event_type_enum" NOT NULL, "time" TIMESTAMP NOT NULL DEFAULT '"2023-12-05T19:01:06.531Z"', "invoiceId" uuid, "transitionId" uuid, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "journey_invoices_invoice" ("journeyId" uuid NOT NULL, "invoiceId" uuid NOT NULL, CONSTRAINT "PK_114ec6ff2617f862c487f15f7bb" PRIMARY KEY ("journeyId", "invoiceId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c1bb1a2bf8033e2fd0e6046390" ON "journey_invoices_invoice" ("journeyId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_52748e921799a687bc2d72c103" ON "journey_invoices_invoice" ("invoiceId") `,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "placeId" integer`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_62a2b002bd81c8912b20be6dcaf" UNIQUE ("placeId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_62a2b002bd81c8912b20be6dcaf" FOREIGN KEY ("placeId") REFERENCES "place"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transition" ADD CONSTRAINT "FK_98aecd9c9f243623a312de6a2dd" FOREIGN KEY ("sourcePlaceId") REFERENCES "place"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transition" ADD CONSTRAINT "FK_721db3384b4d79e4ee6e568dba2" FOREIGN KEY ("targetPlaceId") REFERENCES "place"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicle" ADD CONSTRAINT "FK_cbb46518af7f7bf832253c62e08" FOREIGN KEY ("driverId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "journey" ADD CONSTRAINT "FK_5a79342a89f120522c5d16949a8" FOREIGN KEY ("vehicleId") REFERENCES "vehicle"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "journey" ADD CONSTRAINT "FK_712aaa80fe2ea09c4ebe71f0c7d" FOREIGN KEY ("transitionId") REFERENCES "transition"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "FK_1384d8d40e6623d68d308b24a33" FOREIGN KEY ("invoiceId") REFERENCES "invoice"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "FK_371d70f0b60c965131094519a2d" FOREIGN KEY ("transitionId") REFERENCES "transition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "journey_invoices_invoice" ADD CONSTRAINT "FK_c1bb1a2bf8033e2fd0e60463908" FOREIGN KEY ("journeyId") REFERENCES "journey"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "journey_invoices_invoice" ADD CONSTRAINT "FK_52748e921799a687bc2d72c103b" FOREIGN KEY ("invoiceId") REFERENCES "invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "journey_invoices_invoice" DROP CONSTRAINT "FK_52748e921799a687bc2d72c103b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "journey_invoices_invoice" DROP CONSTRAINT "FK_c1bb1a2bf8033e2fd0e60463908"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" DROP CONSTRAINT "FK_371d70f0b60c965131094519a2d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" DROP CONSTRAINT "FK_1384d8d40e6623d68d308b24a33"`,
    );
    await queryRunner.query(
      `ALTER TABLE "journey" DROP CONSTRAINT "FK_712aaa80fe2ea09c4ebe71f0c7d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "journey" DROP CONSTRAINT "FK_5a79342a89f120522c5d16949a8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vehicle" DROP CONSTRAINT "FK_cbb46518af7f7bf832253c62e08"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transition" DROP CONSTRAINT "FK_721db3384b4d79e4ee6e568dba2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transition" DROP CONSTRAINT "FK_98aecd9c9f243623a312de6a2dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_62a2b002bd81c8912b20be6dcaf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_62a2b002bd81c8912b20be6dcaf"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "placeId"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_52748e921799a687bc2d72c103"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c1bb1a2bf8033e2fd0e6046390"`,
    );
    await queryRunner.query(`DROP TABLE "journey_invoices_invoice"`);
    await queryRunner.query(`DROP TABLE "event"`);
    await queryRunner.query(`DROP TYPE "public"."event_type_enum"`);
    await queryRunner.query(`DROP TABLE "journey"`);
    await queryRunner.query(`DROP TABLE "vehicle"`);
    await queryRunner.query(`DROP TABLE "transition"`);
  }
}
