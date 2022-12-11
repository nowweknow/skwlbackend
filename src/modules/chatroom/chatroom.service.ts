import { Injectable } from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';
import { ChatsService } from '../chats/chats.service';
import { Chat } from '../entities/chats.entity';
import { Message } from '../entities/messages.entity';
@Injectable()
export class ChatroomService {
  constructor(private readonly messageService: MessagesService, private readonly chatroomService: ChatsService) {}

  async getChat(chatId: number): Promise<Chat> {
    return await this.chatroomService.getChatById(chatId);
  }

  async saveMessage(chatId: number, message: string, userId: number): Promise<Message> {
    return await this.messageService.createMessage({ chatId, message, userId });
  }
}
