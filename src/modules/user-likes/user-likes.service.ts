import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Videos_Likes } from 'src/modules/entities/videos_likes.entity';
import { VideoService } from 'src/modules/video/video.service';
import { Repository } from 'typeorm';
import { VideoLikesDto } from './user-likes.dto';
import {
  CREATE_VIDEO_ERROR_TYPE,
  DELETE_VIDEO_ERROR,
  DELETE_VIDEO_ERROR_TYPE,
  GET_LIKED_VIDEO_ERROR_TYPE,
  GET_VIDEOS_ID_NOT_FOUND_ERROR,
  VIDEO_NOT_FOUND_ERROR,
  CREATE_VIDEO_ERROR,
} from './user-likes.constants';
import { NotificationService } from 'src/modules/notification/notification.service';
import { notifications_types } from '../entities/notifications.entity';
import { ErrorMessageDto } from './user-likes.dto';

@Injectable()
export class UserLikesService {
  private logger = new Logger(UserLikesService.name);
  constructor(
    @InjectRepository(Videos_Likes)
    private videosLikesRepository: Repository<Videos_Likes>,
    private readonly videoService: VideoService,
    private readonly notificationService: NotificationService,
  ) {}

  DEFAULT_MESSAGE = 'liked your video';

  async checkLike(userId: number, videoId: number): Promise<VideoLikesDto | ErrorMessageDto> {
    try {
      const videosLikes = await this.findVideo(userId, videoId);

      if (!videosLikes) {
        const ifCreated = await this.createdVideoLike(userId, videoId);
        if (!ifCreated) {
          return { message: 'videoId not found' };
        }

        const checkLike = await this.videoService.findById(videoId);

        const { likes } = checkLike;
        const updateLike = likes + 1;

        await this.videoService.updateVideoLike(updateLike, videoId);

        const notification = await this.notificationService.getLastTypeNotification(notifications_types.LIKES);

        const newNotificationBody = {
          userId: checkLike.userId,
          message: this.DEFAULT_MESSAGE,
          type: notifications_types.LIKES,
          eventId: ifCreated.id,
          parentId: notification?.id || null,
        };

        this.notificationService.createNotification(newNotificationBody);
        checkLike.likes = updateLike;

        return checkLike;
      }
      const { likes } = videosLikes;
      const checkLike = likes === 0 ? 0 : likes - 1;

      await this.videoService.updateVideoLike(checkLike, videoId);
      await this.notificationService.deleteNotificationByTypeAndEventId(notifications_types.LIKES, videosLikes.id);

      await this.deleteVideoLike(userId, videoId);

      videosLikes.likes = checkLike;
      return videosLikes;
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException("Couldn't find video");
    }
  }

  async deleteVideoLike(userId: number, videoId: number): Promise<void> {
    try {
      await this.videosLikesRepository
        .createQueryBuilder('videos_likes')
        .where('videos_likes.userId=:userId', { userId })
        .andWhere('videos_likes.videoId=:videoId', { videoId })
        .leftJoinAndSelect('videos_likes.video', 'video')
        .delete()
        .execute();
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(DELETE_VIDEO_ERROR, DELETE_VIDEO_ERROR_TYPE);
    }
  }
  async findVideo(userId: number, videoId: number) {
    try {
      return await this.videosLikesRepository
        .createQueryBuilder('videos_likes')
        .where('videos_likes.userId=:userId', { userId })
        .andWhere('videos_likes.videoId=:videoId', { videoId })
        .leftJoinAndSelect('videos_likes.video', 'video')
        .select(['video.id as videoId', 'video.likes as likes', 'videos_likes.id as id'])
        .getRawOne();
    } catch (error) {
      throw new NotFoundException(VIDEO_NOT_FOUND_ERROR);
    }
  }
  async deleteLike(userId: number, videoId: number): Promise<void> {
    try {
      const videosLikes = await this.findVideo(userId, videoId);
      if (!videosLikes) {
        throw new NotFoundException(VIDEO_NOT_FOUND_ERROR);
      }
      const { likes } = videosLikes;
      const checkLike = likes === 0 ? 0 : likes - 1;

      await this.videoService.updateVideoLike(checkLike, videoId);

      await this.deleteVideoLike(userId, videoId);
    } catch (err) {
      this.logger.error(err.message);
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  async createdVideoLike(userId, videoId): Promise<Videos_Likes> {
    try {
      const newLikes = await this.videosLikesRepository.create({
        userId,
        videoId,
      });

      await this.videosLikesRepository.save(newLikes);
      return newLikes;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async videosLikedList(id: number): Promise<Videos_Likes[]> {
    try {
      return await this.videosLikesRepository.createQueryBuilder('videos_likes').where('videos_likes.userId=:userId', { userId: id }).leftJoinAndSelect('videos_likes.video', 'video').getMany();
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message, GET_VIDEOS_ID_NOT_FOUND_ERROR);
    }
  }

  async findUsersWhoLikedVideo(videoId: number): Promise<Videos_Likes[]> {
    try {
      return await this.videosLikesRepository.createQueryBuilder('videos_likes').where('videos_likes.videoId=:videoId', { videoId }).leftJoinAndSelect('videos_likes.user', 'user').getMany();
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message, GET_LIKED_VIDEO_ERROR_TYPE);
    }
  }
}
