import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBillingModule1783464171958 implements MigrationInterface {
  name = 'AddBillingModule1783464171958';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(
      `CREATE TYPE "public"."subscriptions_status_enum" AS ENUM('pending_payment', 'active', 'past_due', 'canceled')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."subscriptions_paymentgateway_enum" AS ENUM('flutterwave', 'paystack', 'stripe')`,
    );
    await queryRunner.query(
      `CREATE TABLE "subscriptions" ("id" uuid NOT NULL DEFAULT extensions.uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "planName" character varying NOT NULL, "status" "public"."subscriptions_status_enum" NOT NULL DEFAULT 'pending_payment', "price" numeric(10,2) NOT NULL, "currentPeriodStart" TIMESTAMP, "currentPeriodEnd" TIMESTAMP, "paymentGateway" "public"."subscriptions_paymentgateway_enum" NOT NULL DEFAULT 'flutterwave', "paymentRef" character varying, "autoRenew" boolean NOT NULL DEFAULT false, "employerId" uuid, CONSTRAINT "PK_subscriptions_id" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."invoices_status_enum" AS ENUM('pending', 'paid', 'failed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "invoices" ("id" uuid NOT NULL DEFAULT extensions.uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "invoiceId" character varying NOT NULL, "amount" numeric(10,2) NOT NULL, "status" "public"."invoices_status_enum" NOT NULL DEFAULT 'pending', "date" TIMESTAMP NOT NULL, "paymentRef" character varying, "downloadUrl" character varying, "subscriptionId" uuid, "employerId" uuid, CONSTRAINT "UQ_invoices_invoiceId" UNIQUE ("invoiceId"), CONSTRAINT "PK_invoices_id" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_subscriptions_employerId" FOREIGN KEY ("employerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" ADD CONSTRAINT "FK_invoices_subscriptionId" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" ADD CONSTRAINT "FK_invoices_employerId" FOREIGN KEY ("employerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoices" DROP CONSTRAINT "FK_invoices_employerId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" DROP CONSTRAINT "FK_invoices_subscriptionId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_subscriptions_employerId"`,
    );

    await queryRunner.query(`DROP TABLE "invoices"`);
    await queryRunner.query(`DROP TYPE "public"."invoices_status_enum"`);

    await queryRunner.query(`DROP TABLE "subscriptions"`);
    await queryRunner.query(
      `DROP TYPE "public"."subscriptions_paymentgateway_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."subscriptions_status_enum"`);
  }
}
