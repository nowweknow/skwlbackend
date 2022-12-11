import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification, notifications_types } from '../entities/notifications.entity';
import { NotificationRepository } from './notification.repository';
import { CreateNotificationDto } from './notificationDto';
import {
  NOTIFICATION_DELETE_ERROR,
  NOTIFICATION_DELETE_ERROR_TYPE,
  SET_IN_ACTIVE_NOTIFICATION_ERROR,
  SET_IN_ACTIVE_NOTIFICATION_ERROR_TYPE,
  UPDATE_NOTIFICATION_ERROR,
  UPDATE_NOTIFICATION_ERROR_TYPE,
} from './constants';
import { UserDeviceService } from '../user-device/user-device.service';
import { NotificationSettingsService } from '../notification-settings/notification-settings.service';
import * as FCM from 'fcm-node';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationRepository)
    private readonly notificationRepository: NotificationRepository,
    private readonly userDeviceService: UserDeviceService,
    private readonly notificationSettingsService: NotificationSettingsService,
  ) {}
  async createNotification(body: CreateNotificationDto): Promise<Notification> {
    try {
      const notification = await this.notificationRepository.createNotification(body);
      const device = await this.userDeviceService.findByUserId(body.userId);

      const serverKey = process.env.FCM_KEY;
      const fcm = new FCM(serverKey);
      const message: any = {
        to: device.token,

        notification: {
          title: 'SKWL',
          body: notification.message,
        },
      };
      if (device.brand !== 'Apple') {
        message.collapse_key = process.env.COLLAPSE_KEY;
      }
      await fcm.send(message, function (err, response) {
        if (err) {
          console.log("couldn't send push notification");
        }
      });

      return notification;
    } catch (err) {
      throw new InternalServerErrorException('create notification error');
    }
  }

  async getNotificationByUserWithPagination(userId: number, page: number): Promise<Notification[]> {
    try {
      const notificationSettings = await this.notificationSettingsService.findOne(userId);
      const options = [];
      for (const setting in notificationSettings) {
        if (notificationSettings[setting] === true) {
          options.push(setting);
        }
      }
      await this.notificationRepository.createQueryBuilder('notification').update(Notification).set({ isActive: false }).execute();
      return await this.notificationRepository.getNotificationByUserId(userId, options, page);
    } catch (err) {
      throw new InternalServerErrorException('get notification error');
    }
  }

  async getLastTypeNotification(type: notifications_types): Promise<Notification> {
    return this.notificationRepository.getNotificationByType(type);
  }

  async deleteNotificationById(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne(id);
    return this.notificationRepository.remove(notification);
  }

  async deleteNotificationByTypeAndEventId(type: notifications_types, eventId: number): Promise<Notification> {
    try {
      const notification = await this.notificationRepository.findOne({ type, eventId });
      return await this.notificationRepository.remove(notification);
    } catch (err) {
      throw new InternalServerErrorException(NOTIFICATION_DELETE_ERROR, NOTIFICATION_DELETE_ERROR_TYPE);
    }
  }

  async updateNotification(body: CreateNotificationDto): Promise<Notification> {
    try {
      const notification = await this.notificationRepository.findOne({ type: body.type, eventId: body.eventId });
      return this.notificationRepository.save({ ...notification, ...body });
    } catch (err) {
      throw new InternalServerErrorException(UPDATE_NOTIFICATION_ERROR, UPDATE_NOTIFICATION_ERROR_TYPE);
    }
  }

  async getNotificationCount(): Promise<number> {
    try {
      return await this.notificationRepository.createQueryBuilder('notification').where('notification.isActive = true').getCount();
    } catch (err) {
      throw new InternalServerErrorException(SET_IN_ACTIVE_NOTIFICATION_ERROR, SET_IN_ACTIVE_NOTIFICATION_ERROR_TYPE);
    }
  }
}
