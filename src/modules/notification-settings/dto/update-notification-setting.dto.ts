import { ApiProperty } from '@nestjs/swagger';
export class UpdateNotificationSettingDto {
  @ApiProperty()
  following?: boolean;

  @ApiProperty()
  message?: boolean;

  @ApiProperty()
  likes?: boolean;
}

export class UpdateNotificationSettingBodyDto {
  @ApiProperty()
  following?: boolean;

  @ApiProperty()
  message?: boolean;

  @ApiProperty()
  likes?: boolean;

  user?: string;
}
