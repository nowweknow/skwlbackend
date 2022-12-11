import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { User } from './users.entity';

export enum post_types {
  VIDEO = 'video',
  PRODUCT = 'product',
}

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  postId: number;

  @Column({ type: 'enum', enum: post_types })
  postType: post_types;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
