import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Brackets, EntityRepository, Repository } from 'typeorm';
import { Chat } from '../entities/chats.entity';
import { SHOW_INBOX_ERROR } from './chat.constants';
import { SearchCathDto } from './chat.dto';

@EntityRepository(Chat)
export class ChatRepository extends Repository<Chat> {
  private logger = new Logger(ChatRepository.name);

  async getUserChat(userId: number): Promise<Chat[]> {
    try {
      return await this.createQueryBuilder('chat')
        .leftJoinAndSelect('chat.creator', 'creator')
        .leftJoinAndSelect('chat.companion', 'companion')
        .leftJoinAndSelect('companion.messages', 'messages')
        .leftJoinAndSelect('messages.chat', 'chating', 'chating.id=chat.id')
        .leftJoinAndSelect('creator.messages', 'message')
        .leftJoinAndSelect('message.chat', 'chated', 'chated.id=chat.id')
        .orderBy('message.created_at', 'DESC')
        .addOrderBy('messages.created_at', 'DESC')
        .where('creator.id = :id OR companion.id = :id', { id: userId })
        .getMany();
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message, SHOW_INBOX_ERROR);
    }
  }
  async searchChatByUser(userId: number, dto: SearchCathDto): Promise<any> {
    try {
      const { page, limit, search } = dto;

      return await this.createQueryBuilder('chat')
        .leftJoinAndSelect('chat.creator', 'creator')
        .leftJoinAndSelect('chat.companion', 'companion')
        .leftJoinAndSelect('companion.messages', 'messages')
        .leftJoinAndSelect('messages.chat', 'chating', 'chating.id=chat.id')
        .leftJoinAndSelect('creator.messages', 'message')
        .leftJoinAndSelect('message.chat', 'chated', 'chated.id=chat.id')
        .where('creator.id = :userId OR companion.id = :userId', { userId })
        .andWhere(
          new Brackets((qb) => {
            qb.where(`LOWER(creator.username) LIKE LOWER('%${search}%')`).orWhere(`LOWER(companion.username) LIKE LOWER('%${search}%')`);
          }),
        )
        .orderBy('chat.updated_at', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message, SHOW_INBOX_ERROR);
    }
  }

  async getChat(creatorId: number, companionId: number): Promise<Chat> {
    return await this.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.creator', 'creator')
      .leftJoinAndSelect('chat.companion', 'companion')
      .where('chat.creatorId = :creatorId AND chat.companionId = :companionId', { creatorId, companionId })
      .orWhere('chat.companionId = :creatorId AND chat.creatorId = :companionId', { creatorId, companionId })
      .getOne();
  }
}
