import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserTokenStore1699459991747 implements MigrationInterface {
  name = 'UserTokenStore1699459991747';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('0', '1', '2', '3', '4')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "hash" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "token_store" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "userId" uuid, CONSTRAINT "REL_e2e69cfe83dec8e6695f79649f" UNIQUE ("userId"), CONSTRAINT "PK_ee1b257926f457b8f334871dc4c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "token_store" ADD CONSTRAINT "FK_e2e69cfe83dec8e6695f79649f6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "token_store" DROP CONSTRAINT "FK_e2e69cfe83dec8e6695f79649f6"`,
    );
    await queryRunner.query(`DROP TABLE "token_store"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(`CREATE EXTENSION "uuid-ossp"`);
  }
}
