import { Module } from '@nestjs/common';
import { UserDeviceService } from './user-device.service';
import { UserDeviceController } from './user-device.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDevice } from '../entities/user_device.entity';
import { UserDeviceRepository } from './user-device.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserDevice,  UserDeviceRepository])],
  exports: [UserDeviceService],
  controllers: [UserDeviceController],
  providers: [UserDeviceService]
})
export class UserDeviceModule { }
