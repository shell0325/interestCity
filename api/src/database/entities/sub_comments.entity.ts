import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Master_Comment } from './master_comments.entity';
import { User } from './users.entity';

@Entity({ name: 'sub_comments' })
export class Sub_Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text', { name: 'comment' })
  comment: Text[];

  @Column('tinyint', { name: 'user_id' })
  userId: number;
  @ManyToOne(() => User, {
    cascade: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('tinyint', { name: 'master_comment_id' })
  master_commentId: number;
  @ManyToOne(() => Master_Comment, {
    cascade: true,
  })
  @JoinColumn({ name: 'channel_id' })
  master_comment: Master_Comment;

  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  readonly updatedAt!: Date;
}
