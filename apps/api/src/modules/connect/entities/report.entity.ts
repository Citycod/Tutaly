import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Post } from './post.entity';
import { User } from '../../user/entities/user.entity';

export enum ReportStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  RESOLVED = 'resolved',
}

export enum ReportReason {
  INAPPROPRIATE = 'inappropriate',
  SPAM = 'spam',
  HARASSMENT = 'harassment',
  MISINFORMATION = 'misinformation',
  COPYRIGHT = 'copyright',
  OTHER = 'other',
}

@Entity('reports')
@Index(['post', 'status'])
@Index(['status', 'createdAt'])
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Post, (post) => post.reports, { onDelete: 'CASCADE' })
  post: Post;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  reporter: User;

  @Column('enum', { enum: ReportReason })
  reason: ReportReason;

  @Column('text', { nullable: true })
  description?: string;

  @Column('enum', { enum: ReportStatus, default: ReportStatus.PENDING })
  status: ReportStatus;

  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamp', { nullable: true })
  reviewedAt?: Date;

  @Column('uuid', { nullable: true })
  reviewedBy?: string; // Admin user ID
}
