import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tag } from './tags.entity';
import { User } from './users.entity';

@Entity({ name: 'users_tags' })
export class Users_Tags {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('tinyint', { name: 'tag_id' })
  tagId: number;
  @ManyToOne(() => Tag, {
    cascade: true,
  })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;

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
