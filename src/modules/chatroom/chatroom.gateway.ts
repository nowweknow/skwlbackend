import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { InternalServerErrorException } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { JwtAuthService } from '../auth/jwt/jwt-auth.service';
@WebSocketGateway()
export class ChatroomGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatroomService: ChatroomService, private readonly jwtAuthService: JwtAuthService) {}

  @SubscribeMessage('sendMessage')
  async chat(@MessageBody() messageBody, @ConnectedSocket() client: Socket) {
    const user = await this.jwtAuthService.verifyUser(client.handshake.headers.authorization);
    const message = await this.chatroomService.saveMessage(messageBody.chatId, messageBody.message, user.id);
    this.server.to(messageBody.chatId).emit('sendMessage', message);
  }

  @SubscribeMessage('createChatroom')
  async create(@MessageBody('chatId') chatId, @ConnectedSocket() client: Socket) {
    try {
      const user = await this.jwtAuthService.verifyUser(client.handshake.headers.authorization);
      if (!user) {
        client.emit('createChatroom', 'you are not logged in');
      }

      const getChat = await this.chatroomService.getChat(chatId);

      if (!getChat) {
        client.emit('createChatroom', 'chat not found');
        throw new InternalServerErrorException('chat not found');
      }
      if (getChat.creator.id !== user.id && getChat.companion.id !== user.id) {
        client.emit('createChatroom', 'you are not allowed to join this chat');
        throw new InternalServerErrorException('you are not allowed to join this chat');
      }
      if (getChat) {
        client.join(chatId);
        client.emit('createChatroom', `added to chatroom ${chatId}`);
      }
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }

  @SubscribeMessage('leaveChatroom')
  leave(@MessageBody() leaveChatroom, @ConnectedSocket() client: Socket) {
    try {
      if (leaveChatroom?.chatId) {
        client.leave(leaveChatroom.chatId);
        client.emit('createChatroom', `left the chatroom ${leaveChatroom.chatId}`);
      }
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }
}
