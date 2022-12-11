import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../entities/users.entity';

export class CreateUserDeviceDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  deviceId: string;

  @ApiProperty()
  deviceName: string;

  @ApiProperty()
  brand: string;

  @ApiProperty()
  token: string;

  @ApiProperty()
  deviceUniqueId: string;
}
