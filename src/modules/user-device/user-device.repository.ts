import { EntityRepository } from 'typeorm';
import { Repository } from 'typeorm';
import { UserDevice } from '../entities/user_device.entity';
import { UpdateUserDeviceDto } from './dto/update-user-device.dto';
import { UpdateResult } from 'typeorm';
import { CreateUserDeviceDto } from './dto/create-user-device.dto';
import { InternalServerErrorException } from '@nestjs/common';
@EntityRepository(UserDevice)
export class UserDeviceRepository extends Repository<UserDevice> {
  async findByUserId(userId: number): Promise<UserDevice> {
    try {
      return await this.findOneOrFail({ where: { userId } });
    } catch (err) {
      throw new InternalServerErrorException('Find user by Id error');
    }
  }

  async createNewDevice(userDevice: CreateUserDeviceDto): Promise<UserDevice> {
    try {
      const device = await this.findOne({ where: { userId: userDevice.userId } });
      if (device) {
        const body = { ...device, ...userDevice };
        await this.createQueryBuilder().update(UserDevice).set(body).where('id = :id', { id: device.id }).execute();
        return body;
      } else {
        await this.create(userDevice);
        return await this.save(userDevice);
      }
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async update(userId: number, userDevice: UpdateUserDeviceDto): Promise<UpdateResult> {
    try {
      return await this.createQueryBuilder('user_device').update().set(userDevice).where('user_device.userId = :userId', { userId: 1 }).execute();
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
