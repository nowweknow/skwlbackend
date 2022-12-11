import { Controller, Param, Patch, UseGuards, Body, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.quard';
import { Notification } from '../entities/notifications.entity';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { JwtPayload } from '../auth/jwt/jwt-auth.strategy';

@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiResponse({
    status: 200,
    description: 'Get notification count',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/get-notification-count')
  getNotificationCount(): Promise<number> {
    return this.notificationService.getNotificationCount();
  }

  @ApiResponse({
    status: 200,
    description: 'Got notification',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/:pageId')
  getNotification(@GetUser() user: JwtPayload, @Param('pageId') pageId: number): Promise<Notification[]> {
    return this.notificationService.getNotificationByUserWithPagination(user.id, pageId);
  }
}
