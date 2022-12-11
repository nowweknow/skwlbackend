import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { User } from '../entities/users.entity';

export class CreateChatBodyDto {
  companionId: User;
}

export class createChatDto {
  companionId: User;
  userId: User;
}

export class SearchCathDto {
  @ApiProperty({
    type: String,
    description: 'User name',
    example: 'John',
  })
  @IsString()
  search: string;

  @ApiProperty({
    type: Number,
    description: 'page number',
    example: 1,
  })
  @IsInt()
  page: number;

  @ApiProperty({
    type: Number,
    description: 'page size',
    example: 10,
  })
  @IsInt()
  limit: number;
}
