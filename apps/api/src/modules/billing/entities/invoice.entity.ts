import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Subscription } from './subscription.entity';

export enum InvoiceStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

@Entity('invoices')
export class Invoice extends BaseEntity {
  @ManyToOne(() => Subscription, { onDelete: 'SET NULL', nullable: true })
  subscription: Subscription;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  employer: User;

  @Column({ unique: true })
  invoiceId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.PENDING,
  })
  status: InvoiceStatus;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ nullable: true })
  paymentRef: string;

  @Column({ nullable: true })
  downloadUrl: string;
}
