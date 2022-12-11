import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDevice } from '../entities/user_device.entity';
import { UpdateUserDeviceDto } from './dto/update-user-device.dto';
import { UpdateResult } from 'typeorm';
import { UserDeviceRepository } from './user-device.repository';

@Injectable()
export class UserDeviceService {
  constructor(
    @InjectRepository(UserDeviceRepository)
    private readonly userDeviceRepository: UserDeviceRepository,
  ) { }

  async findByUserId(userId: number): Promise<UserDevice> {
    return await this.userDeviceRepository.findByUserId(userId);
  }

  async create(userDevice): Promise<UserDevice> {
    return await this.userDeviceRepository.createNewDevice(userDevice);
  }

  async update(userId: number, userDevice: UpdateUserDeviceDto): Promise<UpdateResult> {
    return await this.userDeviceRepository.update(userId, userDevice);
  }
}