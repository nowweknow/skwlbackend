import { Injectable } from '@nestjs/common';
import { UpdateNotificationSettingDto } from './dto/update-notification-setting.dto';
import { NotificationSetting } from '../entities/notification_setting.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NotificationSettingsService {
  constructor(
    @InjectRepository(NotificationSetting)
    private readonly notificationSettingRopository: Repository<NotificationSetting>,
  ) {}

  async findOne(userId) {
    let result;
    result = await this.notificationSettingRopository.findOne({ user: userId });
    if (!result) {
      result = await this.notificationSettingRopository.save({ user: userId });
    } else {
      result.user = userId;
    }
    return result;
  }

  async update(userId, updateNotificationSettingDto: UpdateNotificationSettingDto) {
    let result;

    try {
      result = await this.notificationSettingRopository.findOne({ user: userId });
      if (!result) {
        result = await this.notificationSettingRopository.save({ ...updateNotificationSettingDto, user: userId });
      } else {
        result = await this.notificationSettingRopository.update(result.id, updateNotificationSettingDto);
        result = { ...updateNotificationSettingDto, userId };
      }
    } catch (err) {
      throw new Error("id doesn't exists");
    }
    return result;
  }
}
