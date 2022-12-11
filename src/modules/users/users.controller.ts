import { Body, Controller, Get, Param, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.quard';
import { JwtPayload } from '../auth/jwt/jwt-auth.strategy';
import { User } from '../entities/users.entity';
import { GET_RECOMMENDED_USERS_SUCCESS, GET_USER_PROFILE_SUCCESS, USER_UPDATE_SUCCESS } from './user.contstants';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UserUpdateDto } from './userUpdateDto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiResponse({
    status: 200,
    description: GET_USER_PROFILE_SUCCESS,
    type: User,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  getUserProfile(@GetUser() user: JwtPayload): Promise<User> {
    return this.userService.getUserProfile(user.id);
  }

  @ApiResponse({
    status: 200,
    description: GET_USER_PROFILE_SUCCESS,
    type: User,
  })
  @ApiParam({
    name: 'userId',
    type: 'number',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile/:userId')
  getAnotherUserProfile(@Param('userId') userId: number): Promise<User> {
    return this.userService.getUserProfile(userId);
  }

  @ApiResponse({
    status: 200,
    description: GET_RECOMMENDED_USERS_SUCCESS,
    type: User,
  })
  @Get('recommended')
  async getRecommendedUsers(): Promise<User[]> {
    return this.userService.getRecommendedUsers();
  }

  @ApiResponse({
    status: 200,
    description: GET_RECOMMENDED_USERS_SUCCESS,
    type: User,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('auth/recommended')
  async getRecommendedAuthUsers(@GetUser() user: JwtPayload): Promise<User[]> {
    return this.userService.getRecommendedAuthUsers(user.id);
  }
  @ApiResponse({
    status: 201,
    description: USER_UPDATE_SUCCESS,
    type: User,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('update')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'background_image', maxCount: 1 },
    ]),
  )
  async updateUserProfile(
    @GetUser() user: JwtPayload,
    @Body() dto: UserUpdateDto,
    @UploadedFiles()
    files: { avatar?: Express.Multer.File[]; background_image?: Express.Multer.File[] },
  ): Promise<{
    message: string;
  }> {
    const { ...avatar } = files.avatar;
    const { ...background_image } = files.background_image;

    return this.userService.updateUserProfile(user.id, dto, avatar[0], background_image[0]);
  }
}
