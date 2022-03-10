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
import { Sub_Comment } from './sub_comments.entity';
import { User } from './users.entity';

@Entity({ name: 'likes' })
export class Like {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('tinyint', { name: 'master_comment_id' })
  master_commentId: number;
  @ManyToOne(() => Master_Comment, {
    cascade: true,
  })
  @JoinColumn({ name: 'master_comment_id' })
  master_comment: Master_Comment;

  @Column('tinyint', { name: 'sub_comment_id', nullable: true })
  sub_commentId: number;
  @ManyToOne(() => Sub_Comment, {
    cascade: true,
  })
  @JoinColumn({ name: 'sub_comment_id' })
  sub_comment: Sub_Comment;

  @Column('tinyint', { name: 'user_id' })
  userId: number;
  @ManyToOne(() => User, {
    cascade: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  readonly updatedAt!: Date;
}
