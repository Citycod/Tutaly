import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCurrencyToAdCampaign1780965384995 implements MigrationInterface {
  name = 'AddCurrencyToAdCampaign1780965384995';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ad_campaigns" ADD "currency" character varying NOT NULL DEFAULT 'NGN'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ad_campaigns" DROP COLUMN "currency"`,
    );
  }
}
