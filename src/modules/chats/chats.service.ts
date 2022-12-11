import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from '../entities/chats.entity';
import { ChatRepository } from './chats.repository';
import { UsersService } from '../users/users.service';
import { SearchCathDto } from './chat.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatRepository)
    private readonly chatRepository: ChatRepository,
    private readonly userService: UsersService,
  ) {}

  async updateChatDate(chatId: number): Promise<any> {
    return await this.chatRepository.createQueryBuilder().update(Chat).set({}).where({ id: chatId }).execute();
  }

  async getUserChat(userId: number): Promise<Chat[]> {
    return await this.chatRepository.getUserChat(userId);
  }

  async searchChatByUser(userId: number, dto: SearchCathDto): Promise<Chat[]> {
    return await this.chatRepository.searchChatByUser(userId, dto);
  }

  async createUserChat(dto): Promise<Chat | object> {
    const { companionId, userId } = dto;
    if (userId === companionId) {
      return new BadRequestException('You cannot chat with yourself');
    }
    const ifExists = await this.chatRepository.getChat(userId, companionId);
    if (ifExists) {
      return ifExists;
    }

    const chat = {
      creator: userId,
      companion: companionId,
    };
    await this.chatRepository.createQueryBuilder().insert().into(Chat).values([chat]).execute();
    return chat;
  }

  async getChatById(id: number): Promise<Chat> {
    return await this.chatRepository
      .createQueryBuilder('chat')
      .leftJoin('chat.creator', 'creator')
      .leftJoin('chat.companion', 'companion')
      .select(['chat.id', 'creator.id', 'companion.id'])
      .where('chat.id = :id', { id })
      .getOne();
  }
}
