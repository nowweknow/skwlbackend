import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity, OneToMany, UpdateDateColumn } from 'typeorm';
import { User } from './users.entity';
import { Message } from './messages.entity';

@Entity()
export class Chat extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.chatsCreater, { nullable: false })
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @ManyToOne(() => User, (user) => user.chatsCompanion, { nullable: false })
  @JoinColumn({ name: 'companionId' })
  companion: User;

  @OneToMany(() => Message, (message) => message.chat, { nullable: false })
  messages: Message[];

  @UpdateDateColumn()
  updated_at: Date;
}
