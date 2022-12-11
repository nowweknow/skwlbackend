import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from '../entities/chats.entity';
import { ChatsController } from './chats.controller';
import { ChatRepository } from './chats.repository';
import { ChatsService } from './chats.service';
import { User } from '../entities/users.entity';
import { UsersModule } from '../users/users.module';
@Module({
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService],
  imports: [UsersModule, TypeOrmModule.forFeature([Chat,  ChatRepository, User])],
})
export class ChatsModule {}
