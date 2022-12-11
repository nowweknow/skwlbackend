import { Controller, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { NotificationSettingsService } from './notification-settings.service';
import { UpdateNotificationSettingDto } from './dto/update-notification-setting.dto';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.quard';
import { JwtPayload } from '../auth/jwt/jwt-auth.strategy';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('notification-settings')
@Controller('notification-settings')
export class NotificationSettingsController {
  constructor(private readonly notificationSettingsService: NotificationSettingsService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'The notification settings found successfully.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@GetUser() user: JwtPayload) {
    return this.notificationSettingsService.findOne(user.id);
  }

  @ApiResponse({ status: 200, description: 'The notification settings were updated successfully.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch()
  update(@GetUser() user: JwtPayload, @Body() updateNotificationSettingDto: UpdateNotificationSettingDto) {
    return this.notificationSettingsService.update(user.id, updateNotificationSettingDto);
  }
}
