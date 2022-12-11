import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../entities/users.entity';

export class FollowersVideoDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly userId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly first_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly user_second_name: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly avatar: string;
}

export class SubscribeDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly userId: User;

  @ApiProperty()
  @IsNotEmpty()
  readonly followerId: User;
}

export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly userId: User;
}

export class SubscribeWithUserDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: number;
}
