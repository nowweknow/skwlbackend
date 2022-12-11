import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './users.entity';
import { Video } from './videos.entity';

@Entity()
export class Saved_Videos {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ApiProperty()
  @ManyToOne(() => Video, (video) => video.id)
  video: Video;
}
