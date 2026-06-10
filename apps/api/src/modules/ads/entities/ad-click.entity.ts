import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('ad_clicks')
export class AdClick {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  campaign_id: string; // FK -> ad_campaigns.id

  @Column()
  placement: string;

  @Column({ nullable: true })
  user_id: string;

  @Column({ type: 'timestamp' })
  clicked_at: Date;

  @CreateDateColumn()
  createdAt: Date;
}
