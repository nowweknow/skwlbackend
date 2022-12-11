import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Chat } from './chats.entity';
import { MarketPlace } from './marketplace.entity';
import { Message } from './messages.entity';
import { Notification } from './notifications.entity';
import { User_Followers } from './user_followers.entity';
import { Video } from './videos.entity';
import { Videos_Likes } from './videos_likes.entity';
import { UserDevice } from './user_device.entity';
import { NotificationSetting } from 'src/modules/entities/notification_setting.entity';

export enum plans_types {
  NON = 'non',
  BASE = 'base',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  user_id: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  second_name: string;

  @Column({ default: null })
  username: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: null })
  avatar: string;

  @Column({ default: null })
  header: string;

  @Column({ default: null })
  description: string;

  @Column({ default: null })
  website_link: string;

  @Column({ default: null })
  background_image: string;

  @Column({
    type: 'enum',
    enum: plans_types,
    default: null,
    nullable: true,
  })
  plan: plans_types.NON | plans_types.BASE | null;

  @CreateDateColumn({ default: null })
  plan_end_date: Date | null;

  @Column({
    default: false,
  })
  is_blocked: boolean;

  @OneToOne(() => NotificationSetting, (notificationSetting) => notificationSetting.user)
  notificationSetting: NotificationSetting;

  @OneToOne(() => UserDevice, (userDevice) => userDevice.user)
  userDevice: UserDevice;

  @OneToMany(() => Chat, (chat) => chat.creator)
  chatsCreater: Chat[];

  @OneToMany(() => Chat, (chat) => chat.companion)
  chatsCompanion: Chat[];

  @OneToMany(() => Message, (message) => message.author)
  messages: Message[]; // do we need it ?

  @OneToMany(() => Video, (video) => video.user)
  videos: Video[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => MarketPlace, (marketplace) => marketplace.user)
  marketplaces: MarketPlace[];

  @OneToMany(() => User_Followers, (user_followers) => user_followers.user)
  followers: User_Followers[];

  @OneToMany(() => User_Followers, (user_followers) => user_followers.follower)
  following: User_Followers[];

  @OneToMany(() => Videos_Likes, (videos_likes) => videos_likes.user)
  video_likes: Videos_Likes[];
}
