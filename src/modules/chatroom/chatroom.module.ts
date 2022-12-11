import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomGateway } from './chatroom.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../entities/messages.entity';
import { MessagesModule } from '../messages/messages.module';
import { ChatsModule } from '../chats/chats.module';
import { Chat } from '../entities/chats.entity';
import { JwtAuthModule } from '../auth/jwt/jwt-auth.module';
@Module({
  providers: [ChatroomGateway, ChatroomService],
  imports: [MessagesModule, JwtAuthModule, ChatsModule, TypeOrmModule.forFeature([Message, Chat])],
})
export class ChatroomModule {}
