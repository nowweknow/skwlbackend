import { Body, Controller, Get, HttpStatus, Post, Req, UseGuards, Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './google/auth.google.quard';
import { JwtAuthService } from './jwt/jwt-auth.service';
import { UsersService } from '../users/users.service';
import { JwtRefreshService } from './jwt-refresh/jwt-refresh.service';
import { AppleService } from './apple/apple.service';
import { AppleAuthDto } from './dto/apple.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly appleService: AppleService,
    private readonly authService: AuthService,
    private jwtRefreshService: JwtRefreshService,
    private jwtAuthService: JwtAuthService,
    private uService: UsersService,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get token.',
  })
  @UseGuards(GoogleOauthGuard)
  async googleAuth(@Req() req) {
    console.log(req);
  }

  @Post('/apple')
  public async appleLogin(@Body() payload: AppleAuthDto): Promise<any> {
    return this.appleService.verifyUser(payload);
  }

  @Post('login')
  async login(@Body() body: LoginDto): Promise<string> {
    console.log('body in controller', body);
    const user = await this.authService.login(body);
    const { accessToken } = this.jwtAuthService.createAccessToken(user);
    return accessToken;
  }

  @Get('google/redirect')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req): Promise<string> {
    const user = await this.authService.googleLogin(req.user);
    const { accessToken } = this.jwtAuthService.createAccessToken(user);
    return accessToken;
  }

  @Get('facebook')
  @ApiResponse({
    status: 200,
    description: 'Get token.',
  })
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Req() req): Promise<any> {
    return {
      statusCode: HttpStatus.OK,
      data: req.user,
    };
  }

  @Get('twitter')
  @ApiResponse({
    status: 200,
    description: 'Get token.',
  })
  @UseGuards(AuthGuard('twitter'))
  async twitterLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('twitter/redirect')
  @ApiResponse({
    status: 200,
    description: 'Get token.',
  })
  @UseGuards(AuthGuard('twitter'))
  async twitterLoginRedirect(@Req() req): Promise<any> {
    return {
      statusCode: HttpStatus.OK,
      data: req.user,
    };
  }
}
