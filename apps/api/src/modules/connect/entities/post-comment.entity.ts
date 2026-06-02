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

@Entity('post_comments')
@Index(['post', 'createdAt'])
export class PostComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  post: Post;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  author: User;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamp', { nullable: true })
  updatedAt: Date;
}
