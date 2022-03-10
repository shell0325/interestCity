import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Genre } from './genres.entity';

@Entity({ name: 'channels' })
export class Channel {
  @PrimaryGeneratedColumn()
  id!: number;

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

  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  readonly updatedAt!: Date;
}
