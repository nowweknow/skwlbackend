import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../entities/notifications.entity';
import { NotificationService } from './notification.service';
import { NotificationRepository } from './notification.repository';
import { NotificationController } from './notification.controller';
import { UserDevice } from '../entities/user_device.entity';
import { UserDeviceModule } from '../user-device/user-device.module';
import { NotificationSetting } from '../entities/notification_setting.entity';
import { NotificationSettingsModule } from '../notification-settings/notification-settings.module';
@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
  imports: [NotificationSettingsModule, UserDeviceModule, TypeOrmModule.forFeature([Notification,  NotificationRepository, UserDevice, NotificationSetting])],
})
export class NotificationModule {}
