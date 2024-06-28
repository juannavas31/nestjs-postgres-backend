import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1719431397612 implements MigrationInterface {
  name = 'Migration1719431397612';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "resource" ("id" uuid NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "address" character varying NOT NULL, "profileId" uuid, CONSTRAINT "UQ_ec610f776c296c1ba39b4972848" UNIQUE ("address"), CONSTRAINT "PK_e2894a5867e06ae2e8889f1173f" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE TABLE "profile" ("id" uuid NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "role" character varying NOT NULL, "emailAddress" character varying NOT NULL, "companyName" character varying NOT NULL, CONSTRAINT "UQ_aa1fcbea67d34f74a27b98973d6" UNIQUE ("emailAddress"), CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))');
    await queryRunner.query('ALTER TABLE "resource" ADD CONSTRAINT "FK_f2d7064c05029c9af5f09680421" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "resource" DROP CONSTRAINT "FK_f2d7064c05029c9af5f09680421"');
    await queryRunner.query('DROP TABLE "profile"');
    await queryRunner.query('DROP TABLE "resource"');
  }
}
