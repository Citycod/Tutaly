import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { AdGoal, AdFormat, CampaignStatus, PaymentGateway } from '../enums/ads.enums';

@Entity('ad_campaigns')
export class AdCampaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  advertiser_id: string; // FK -> users.id

  @Column({ type: 'enum', enum: AdGoal })
  goal: AdGoal;

  @Column({ type: 'enum', enum: AdFormat })
  format: AdFormat;

  @Column({ nullable: true })
  job_id: string; // FK -> jobs.id

  @Column({ nullable: true })
  product_id: string; // FK -> shop_products.id

  @Column({ nullable: true })
  image_url: string;

  @Column()
  destination_url: string;

  @Column({ nullable: true })
  alt_text: string;

  @Column({ type: 'jsonb', nullable: true })
  target_countries: string[];

  @Column({ type: 'jsonb', nullable: true })
  target_states: string[];

  @Column({ type: 'jsonb', nullable: true })
  target_industries: string[];

  @Column({ type: 'jsonb', nullable: true })
  target_roles: string[];

  @Column({ type: 'jsonb', nullable: true })
  target_user_types: string[];

  @Column({ type: 'jsonb' })
  placements: string[];

  @Column()
  starts_at: Date;

  @Column({ nullable: true })
  ends_at: Date;

  @Column({ default: false })
  run_continuously: boolean;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  daily_budget: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total_budget: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total_spent: number;

  @Column({ default: 0 })
  impression_count: number;

  @Column({ default: 0 })
  click_count: number;

  @Column({ type: 'enum', enum: CampaignStatus, default: CampaignStatus.PENDING_PAYMENT })
  status: CampaignStatus;

  @Column({ nullable: true })
  rejection_reason: string;

  @Column({ nullable: true })
  reviewed_by: string; // FK -> users.id (admin)

  @Column({ nullable: true })
  payment_ref: string;

  @Column({ type: 'enum', enum: PaymentGateway, nullable: true })
  payment_gateway: PaymentGateway;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  notified_50: boolean;

  @Column({ default: false })
  notified_80: boolean;

  @Column({ default: false })
  notified_complete: boolean;
}
