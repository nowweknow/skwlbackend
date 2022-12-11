import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Message } from '../entities/messages.entity';
import { SHOW_CHAT_MESSAGES_ERROR_TYPE } from './messages.constants';

@EntityRepository(Message)
export class MessageRepository extends Repository<Message> {
  private logger = new Logger(MessageRepository.name);

  async getMessages(chatId: number): Promise<Message[]> {
    try {
      return await this.createQueryBuilder('messages').leftJoinAndSelect('messages.author', 'author').where('messages.chatId = :chatId', { chatId }).orderBy('messages.created_at', 'DESC').getMany();
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message, SHOW_CHAT_MESSAGES_ERROR_TYPE);
    }
  }
}
