import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';

export enum SubscriptionStatus {
  PENDING_PAYMENT = 'pending_payment',
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
}

export enum PaymentGateway {
  FLUTTERWAVE = 'flutterwave',
  PAYSTACK = 'paystack',
  STRIPE = 'stripe',
}

@Entity('subscriptions')
export class Subscription extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  employer: User;

  @Column()
  planName: string;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.PENDING_PAYMENT,
  })
  status: SubscriptionStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'timestamp', nullable: true })
  currentPeriodStart: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  currentPeriodEnd: Date | null;

  @Column({
    type: 'enum',
    enum: PaymentGateway,
    default: PaymentGateway.FLUTTERWAVE,
  })
  paymentGateway: PaymentGateway;

  @Column({ nullable: true })
  paymentRef: string;

  @Column({ default: false })
  autoRenew: boolean;
}
