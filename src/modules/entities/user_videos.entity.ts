import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './users.entity';
import { Video } from './videos.entity';

@Entity()
export class User_Videos {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  user: User;

  @ManyToOne(() => Video, (video) => video.id, { nullable: false })
  video: Video;
}
