import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from './users.entity';

export enum notifications_types {
  FOLLOWING = 'following',
  MESSAGE = 'message',
  LIKES = 'likes',
  COMMENTS = 'comments',
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: notifications_types,
  })
  type: notifications_types;

  @Column()
  message: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  userId: number;
  @ManyToOne(() => User, (user) => user.notifications)
  user: User;

  @Column()
  eventId: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  parentId: number | null;
  @ManyToOne(() => Notification, (notification) => notification.children)
  parent: Notification;

  @OneToMany(() => Notification, (notification) => notification.parent)
  children: Notification[];
}
