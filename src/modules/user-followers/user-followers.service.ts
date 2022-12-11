import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User_Followers } from 'src/modules/entities/user_followers.entity';
import { FollowersVideoDto, SubscribeDto } from './user-followers.dto';
import { CREATE_SUBSCRIBE_ERROR_TYPE, DELETE_SUBSCRIBE_ERROR_TYPE, GET_FOLLOWERS_ERROR_TYPE, SUBSCRIBE_NOT_FOUND_ERROR } from '../../user-followers/constants';
import { notifications_types } from '../entities/notifications.entity';
import { NotificationService } from '../notification/notification.service';
import { Subscription } from '../entities/subscription.entity';
@Injectable()
export class UserFollowersService {
  private readonly logger = new Logger(UserFollowersService.name);

  constructor(
    private readonly notificationService: NotificationService,
    @InjectRepository(User_Followers)
    private userFollowersRepository: Repository<User_Followers>,
  ) {}

  DEFAULT_MESSAGE = 'followed you';

  async getFollowersUserList(userId: number): Promise<FollowersVideoDto[]> {
    try {
      const followersVideo = await this.userFollowersRepository
        .createQueryBuilder('user_followers')
        .leftJoinAndSelect('user_followers.user', 'user')
        .select(['user.id as userId', 'user.first_name as first_name', 'user.second_name as user_second_name', 'user.email as email', 'user.avatar as avatar'])
        .where('user_followers.followerId=:followerId', { followerId: userId })
        .getRawMany();

      return followersVideo;
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message, GET_FOLLOWERS_ERROR_TYPE);
    }
  }

  async setSubscribe(dto): Promise<{
    isFollowed: boolean;
  }> {
    const { userId, followerId } = dto;
    try {
      const check = await this.findSubscribeUser(dto);

      if (!check) {
        const subscription = await this.createdSubscribe(dto);
        await this.notificationService.createNotification({
          type: notifications_types.FOLLOWING,
          userId: dto.userId,
          message: this.DEFAULT_MESSAGE,
          eventId: subscription.id,
          parentId: null,
        });
        return await this.findSubscribeUser(dto);
      }

      await this.deleteSubscribe(userId, followerId);
      await this.notificationService.deleteNotificationByTypeAndEventId(notifications_types.FOLLOWING, check.id);
      check.id = null;
      return check;
    } catch (err) {
      throw new InternalServerErrorException(err.message, DELETE_SUBSCRIBE_ERROR_TYPE);
    }
  }

  async deleteSubscribe(userId: number, followerId: number): Promise<void> {
    try {
      await this.userFollowersRepository
        .createQueryBuilder('user_followers')
        .where('user_followers.userId=:userId', { userId })
        .andWhere('user_followers.followerId=:followerId', { followerId })
        .delete()
        .execute();
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message, DELETE_SUBSCRIBE_ERROR_TYPE);
    }
  }

  async createdSubscribe(dto: SubscribeDto): Promise<User_Followers> {
    const { userId, followerId } = dto;
    try {
      const newFollower = await this.userFollowersRepository.create({
        user: userId,
        follower: followerId,
      });

      await this.userFollowersRepository.save(newFollower);
      return newFollower;
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message, CREATE_SUBSCRIBE_ERROR_TYPE);
    }
  }

  async findSubscribeUser(dto: SubscribeDto) {
    const { userId, followerId } = dto;
    try {
      return await this.userFollowersRepository
        .createQueryBuilder('user_followers')
        .where('user_followers.userId=:userId', { userId })
        .andWhere('user_followers.followerId=:followerId', { followerId })
        .select(['user_followers.userId as userId', 'user_followers.followerId as followerId', 'user_followers.id as id'])
        .getRawOne();
    } catch (err) {
      this.logger.error(err.message);
      throw new NotFoundException(err.message);
    }
  }
}
