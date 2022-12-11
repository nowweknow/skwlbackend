import { Controller, Post, Body } from '@nestjs/common';
import { UserPhoneService } from './user-phone.service';
import { CreateUserByPhoneDto } from './create-user-by-phone.dto';
import { UserPhone } from '../entities/unverified_users.entity';
import { LoginUserWithPhone, VerifyUserPhone } from './verify-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user-phone')
@Controller('user-phone')
export class UserPhoneController {
  constructor(private readonly userPhoneService: UserPhoneService) {}

  @Post('')
  create(@Body() body: CreateUserByPhoneDto): Promise<UserPhone> {
    return this.userPhoneService.create(body);
  }

  @Post('/verify')
  verifyUserPhone(@Body() body: VerifyUserPhone) {
    return this.userPhoneService.verifyUserPhone(body.id, body.code);
  }

  @Post('/login')
  login(@Body() body: LoginUserWithPhone) {
    return this.userPhoneService.loginWithPhone(body.phone);
  }
}
