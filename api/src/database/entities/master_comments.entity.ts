import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Channel } from './channels.entity';
import { User } from './users.entity';

@Entity({ name: 'master_comments' })
export class Master_Comment {
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

  @Column('tinyint', { name: 'channel_id' })
  channelId: number;
  @ManyToOne(() => Channel, {
    cascade: true,
  })
  @JoinColumn({ name: 'channel_id' })
  channel: Channel;

  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  readonly updatedAt!: Date;
}
