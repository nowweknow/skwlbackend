import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './users.entity';

@Entity()
export class User_Followers {
  @PrimaryGeneratedColumn()
  id: number;

  userId: number;
  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, (user) => user.followers, { nullable: false })
  user: User;

  followerId: number;
  @JoinColumn({ name: 'followerId' })
  @ManyToOne(() => User, (user) => user.following, { nullable: false })
  follower: User;
}
