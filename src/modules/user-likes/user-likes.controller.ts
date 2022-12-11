import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.quard';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { JwtPayload } from '../auth/jwt/jwt-auth.strategy';
import { Videos_Likes } from '../entities/videos_likes.entity';
import { VideoLikesDto } from './user-likes.dto';
import { UserLikesService } from './user-likes.service';
import { ErrorMessageDto } from './user-likes.dto';

@ApiTags('user-likes')
@Controller('user-likes')
export class UserLikesController {
  constructor(private readonly userLikesService: UserLikesService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Update users like.',
    type: VideoLikesDto,
  })
  @ApiParam({
    name: 'videoId',
    type: 'number',
  })
  @Patch('update/:videoId')
  async updateLikes(@GetUser() user: JwtPayload, @Param('videoId') videoId: number): Promise<VideoLikesDto | ErrorMessageDto> {
    return this.userLikesService.checkLike(user.id, videoId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('videos/saved')
  async videosLikedList(@GetUser() user: JwtPayload): Promise<Videos_Likes[]> {
    return this.userLikesService.videosLikedList(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('video/liked/:videoId')
  async findUsersWhoLikedVideo(@GetUser() user: JwtPayload, @Param('videoId') videoId: number): Promise<Videos_Likes[]> {
    return this.userLikesService.findUsersWhoLikedVideo(videoId);
  }
}
