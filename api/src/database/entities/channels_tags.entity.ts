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
import { Genre } from './genres.entity';
import { Tag } from './tags.entity';

@Entity({ name: 'channels_tags' })
export class Channels_Tags {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('tinyint', { name: 'tag_id' })
  tagId: number;
  @ManyToOne(() => Tag, {
    cascade: true,
  })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;

  @Column('tinyint', { name: 'channel_id' })
  channelId: number;
  @ManyToOne(() => Channel, {
    cascade: true,
  })
  @JoinColumn({ name: 'channel_id' })
  channel: Channel;

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
