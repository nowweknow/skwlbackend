import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VideoDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly link: string;

  @ApiProperty()
  @IsString()
  readonly title: string;

  @ApiProperty()
  @IsString()
  readonly product_title: string;

  @ApiProperty()
  @IsString()
  readonly product_image_link: string;

  @ApiProperty()
  @IsString()
  readonly product_link: string;

  @ApiProperty()
  @IsString()
  readonly hashtag: string;

  @ApiProperty()
  @IsBoolean()
  readonly isTranding: boolean;

  @ApiProperty()
  @IsNumber()
  readonly likes: number;

  @ApiProperty()
  @IsDate()
  readonly created_at: Date;
}
export class LikesDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly userId: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly videoId: number;
}
export class VideoLikesDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly videoId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  likes: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: number;
}

export class VideoFindDto {
  @ApiProperty({
    description: 'videoId',
    example: 2,
    required: true,
    type: Number,
  })
  @IsNotEmpty()
  videoId: number;
}
export class SearchHashtagDto {
  @ApiProperty({
    description: 'hashtag',
    example: 'rest',
    required: true,
    type: String,
  })
  @IsString()
  hashtag: string;
}
export class VideoDeletedDto {
  @ApiProperty({
    description: 'videoId',
    example: 2,
    required: true,
    type: Number,
  })
  @IsNotEmpty()
  videoId: number;
}
