import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Chat } from '../entities/chats.entity';

export class CreateMessageDto {
  @ApiProperty({
    description: 'chatId',
    example: 2,
    required: true,
    type: Chat,
  })
  @IsNotEmpty()
  readonly chatId: Chat;

  @ApiProperty({
    description: 'message',
    example: 'Hello',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  message: string;
}
