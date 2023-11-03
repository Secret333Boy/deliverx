import { MigrationInterface, QueryRunner } from 'typeorm';

export class TokenStore1698986474310 implements MigrationInterface {
  name = 'TokenStore1698986474310';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
  }
}
