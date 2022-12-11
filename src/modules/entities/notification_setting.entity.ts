import { Entity, Column, OneToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { User } from './users.entity';

@Entity()
export class NotificationSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.notificationSetting)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ default: true, nullable: false })
  following: boolean;

  @Column({ default: true, nullable: false })
  message: boolean;

  @Column({ default: true, nullable: false })
  likes: boolean;
}
