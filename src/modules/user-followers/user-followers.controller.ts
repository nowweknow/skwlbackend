import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.quard';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { JwtPayload } from '../auth/jwt/jwt-auth.strategy';
import { FollowersVideoDto, UserDto, SubscribeWithUserDto } from './user-followers.dto';
import { UserFollowersService } from './user-followers.service';

@ApiTags('user-followers')
@Controller('user-followers')
export class UserFollowersController {
  constructor(private readonly userService: UserFollowersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Get followers list.',
    type: FollowersVideoDto,
  })
  @Get('followers')
  getFollowersUserList(@GetUser() user: JwtPayload): Promise<FollowersVideoDto[]> {
    return this.userService.getFollowersUserList(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: SubscribeWithUserDto })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully.',
  })
  @Post('subscribe')
  async setSubscribe(
    @GetUser() user: JwtPayload,
    @Body() dto: UserDto,
  ): Promise<{
    isFollowed: boolean;
  }> {
    const obj = { ...dto, followerId: user.id };
    return this.userService.setSubscribe(obj);
  }
}
