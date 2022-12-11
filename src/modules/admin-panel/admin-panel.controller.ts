import { Controller, Get, Put, Body, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../entities/users.entity';
import { AdminPanelService } from './admin-panel.service';
import { SHOW_ADMIN_PANEL_SUCCESS } from './admin-panel.constants';
import { IdDto, SignInDto } from './admin-panel.dto';
import { Video } from '../entities/videos.entity';
import { Admin } from '../entities/admin.entity';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.quard';
import { UpdateResult } from 'typeorm';

@ApiTags('admin-panel')
@Controller('admin-panel')
export class AdminPanelController {
  constructor(private readonly adminPanelService: AdminPanelService) {}

  @ApiResponse({
    status: 200,
    description: SHOW_ADMIN_PANEL_SUCCESS,
    type: User,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('users')
  getUsers(): Promise<User[]> {
    return this.adminPanelService.getUsers();
  }

  @ApiResponse({
    status: 200,
    description: SHOW_ADMIN_PANEL_SUCCESS,
    type: User,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('users')
  changeIsBlockedUser(@Body() idDto: IdDto): Promise<UpdateResult> {
    return this.adminPanelService.changeIsBlockedUser(idDto);
  }

  @ApiResponse({
    status: 200,
    description: SHOW_ADMIN_PANEL_SUCCESS,
    type: Video,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('products')
  getProducts(): Promise<Video[]> {
    return this.adminPanelService.getProducts();
  }

  @ApiResponse({
    status: 200,
    description: SHOW_ADMIN_PANEL_SUCCESS,
    type: Video,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('products')
  changeIsAdvertised(@Body() idDto: IdDto): Promise<UpdateResult> {
    return this.adminPanelService.changeIsAdvertised(idDto);
  }

  @ApiResponse({
    status: 200,
    description: SHOW_ADMIN_PANEL_SUCCESS,
    type: Admin,
  })
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto): Promise<string> {
    return this.adminPanelService.signInAdmin(signInDto);
  }
}
