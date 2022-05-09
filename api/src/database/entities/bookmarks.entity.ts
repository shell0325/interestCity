import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Genre } from './genres.entity';
import { Master_Comment } from './master_comments.entity';
import { Sub_Comment } from './sub_comments.entity';
import { User } from './users.entity';

@Entity({ name: 'bookmarks' })
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('tinyint', { name: 'master_comment_id', nullable: true })
  master_commentId: number;
  @ManyToOne(() => Master_Comment, {
    cascade: true,
  })
  @JoinColumn({ name: 'master_comment_id' })
  master_comment: Master_Comment;

  @Column('tinyint', { name: 'thread_comment_id', nullable: true })
  thread_commentId: number;
  @ManyToOne(() => Sub_Comment, {
    cascade: true,
  })
  @JoinColumn({ name: 'thread_comment_id' })
  Sub_Comment: Sub_Comment;

  @Column('tinyint', { name: 'user_id' })
  userId: number;
  @ManyToOne(() => User, {
    cascade: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('tinyint', { name: 'genre_id' })
  genreId: number;
  @ManyToOne(() => Genre, {
    cascade: true,
  })
  @JoinColumn({ name: 'genre_id' })
  genre: Genre;

  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  readonly updatedAt!: Date;
}
