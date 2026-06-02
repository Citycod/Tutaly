import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { PostComment } from './post-comment.entity';
import { PostLike } from './post-like.entity';
import { SavedPost } from './saved-post.entity';
import { Report } from './report.entity';

@Entity('posts')
@Index(['author', 'createdAt'])
@Index(['createdAt'])
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  author: User;

  @Column('text')
  content: string;

  @Column('varchar', { array: true, nullable: true })
  imageUrls?: string[] | null; // Multiple images from Supabase Storage

  @Column('integer', { default: 0 })
  likesCount: number;

  @Column('integer', { default: 0 })
  commentsCount: number;

  @Column('integer', { default: 0 })
  sharesCount: number;

  @OneToMany(() => PostComment, (comment) => comment.post, {
    cascade: ['remove'],
  })
  comments: PostComment[];

  @OneToMany(() => PostLike, (like) => like.post, { cascade: ['remove'] })
  likes: PostLike[];

  @OneToMany(() => SavedPost, (saved) => saved.post, { cascade: ['remove'] })
  savedBy: SavedPost[];

  @OneToMany(() => Report, (report) => report.post, { cascade: ['remove'] })
  reports: Report[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
