import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePaymentTransactionAuditTable1746228000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'payment_transaction_audit',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'orderId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'gateway',
            type: 'varchar',
            isNullable: false,
            comment: 'flutterwave, paystack, etc.',
          },
          {
            name: 'reference',
            type: 'varchar',
            isNullable: false,
            comment: 'Payment reference from gateway',
          },
          {
            name: 'status',
            type: 'varchar',
            isNullable: false,
            comment: 'initiated, pending, successful, failed, refunded, etc.',
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'currency',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'customerEmail',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'gatewayResponse',
            type: 'jsonb',
            isNullable: true,
            comment: 'Full response from payment gateway for debugging',
          },
          {
            name: 'errorMessage',
            type: 'text',
            isNullable: true,
            comment: 'Error details if transaction failed',
          },
          {
            name: 'idempotencyKey',
            type: 'varchar',
            isNullable: true,
            comment: 'For preventing duplicate processing',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        indices: [
          {
            name: 'idx_payment_audit_order',
            columnNames: ['orderId'],
          },
          {
            name: 'idx_payment_audit_reference',
            columnNames: ['reference'],
          },
          {
            name: 'idx_payment_audit_gateway',
            columnNames: ['gateway'],
          },
          {
            name: 'idx_payment_audit_status',
            columnNames: ['status'],
          },
          {
            name: 'idx_payment_audit_created',
            columnNames: ['createdAt'],
          },
        ],
        foreignKeys: [
          {
            columnNames: ['orderId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'orders',
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('payment_transaction_audit');
  }
}
