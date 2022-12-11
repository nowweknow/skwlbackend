import { IsNumber, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDeviceDto {
  @ApiProperty()
  @IsNumber()
  deviceId?: string;

  @ApiProperty()
  @IsString()
  deviceName?: string;

  @ApiProperty()
  @IsString()
  brand?: string;

  @ApiProperty()
  @IsString()
  token?: string;

  @ApiProperty()
  @IsString()
  deviceUniqueId?: string;
}
