import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException, NotFoundException, Logger } from '@nestjs/common';
import { CreateNotificationDto } from './notificationDto';
import { LIMIT } from './constants';
import { notifications_types, Notification } from '../entities/notifications.entity';
@EntityRepository(Notification)
export class NotificationRepository extends Repository<Notification> {
  private logger = new Logger(Notification.name);

  async createNotification({ userId, type, message, eventId, parentId }: CreateNotificationDto): Promise<Notification> {
    try {
      const newNotification = this.create({
        type,
        message,
        userId,
        eventId,
        parentId,
        isActive: true,
      });
      await this.save(newNotification);
      return newNotification;
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(e.message);
    }
  }

  async getNotificationByUserId(userId: number, notificationSettings: string[], page: number): Promise<Notification[]> {
    try {
      const options = {
        limit: LIMIT,
        page: LIMIT * (page - 1),
      };
      const results = await this.createQueryBuilder('notification')
        .leftJoinAndSelect('notification.user', 'user')
        .leftJoinAndSelect('user.followers', 'followers', 'followers.followerId = :userId', { userId })
        .leftJoinAndSelect('user.videos', 'videos')
        .leftJoinAndSelect('videos.user_liked', 'user_liked', 'user_liked.id = notification.eventId')
        .leftJoinAndSelect('followers.follower', 'following')
        .leftJoinAndSelect('notification.parent', 'parent')
        .leftJoinAndSelect('parent.user', 'parentUser')
        .where('notification.type in (:...notificationSettings)', { notificationSettings })
        .orderBy('notification.createdAt', 'DESC')
        .skip(options.page)
        .take(options.limit)
        .getMany();

      const newResults = results.map((result) => {
        let newResult;
        if (result.type === 'likes') {
          for (const video of result.user.videos) {
            if (video.user_liked.length) {
              const likeCount = video.likes;
              newResult = { ...result, likeCount };
            }
          }
        }
        if (newResult) {
          return newResult;
        } else {
          return result;
        }
      });

      return newResults;
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message);
    }
  }

  async getNotificationByType(type: notifications_types): Promise<Notification> {
    return await this.createQueryBuilder('notification').where('notification.type = :type', { type }).orderBy('notification.createdAt', 'DESC').getOne();
  }
}
