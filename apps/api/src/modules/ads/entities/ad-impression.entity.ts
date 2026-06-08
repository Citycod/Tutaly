import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('ad_impressions')
export class AdImpression {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  campaign_id: string; // FK -> ad_campaigns.id

  @Column()
  placement: string;

  @Column({ nullable: true })
  user_id: string; // null for guests

  @Column()
  device_type: string; // mobile | desktop | tablet

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  state: string;

  @Column({ type: 'timestamp' })
  viewed_at: Date;

  @CreateDateColumn()
  createdAt: Date;
}
