import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../entities/messages.entity';
import { MessageRepository } from './messages.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { SHOW_CHAT_MESSAGES_ERROR_TYPE } from './messages.constants';
import { NotificationService } from '../notification/notification.service';
import { notifications_types } from '../entities/notifications.entity';
import { ChatsService } from '../chats/chats.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageRepository)
    private readonly messageRepository: MessageRepository,
    private readonly notificationService: NotificationService,
    private readonly chatService: ChatsService,
  ) {}
  async getMessages(chatId: number): Promise<Message[]> {
    return await this.messageRepository.getMessages(chatId);
  }
  DEFAULT_MESSAGE = 'you have a new message';

  async createMessage(dto): Promise<Message> {
    try {
      const result = await this.messageRepository
        .createQueryBuilder()
        .insert()
        .into(Message)
        .values([
          {
            message: dto.message,
            author: dto.userId,
            chatId: dto.chatId,
          },
        ])
        .execute();
      await this.chatService.updateChatDate(dto.chatId);

      const newMessage = await this.messageRepository
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.author', 'author')
        .leftJoinAndSelect('message.chat', 'chat')
        .leftJoinAndSelect('chat.companion', 'companion')
        .leftJoinAndSelect('chat.creator', 'creator')
        .where('message.id = :id', { id: result.identifiers[0].id })
        .getOne();

      const sendedTo = newMessage.chat.companion.id === dto.userId ? newMessage.chat.creator : newMessage.chat.companion;

      await this.notificationService.createNotification({
        type: notifications_types.MESSAGE,
        eventId: result.identifiers[0].id,
        userId: sendedTo.id,
        message: dto.message,
        parentId: null,
      });
      return newMessage;
    } catch (err) {
      throw new InternalServerErrorException(err.message, SHOW_CHAT_MESSAGES_ERROR_TYPE);
    }
  }
}
