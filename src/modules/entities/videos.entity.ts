import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './users.entity';
import { User_Followers } from './user_followers.entity';
import { Videos_Likes } from './videos_likes.entity';

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  link: string;

  @Column()
  title: string;

  @Column()
  product_title: string;

  @Column()
  product_image_link: string;

  @Column()
  product_link: string;

  @Column()
  price: string;

  @Column()
  hashtag: string;

  @Column({ default: false })
  isTranding: boolean;

  @Column({ default: 0 })
  likes: number;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  userId: number;
  @ManyToOne(() => User, (user) => user.videos)
  user: User;

  @OneToMany(() => Videos_Likes, (videos_likes) => videos_likes.video, { onDelete: 'CASCADE' })
  user_liked: Videos_Likes[];

  @OneToMany(() => User_Followers, (user_followers) => user_followers.follower)
  following: User_Followers[];
}
