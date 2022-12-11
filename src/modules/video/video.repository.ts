import { EntityRepository, Repository } from 'typeorm';
import { BadRequestException, HttpException, HttpStatus, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Video } from '../entities/videos.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { IMessage } from '../../shared/interfaces/IMessage';
import { FIND_HASHTAG_ERROR, GET_VIDEOS_ERROR_TYPE, VIDEO_CREATE_ERROR, VIDEO_CREATE_ERROR_TYPE, VIDEO_CREATE_SUCCESS, VIDEO_NOT_FOUND_ERROR, LIMIT } from './constants';

@EntityRepository(Video)
export class VideoRepository extends Repository<Video> {
  private logger = new Logger(Video.name);
  pagination = (page = 0) => {
    return {
      limit: LIMIT,
      page: (page - 1) * LIMIT,
    };
  };

  async createVideo(userId: number, product_image_link: string, options: CreateVideoDto): Promise<IMessage> {
    try {
      const newVideo = this.create({ ...options, product_image_link, userId });
      await this.save(newVideo);
      return { message: VIDEO_CREATE_SUCCESS };
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(VIDEO_CREATE_ERROR, VIDEO_CREATE_ERROR_TYPE);
    }
  }
  async getTrendingVideos(page: number): Promise<Video[]> {
    try {
      const options = this.pagination(page);
      return await this.createQueryBuilder('video')
        .leftJoinAndSelect('video.user', 'user')
        .addOrderBy('video.likes', 'DESC')
        .orderBy('video.isTranding', 'DESC')
        .addOrderBy('video.likes', 'DESC')
        .addOrderBy('video.created_at', 'DESC')
        .skip(options.page)
        .take(options.limit)
        .getMany();
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message, GET_VIDEOS_ERROR_TYPE);
    }
  }

  async getNewVideos(page: number): Promise<Video[]> {
    try {
      const options = this.pagination(page);
      return await this.createQueryBuilder('video').leftJoinAndSelect('video.user', 'user').addOrderBy('video.created_at', 'DESC').skip(options.page).take(options.limit).getMany();
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message, GET_VIDEOS_ERROR_TYPE);
    }
  }

  async getNewVideosAuth(userId: number, page: number): Promise<Video[]> {
    try {
      const options = this.pagination(page);
      return await this.createQueryBuilder('video')
        .leftJoinAndSelect('video.user', 'user')
        .leftJoinAndSelect('user.followers', 'followers', 'followers.followerId = :followerId', { followerId: userId })
        .leftJoin('followers.user', 'followers_user')
        .leftJoin('followers.follower', 'followers_follower')
        .addSelect(['followers_user.id', 'followers_follower.id'])
        .leftJoinAndSelect('video.user_liked', 'user_liked', 'user_liked.userId = :userId', { userId })
        .addOrderBy('video.created_at', 'DESC')
        .skip(options.page)
        .take(options.limit)
        .getMany();
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message, GET_VIDEOS_ERROR_TYPE);
    }
  }

  async getTrandingVideosAuth(userId: number, page: number): Promise<Video[]> {
    try {
      const options = this.pagination(page);
      return await this.createQueryBuilder('video')
        .leftJoinAndSelect('video.user', 'user')
        .leftJoinAndSelect('user.followers', 'followers', 'followers.followerId = :followerId', { followerId: userId })
        .leftJoin('followers.user', 'followers_user')
        .leftJoin('followers.follower', 'followers_follower')
        .addSelect(['followers_user.id', 'followers_follower.id'])
        .leftJoinAndSelect('video.user_liked', 'user_liked', 'user_liked.userId = :userId', { userId })
        .addOrderBy('video.likes', 'DESC')
        .orderBy('video.isTranding', 'DESC')
        .addOrderBy('video.likes', 'DESC')
        .addOrderBy('video.created_at', 'DESC')
        .skip(options.page)
        .take(options.limit)
        .getMany();
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message, GET_VIDEOS_ERROR_TYPE);
    }
  }

  async getRecommendedVideos(page: number): Promise<Video[]> {
    try {
      const options = this.pagination(page);
      return await this.createQueryBuilder('video').leftJoinAndSelect('video.user', 'user').addOrderBy('user.plan_end_date', 'DESC').skip(options.page).take(options.limit).getMany();
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message, GET_VIDEOS_ERROR_TYPE);
    }
  }

  async getFollowingVideo(userId: number, page: number): Promise<Video[]> {
    try {
      const options = this.pagination(page);
      return await this.createQueryBuilder('video')
        .leftJoinAndSelect('video.user', 'user')
        .leftJoinAndSelect('user.followers', 'followers', 'followers.followerId = :followerId', { followerId: userId })
        .leftJoinAndSelect('video.user_liked', 'user_liked', 'user_liked.userId = :userId', { userId })
        .where('followers.followerId=:followerId', { followerId: userId })
        .orderBy('video.created_at', 'DESC')
        .skip(options.page)
        .take(options.limit)
        .getMany();
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findOneVideo(userId: number, videoId: number): Promise<Video> {
    try {
      return await this.createQueryBuilder('video')
        .leftJoinAndSelect('video.user', 'user', 'user.id = :userId', { userId })
        .leftJoinAndSelect('video.user_liked', 'user_liked', 'user_liked.videoId = :videoId', { videoId })
        .where('video.id=:id', { id: videoId })
        .getOneOrFail();
    } catch (err) {
      this.logger.error(err.message);
      throw new NotFoundException(err.message, VIDEO_NOT_FOUND_ERROR);
    }
  }

  async findVideo(userId: number, videoId: number): Promise<Video> {
    try {
      return await this.createQueryBuilder('video').leftJoinAndSelect('video.user', 'user').where('video.id=:id', { id: videoId }).andWhere('video.userId=:userId', { userId }).getOneOrFail();
    } catch (err) {
      this.logger.error(err.message);
      throw new NotFoundException(err.message, VIDEO_NOT_FOUND_ERROR);
    }
  }

  async searchHashtag(hashtag: string, page: number): Promise<Video[]> {
    try {
      const options = this.pagination(page);
      return await this.createQueryBuilder('video')
        .leftJoinAndSelect('video.user', 'user')
        .where('video.hashtag like :name', { name: `%${hashtag}%` })
        .addOrderBy('video.created_at', 'DESC')
        .skip(options.page)
        .take(options.limit)
        .getMany();
    } catch (err) {
      this.logger.error(err.message);
      throw new BadRequestException(err.message, FIND_HASHTAG_ERROR);
    }
  }

  async searchHashtagAuth(userId: number, hashtag: string, page: number): Promise<Video[]> {
    try {
      const options = this.pagination(page);
      return await this.createQueryBuilder('video')
        .leftJoinAndSelect('video.user', 'user')
        .where('video.hashtag like :name', { name: `%${hashtag}%` })
        .leftJoinAndSelect('video.user_liked', 'user_liked', 'user_liked.userId = :userId', { userId })
        .leftJoinAndSelect('user.followers', 'followers', 'followers.followerId = :followerId', { followerId: userId })
        .addOrderBy('video.created_at', 'DESC')
        .skip(options.page)
        .take(options.limit)
        .getMany();
    } catch (err) {
      this.logger.error(err.message);
      throw new BadRequestException(err.message, FIND_HASHTAG_ERROR);
    }
  }

  async deleteVideo(userId: number, videoId: number) {
    try {
      return await this.createQueryBuilder('video').where('video.id =:id', { id: videoId }).andWhere('video.userId =:userId', { userId: userId }).delete().execute();
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException(e.message, HttpStatus.CONFLICT);
    }
  }
}
