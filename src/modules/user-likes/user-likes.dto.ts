import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class VideoLikesDto {
  @IsNotEmpty()
  readonly videoId: number;

  @IsNotEmpty()
  @IsString()
  readonly likes: string;

  readonly userId: number;
}
export class LikesDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly userId: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly videoId: number;
}

export class ErrorMessageDto {
  @IsNotEmpty()
  @IsString()
  readonly message: string;
}
