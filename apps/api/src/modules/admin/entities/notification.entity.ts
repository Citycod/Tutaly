import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum NotificationType {
  FOLLOW_REQUEST = 'follow_request',
  FOLLOW_ACCEPTED = 'follow_accepted',
  POST_LIKED = 'post_liked',
  POST_COMMENTED = 'post_commented',
  JOB_APPLICATION_STATUS = 'job_application_status',
  JOB_APPROVED = 'job_approved',
  ORDER_COMPLETED = 'order_completed',
  ORDER_DISPUTED = 'order_disputed',
  REVIEW_APPROVED = 'review_approved',
  SELLER_APPLICATION_DECISION = 'seller_application_decision',
  MESSAGE_RECEIVED = 'message_received',
  PLATFORM_ANNOUNCEMENT = 'platform_announcement',
  AD_CAMPAIGN_CREATED = 'ad_campaign_created',
  AD_UNDER_REVIEW = 'ad_under_review',
  AD_APPROVED = 'ad_approved',
  AD_REJECTED = 'ad_rejected',
  AD_BUDGET_50 = 'ad_budget_50',
  AD_BUDGET_80 = 'ad_budget_80',
  AD_BUDGET_EXHAUSTED = 'ad_budget_exhausted',
  AD_CAMPAIGN_ENDED = 'ad_campaign_ended',
  AD_REFUND_PROCESSED = 'ad_refund_processed',
  AD_WEEKLY_REPORT = 'ad_weekly_report',
}

@Entity('notifications')
@Index(['user', 'createdAt'])
@Index(['user', 'isRead'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column('enum', { enum: NotificationType })
  type: NotificationType;

  @Column('text')
  message: string;

  @Column('varchar', { nullable: true })
  link: string; // Relative URL to navigate to (e.g., /connect/posts/123)

  @Column('boolean', { default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
