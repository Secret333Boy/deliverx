import { MigrationInterface, QueryRunner } from 'typeorm';

export class EventTimestampFix1701906133704 implements MigrationInterface {
  name = 'EventTimestampFix1701906133704';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."event_type_enum" RENAME TO "event_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."event_type_enum" AS ENUM('created', 'got', 'transitioned', 'given')`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" ALTER COLUMN "type" TYPE "public"."event_type_enum" USING "type"::"text"::"public"."event_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."event_type_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "event" ALTER COLUMN "time" SET DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event" ALTER COLUMN "time" SET DEFAULT '2023-12-06 19:45:23.324'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."event_type_enum_old" AS ENUM('0', '1', '2', '3')`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" ALTER COLUMN "type" TYPE "public"."event_type_enum_old" USING "type"::"text"::"public"."event_type_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."event_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."event_type_enum_old" RENAME TO "event_type_enum"`,
    );
  }
}
