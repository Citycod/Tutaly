import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdsModuleUpdates1780959826062 implements MigrationInterface {
  name = 'AdsModuleUpdates1780959826062';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ad_clicks" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "campaign_id" character varying NOT NULL, "placement" character varying NOT NULL, "user_id" character varying, "clicked_at" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ea127bfe2c62aa27e28516268b4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ad_campaigns_goal_enum" AS ENUM('promote_business', 'promote_job', 'promote_product', 'promote_company')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ad_campaigns_format_enum" AS ENUM('banner', 'sidebar', 'sponsored_job', 'sponsored_product')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ad_campaigns_status_enum" AS ENUM('pending_payment', 'pending_review', 'active', 'paused', 'completed', 'rejected', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ad_campaigns_payment_gateway_enum" AS ENUM('flutterwave', 'paystack')`,
    );
    await queryRunner.query(
      `CREATE TABLE "ad_campaigns" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "advertiser_id" character varying NOT NULL, "goal" "public"."ad_campaigns_goal_enum" NOT NULL, "format" "public"."ad_campaigns_format_enum" NOT NULL, "job_id" character varying, "product_id" character varying, "image_url" character varying, "destination_url" character varying NOT NULL, "alt_text" character varying, "target_countries" jsonb, "target_states" jsonb, "target_industries" jsonb, "target_roles" jsonb, "target_user_types" jsonb, "placements" jsonb NOT NULL, "starts_at" TIMESTAMP NOT NULL, "ends_at" TIMESTAMP, "run_continuously" boolean NOT NULL DEFAULT false, "daily_budget" numeric(12,2) NOT NULL, "total_budget" numeric(12,2) NOT NULL, "total_spent" numeric(12,2) NOT NULL DEFAULT '0', "impression_count" integer NOT NULL DEFAULT '0', "click_count" integer NOT NULL DEFAULT '0', "status" "public"."ad_campaigns_status_enum" NOT NULL DEFAULT 'pending_payment', "rejection_reason" character varying, "reviewed_by" character varying, "payment_ref" character varying, "payment_gateway" "public"."ad_campaigns_payment_gateway_enum", "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "notified_50" boolean NOT NULL DEFAULT false, "notified_80" boolean NOT NULL DEFAULT false, "notified_complete" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_7877713eb87f782dd190eed85a7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ad_impressions" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "campaign_id" character varying NOT NULL, "placement" character varying NOT NULL, "user_id" character varying, "device_type" character varying NOT NULL, "country" character varying, "state" character varying, "viewed_at" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ad356010daa7d91573d88697097" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "ad_impressions"`);
    await queryRunner.query(`DROP TABLE "ad_campaigns"`);
    await queryRunner.query(
      `DROP TYPE "public"."ad_campaigns_payment_gateway_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."ad_campaigns_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."ad_campaigns_format_enum"`);
    await queryRunner.query(`DROP TYPE "public"."ad_campaigns_goal_enum"`);
    await queryRunner.query(`DROP TABLE "ad_clicks"`);
  }
}
