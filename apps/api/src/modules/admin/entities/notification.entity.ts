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
