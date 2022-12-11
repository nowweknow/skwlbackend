import { Body, Controller, Get, UseGuards, Post, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.quard';
import { JwtPayload } from '../auth/jwt/jwt-auth.strategy';
import { Message } from '../entities/messages.entity';
import { SHOW_CHAT_MESSAGES_SUCCESS, SHOW_CREATE_MESSAGES_SUCCESS } from './messages.constants';
import { CreateMessageDto } from './messages.dto';
import { MessagesService } from './messages.service';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}
  @ApiResponse({
    status: 200,
    description: SHOW_CHAT_MESSAGES_SUCCESS,
    type: Message,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('chat/:chatId')
  getUserChat(@GetUser() user: JwtPayload, @Param('chatId') chatId: number): Promise<Message[]> {
    return this.messageService.getMessages(chatId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('chat/:chatId')
  createMessage(@GetUser() user: JwtPayload, @Param('chatId') chatId: number, @Body() dto: CreateMessageDto): Promise<Message> {
    const obj = { ...dto, userId: user.id, chatId };
    return this.messageService.createMessage(obj);
  }
}
