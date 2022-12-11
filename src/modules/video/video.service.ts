import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from 'src/modules/entities/videos.entity';
import { VideoLikesDto } from './video.dto';
import { CreateVideoDto } from './dto/create-video.dto';
import { VideoRepository } from './video.repository';
import { IMessage } from '../../shared/interfaces/IMessage';
import { FilesService } from '../files/files.service';

import { S3FoldersEnum } from '../../shared/enums/S3Folders.enum';
import { DELETED_VIDEO_SUCCESS, GET_FIND_VIDEOS_NOT_FOUND_USER_ERROR, SEARCH_HASHTAG_ERROR, UPDATE_VIDEO_ERROR_TYPE, VIDEO_CREATE_ERROR_TYPE, VIDEO_DELETE_ERROR_TYPE } from './constants';

@Injectable()
export class VideoService {
  private logger = new Logger(VideoService.name);

  constructor(@InjectRepository(VideoRepository) private readonly videoRepository: VideoRepository, private fileService: FilesService) {}

  async getNewVideos(page: number): Promise<Video[]> {
    return await this.videoRepository.getNewVideos(page);
  }

  async getTrendingVideos(page: number): Promise<Video[]> {
    return await this.videoRepository.getTrendingVideos(page);
  }

  async getNewVideosAuth(userId: number, page: number): Promise<Video[]> {
    return await this.videoRepository.getNewVideosAuth(userId, page);
  }

  async getTrendingVideosAuth(userId: number, page: number): Promise<Video[]> {
    return await this.videoRepository.getTrandingVideosAuth(userId, page);
  }

  async updateVideoLike(updateLike, videoId): Promise<void> {
    try {
      await this.videoRepository
        .createQueryBuilder('video')
        .update()
        .set({
          likes: updateLike,
        })
        .where('id=:id', { id: videoId })
        .execute();
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message, UPDATE_VIDEO_ERROR_TYPE);
    }
  }

  async findById(videoId: number): Promise<VideoLikesDto> {
    try {
      return await this.videoRepository.createQueryBuilder('video').where('id=:id', { id: videoId }).select(['id as videoId', 'likes', 'userId']).getRawOne();
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message, GET_FIND_VIDEOS_NOT_FOUND_USER_ERROR);
    }
  }

  async getOneVideo(userId: number, videoId: number): Promise<Video> {
    return await this.videoRepository.findOneVideo(userId, videoId);
  }

  async findOneVideo(videoId: number): Promise<Video> {
    const id = 0;
    return await this.videoRepository.findOneVideo(id, videoId);
  }

  async createVideo(userId: number, dto: CreateVideoDto, file: Express.Multer.File): Promise<IMessage> {
    const image = await this.fileService.uploadFile(file.buffer, file.originalname, file.mimetype, S3FoldersEnum.PRODUCT_IMAGES);
    try {
      return await this.videoRepository.createVideo(userId, image.Location, dto);
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message, VIDEO_CREATE_ERROR_TYPE);
    }
  }

  async getRecommendedVideos(page: number): Promise<Video[]> {
    return this.videoRepository.getRecommendedVideos(page);
  }

  async getFollowingVideo(userId: number, page: number): Promise<Video[]> {
    const user = await this.videoRepository.findOne({ userId });
    if (!user) {
      throw new NotFoundException(GET_FIND_VIDEOS_NOT_FOUND_USER_ERROR);
    }
    return this.videoRepository.getFollowingVideo(userId, page);
  }
  async searchHashtag(hashtag: string, page: number): Promise<Video[]> {
    try {
      if (!hashtag) {
        throw new BadRequestException(SEARCH_HASHTAG_ERROR);
      }
      return this.videoRepository.searchHashtag(hashtag, page);
    } catch (err) {
      this.logger.error(err.message);
      throw new BadRequestException(err.message, SEARCH_HASHTAG_ERROR);
    }
  }

  async searchHashtagAuth(userId: number, hashtag: string, page: number): Promise<Video[]> {
    try {
      if (!hashtag) {
        throw new BadRequestException(SEARCH_HASHTAG_ERROR);
      }
      return this.videoRepository.searchHashtagAuth(userId, hashtag, page);
    } catch (err) {
      this.logger.error(err.message);
      throw new BadRequestException(err.message, SEARCH_HASHTAG_ERROR);
    }
  }
  async deleteVideo(
    userId: number,
    videoId: number,
  ): Promise<{
    message: string;
  }> {
    await this.videoRepository.findVideo(userId, videoId);
    try {
      await this.videoRepository.deleteVideo(userId, videoId);
      return { message: DELETED_VIDEO_SUCCESS };
    } catch (err) {
      this.logger.error(err.message);
      throw new BadRequestException(err.message, VIDEO_DELETE_ERROR_TYPE);
    }
  }
}
