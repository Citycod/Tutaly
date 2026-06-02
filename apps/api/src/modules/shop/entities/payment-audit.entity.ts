import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Order } from './order.entity';

/**
 * Payment Transaction Audit Log
 * Records all payment attempts for auditing and debugging
 */
@Entity('payment_transaction_audit')
export class PaymentTransactionAudit extends BaseEntity {
  @ManyToOne(() => Order, { onDelete: 'RESTRICT' })
  @JoinColumn()
  order: Order;

  @Column({ type: 'varchar' })
  gateway: string; // flutterwave, paystack, etc.

  @Column({ type: 'varchar', unique: false })
  reference: string; // Payment reference from gateway

  @Column({ type: 'varchar' })
  status: string; // initiated, pending, successful, failed, refunded

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar' })
  currency: string;

  @Column({ type: 'varchar', nullable: true })
  customerEmail: string;

  @Column({ type: 'jsonb', nullable: true })
  gatewayResponse: Record<string, any>; // Full response for debugging

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @Column({ type: 'varchar', nullable: true })
  idempotencyKey: string; // For preventing duplicates
}
