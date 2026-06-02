import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Index,
  Unique,
} from 'typeorm';
import { Post } from './post.entity';
import { User } from '../../user/entities/user.entity';

@Entity('saved_posts')
@Unique(['user', 'post'])
@Index(['user', 'createdAt'])
export class SavedPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Post, (post) => post.savedBy, { onDelete: 'CASCADE' })
  post: Post;

  @CreateDateColumn()
  createdAt: Date;
}
