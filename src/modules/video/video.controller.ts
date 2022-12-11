import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { VideoService } from './video.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.quard';
import { Video } from '../entities/videos.entity';
import { GetUser } from '../../shared/decorators/get-user.decorator';
import { JwtPayload } from '../auth/jwt/jwt-auth.strategy';
import { IMessage } from '../../shared/interfaces/IMessage';
import { FileInterceptor } from '@nestjs/platform-express';
import { DELETED_VIDEO_SUCCESS, FIND_HASHTAG_SUCCESS, GET_RECOMMENDED_USERS_VIDEO_SUCCESS, GET_VIDEO_SUCCESS, VIDEO_CREATE_SUCCESS, VIDEO_UPDATE_SUCCESS } from './constants';
import { CreateVideoDto } from './dto/create-video.dto';
import { SearchHashtagDto, VideoDeletedDto } from './video.dto';

@ApiTags('video')
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @ApiResponse({
    status: 200,
    description: 'Get new videos.',
    type: Video,
  })
  @Get('new/:page')
  getNewVideos(@Param('page') page: number): Promise<Video[] | void> {
    return this.videoService.getNewVideos(page);
  }

  @ApiResponse({
    status: 200,
    description: 'Get trending videos.',
    type: Video,
  })
  @Get('trending/:page')
  getTrendingVideos(@Param('page') page: number): Promise<Video[] | void> {
    return this.videoService.getTrendingVideos(page);
  }

  @ApiResponse({
    status: 200,
    description: GET_RECOMMENDED_USERS_VIDEO_SUCCESS,
    type: Video,
  })
  @Get('recommended/:page')
  async getRecommendedVideos(@Param('page') page: number): Promise<Video[]> {
    return this.videoService.getRecommendedVideos(page);
  }

  @ApiResponse({
    status: 200,
    description: 'Get new videos.',
    type: Video,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('auth/new/:page')
  getNewVideosAuth(@GetUser() user: JwtPayload, @Param('page') page: number): Promise<Video[] | void> {
    return this.videoService.getNewVideosAuth(user.id, page);
  }

  @ApiResponse({
    status: 200,
    description: 'Get trending videos.',
    type: Video,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('auth/trending/:page')
  getTrendingVideosAuth(@GetUser() user: JwtPayload, @Param('page') page: number): Promise<Video[] | void> {
    return this.videoService.getTrendingVideosAuth(user.id, page);
  }

  @ApiResponse({
    status: 200,
    description: VIDEO_CREATE_SUCCESS,
    type: String,
  })
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('product_image'))
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createVideo(@GetUser() user: JwtPayload, @Body() dto: CreateVideoDto, @UploadedFile() file: Express.Multer.File): Promise<IMessage> {
    return this.videoService.createVideo(user.id, dto, file);
  }

  @ApiResponse({
    status: 200,
    description: VIDEO_UPDATE_SUCCESS,
    type: String,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('update')
  updateUserProfile(@GetUser() user: JwtPayload, @Body() dto) {
    return this.videoService.updateVideoLike(user.id, dto);
  }

  @ApiResponse({
    status: 200,
    description: 'Get following video.',
    type: Video,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('following/:page')
  async getFollowingVideos(@GetUser() user: JwtPayload, @Param('page') page: number): Promise<Video[]> {
    return this.videoService.getFollowingVideo(user.id, page);
  }

  @ApiResponse({
    status: 200,
    description: GET_VIDEO_SUCCESS,
    type: Video,
  })
  @ApiParam({
    name: 'videoId',
    type: 'number',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('auth/find/:videoId')
  async getOneVideo(@GetUser() user: JwtPayload, @Param('videoId') videoId: number): Promise<Video> {
    return this.videoService.getOneVideo(user.id, videoId);
  }
  @ApiResponse({
    status: 200,
    description: GET_VIDEO_SUCCESS,
    type: Video,
  })
  @ApiParam({
    name: 'videoId',
    type: 'number',
  })
  @Get('find/:videoId')
  async findOneVideo(@Param('videoId') videoId: number): Promise<Video> {
    return this.videoService.findOneVideo(videoId);
  }

  @ApiResponse({
    status: 201,
    description: FIND_HASHTAG_SUCCESS,
    type: Video,
  })
  @Post('search/:page')
  sreachProductByTitle(@Body() dto: SearchHashtagDto, @Param('page') page: number): Promise<Video[]> {
    return this.videoService.searchHashtag(dto.hashtag, page);
  }

  @ApiResponse({
    status: 201,
    description: FIND_HASHTAG_SUCCESS,
    type: Video,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('auth/search/:page')
  searchProductByTitleAuth(@GetUser() user: JwtPayload, @Body() dto: SearchHashtagDto, @Param('page') page: number): Promise<Video[]> {
    return this.videoService.searchHashtagAuth(user.id, dto.hashtag, page);
  }

  @ApiResponse({
    status: 200,
    description: DELETED_VIDEO_SUCCESS,
    type: Video,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('delete')
  async deleteVideo(@GetUser() user: JwtPayload, @Body() dto: VideoDeletedDto) {
    return this.videoService.deleteVideo(user.id, dto.videoId);
  }
}
