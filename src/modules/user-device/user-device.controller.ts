import { Controller, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.quard';
import { JwtPayload } from '../auth/jwt/jwt-auth.strategy';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { UserDeviceService } from './user-device.service';
import { CreateUserDeviceDto } from './dto/create-user-device.dto';
import { UpdateUserDeviceDto } from './dto/update-user-device.dto';
import { UserDevice } from '../entities/user_device.entity';
import { UpdateResult } from 'typeorm';

@ApiTags('user-device')
@Controller('user-device')
export class UserDeviceController {
  constructor(private readonly userDeviceService: UserDeviceService) {}

  @ApiResponse({
    status: 200,
    description: 'create user device',
    type: CreateUserDeviceDto,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@GetUser() user: JwtPayload, @Body() createUserDeviceDto: CreateUserDeviceDto): Promise<UserDevice> {
    return this.userDeviceService.create(createUserDeviceDto);
  }

  @ApiResponse({
    status: 200,
    description: 'update user device',
    type: UpdateUserDeviceDto,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch()
  update(@GetUser() user: JwtPayload, @Body() updateUserDeviceDto: UpdateUserDeviceDto): Promise<UpdateResult> {
    return this.userDeviceService.update(user.id, updateUserDeviceDto);
  }
}
