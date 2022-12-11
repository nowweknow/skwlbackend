import { Module } from '@nestjs/common';
import { NotificationSettingsService } from './notification-settings.service';
import { NotificationSettingsController } from './notification-settings.controller';
import { NotificationSetting } from '../entities/notification_setting.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [NotificationSettingsController],
  providers: [NotificationSettingsService],
  imports: [TypeOrmModule.forFeature([NotificationSetting])],
  exports: [NotificationSettingsService],
})
export class NotificationSettingsModule {}
