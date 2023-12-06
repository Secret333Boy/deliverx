import { MigrationInterface, QueryRunner } from 'typeorm';

export class InvoicePlace1699912327695 implements MigrationInterface {
  name = 'InvoicePlace1699912327695';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."place_type_enum" AS ENUM('0', '1')`,
    );
    await queryRunner.query(
      `CREATE TABLE "place" ("id" SERIAL NOT NULL, "type" "public"."place_type_enum" NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', "lon" integer NOT NULL, "lat" integer NOT NULL, CONSTRAINT "PK_96ab91d43aa89c5de1b59ee7cca" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "invoice" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "senderFullName" character varying NOT NULL, "receiverFullName" character varying NOT NULL, "receiverEmail" character varying NOT NULL, "fragile" boolean NOT NULL DEFAULT false, "senderDepartmentId" integer, "receiverDepartmentId" integer, CONSTRAINT "PK_15d25c200d9bcd8a33f698daf18" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_d3bf6cfd98552eb4e9d8416472c" FOREIGN KEY ("senderDepartmentId") REFERENCES "place"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_3de47f749f0be294b305a545ef3" FOREIGN KEY ("receiverDepartmentId") REFERENCES "place"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_3de47f749f0be294b305a545ef3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_d3bf6cfd98552eb4e9d8416472c"`,
    );
    await queryRunner.query(`DROP TABLE "invoice"`);
    await queryRunner.query(`DROP TABLE "place"`);
    await queryRunner.query(`DROP TYPE "public"."place_type_enum"`);
  }
}
