import { Entity, Column, ManyToOne, OneToMany, Unique, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';

@Entity('posts')
export class Post extends BaseEntity {
  @ManyToOne(() => User)
  author: User;

  @Column('text')
  content: string;

  @Column({ type: 'varchar', array: true, nullable: true })
  imageUrls: string[] | null; // Multiple image URLs from Supabase

  @Column({ default: 0 })
  likesCount: number;

  @Column({ default: 0 })
  commentsCount: number;

  @Column({ default: 0 })
  sharesCount: number;

  @OneToMany(() => PostComment, (comment) => comment.post)
  comments: PostComment[];

  @OneToMany(() => PostLike, (like) => like.post)
  likes: PostLike[];

  @OneToMany(() => PostSave, (save) => save.post)
  savedBy: PostSave[];
}

@Entity('post_likes')
@Unique(['post', 'user'])
export class PostLike extends BaseEntity {
  @ManyToOne(() => Post)
  post: Post;

  @ManyToOne(() => User)
  user: User;
}

@Entity('post_comments')
export class PostComment extends BaseEntity {
  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  @ManyToOne(() => User)
  author: User;

  @Column('text')
  body: string;
}

export enum FollowStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity('follows')
@Unique(['follower', 'followee'])
export class Follow extends BaseEntity {
  @ManyToOne(() => User)
  follower: User;

  @ManyToOne(() => User)
  followee: User;

  @Column({ type: 'enum', enum: FollowStatus, default: FollowStatus.PENDING })
  status: FollowStatus;
}

@Entity('messages')
export class Message extends BaseEntity {
  @ManyToOne(() => User)
  @Index()
  sender: User;

  @ManyToOne(() => User)
  @Index()
  receiver: User;

  @Column('text')
  body: string;

  @Column({ type: 'timestamp', nullable: true })
  readAt: Date;
}

@Entity('post_saves')
@Unique(['user', 'post'])
export class PostSave extends BaseEntity {
  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Post, (post) => post.savedBy)
  post: Post;
}

@Entity('post_shares')
export class PostShare extends BaseEntity {
  @ManyToOne(() => Post)
  originalPost: Post;

  @ManyToOne(() => User)
  sharedBy: User;

  @Column({
    type: 'enum',
    enum: ['feed', 'whatsapp', 'twitter'],
    default: 'feed',
  })
  shareType: 'feed' | 'whatsapp' | 'twitter';
}

export enum ReportTargetType {
  POST = 'post',
  REVIEW = 'review',
  JOB = 'job',
  USER = 'user',
}

@Entity('reports')
export class Report extends BaseEntity {
  @ManyToOne(() => User)
  reporter: User;

  @Column({ type: 'enum', enum: ReportTargetType })
  targetType: ReportTargetType;

  @Column({ type: 'uuid' })
  targetId: string;

  @Column('text')
  reason: string;
}
