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
import { Channels_Tags } from './channels_tags.entity';
import { Genre } from './genres.entity';
import { Users_Channels } from './users_channels.entity';

@Entity({ name: 'channels' })
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'name', length: 45 })
  name: string;

  @Column('varchar', { name: 'explanation', length: 255, nullable: true })
  explanation: string;

  @Column('tinyint', { name: 'genre_id' })
  genreId: number;
  @ManyToOne(() => Genre, {
    cascade: true,
  })
  @JoinColumn({ name: 'genre_id' })
  genre: Genre;

  @OneToMany(() => Users_Channels, (usersChannels) => usersChannels.channel)
  user: Users_Channels[];

  @OneToMany(() => Channels_Tags, (channelsTags) => channelsTags.channel)
  tag: Channels_Tags[];

  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  readonly updatedAt!: Date;
}
