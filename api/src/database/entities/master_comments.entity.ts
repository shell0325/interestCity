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
import { Bookmark } from './bookmarks.entity';
import { Channel } from './channels.entity';
import { Like } from './likes.entity';
import { User } from './users.entity';

@Entity({ name: 'master_comments' })
export class Master_Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { name: 'comment' })
  comment: Text[];

  @Column('varchar', { name: 'picture', length: 255, nullable: true })
  picture: string;

  @Column('varchar', { name: 'key', length: 255, nullable: true })
  key: string;

  @Column('varchar', { name: 'time', length: 255 })
  time: string;

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

  @OneToMany(() => Like, (likes) => likes.master_comment)
  likes: Like[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.master_comment)
  bookmark: Bookmark[];

  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  readonly updatedAt!: Date;
}
