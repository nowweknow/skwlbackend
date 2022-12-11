import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, IsEnum, IsDate, IsBoolean } from 'class-validator';
import { plans_types } from 'src/modules/entities/users.entity';

export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly first_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly second_name: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly avatar: string;

  @ApiProperty()
  @IsString()
  readonly header: string;

  @ApiProperty()
  @IsString()
  readonly description: string;

  @ApiProperty()
  @IsEnum({
    enum: plans_types,
    enumName: 'plans_types',
  })
  readonly plan: string;

  @ApiProperty()
  @IsDate()
  readonly plan_end_date: Date;

  @ApiProperty()
  @IsBoolean()
  readonly is_blocked: boolean;
}

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly providerId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly picture: string;

  @ApiProperty()
  @IsString()
  readonly accessToken: string;
}
export class UserUpdateDto {
  @ApiProperty()
  @IsString()
  readonly first_name?: string;

  @ApiProperty()
  @IsString()
  readonly second_name?: string;

  @ApiProperty()
  @IsEmail()
  readonly email?: string;

  @ApiProperty()
  @IsString()
  readonly avatar?: string;

  @ApiProperty()
  @IsString()
  readonly header?: string;

  @ApiProperty()
  @IsString()
  readonly description?: string;

  @ApiProperty()
  @IsEnum({
    enum: plans_types,
    enumName: 'plans_types',
  })
  readonly plan?: string;

  @ApiProperty()
  @IsDate()
  readonly plan_end_date?: Date;

  @ApiProperty()
  @IsBoolean()
  readonly is_blocked?: boolean;
}
