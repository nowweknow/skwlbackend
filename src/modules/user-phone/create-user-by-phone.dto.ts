import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserByPhoneDto {
  @ApiProperty({
    description: 'User phone number',
    required: true,
  })
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'User name',
    required: true,
  })
  @IsString()
  username: string;
}
