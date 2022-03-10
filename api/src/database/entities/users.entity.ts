import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { name: 'username', length: 20 })
  username!: string;

  @Column('varchar', { name: 'email', length: 45 })
  email!: string;

  @Column('varchar', { name: 'password', length: 100 })
  password: string;

  @Column('varchar', { name: 'self_introduction', length: 255, nullable: true })
  self_introduction: string;

  @Column('varchar', { name: 'profileImage', nullable: true })
  profileImagePath: string;

  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  readonly updatedAt!: Date;
}
