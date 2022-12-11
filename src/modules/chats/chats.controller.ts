import { Controller, Get, UseGuards, Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.quard';
import { JwtPayload } from '../auth/jwt/jwt-auth.strategy';
import { Chat } from '../entities/chats.entity';
import { SHOW_USERS_INBOX_SUCCESS } from './chat.constants';
import { ChatsService } from './chats.service';
import { CreateChatBodyDto, SearchCathDto } from './chat.dto';

@ApiTags('chats')
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @ApiResponse({
    status: 200,
    description: SHOW_USERS_INBOX_SUCCESS,
    type: Chat,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  getUserChat(@GetUser() user: JwtPayload) {
    return this.chatsService.getUserChat(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/search')
  searchChatByUser(@GetUser() user: JwtPayload, @Body() body: SearchCathDto): Promise<Chat[]> {
    return this.chatsService.searchChatByUser(user.id, body);
  }

  @ApiResponse({
    status: 200,
    description: 'Create a chat for the user',
    type: Chat,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  createUserChat(@GetUser() user: JwtPayload, @Body() dto: CreateChatBodyDto): Promise<Chat | object> {
    const obj = { ...dto, userId: user.id };
    return this.chatsService.createUserChat(obj);
  }
}
