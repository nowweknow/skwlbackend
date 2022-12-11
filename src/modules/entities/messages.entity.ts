import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Chat } from './chats.entity';
import { User } from './users.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @CreateDateColumn({ type: Date })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  chatId: number;
  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;
}
