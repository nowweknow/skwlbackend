import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UserUpdateDto {
  @ApiProperty()
  @IsOptional()
  first_name?: string;

  @ApiProperty()
  @IsOptional()
  second_name?: string;

  @ApiProperty()
  @IsOptional()
  username?: string;

  @ApiProperty()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsOptional()
  avatar?: string;

  @ApiProperty()
  @IsOptional()
  header?: string;

  @ApiProperty()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsOptional()
  website_link?: string;

  @ApiProperty()
  @IsOptional()
  background_image?: string;
}
