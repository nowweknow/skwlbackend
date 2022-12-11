import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../entities/messages.entity';
import { MessagesController } from './messages.controller';
import { MessageRepository } from './messages.repository';
import { MessagesService } from './messages.service';
import { Notification } from '../entities/notifications.entity';
import { NotificationModule } from '../notification/notification.module';
import { ChatsModule } from '../chats/chats.module';
import { Chat } from '../entities/chats.entity';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
  imports: [NotificationModule, ChatsModule, TypeOrmModule.forFeature([Message,  MessageRepository, Notification, Chat])],
})
export class MessagesModule { }
