import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from './users.entity';
import { Video } from './videos.entity';

@Entity()
export class Videos_Likes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  userId: number;
  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column({ nullable: false })
  videoId: number;
  @ManyToOne(() => Video, (video) => video.user_liked, { onDelete: 'CASCADE' })
  video: Video;
}
