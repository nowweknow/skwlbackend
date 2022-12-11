import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateVideoDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  product_image: any;

  @ApiProperty({
    description: 'Video Name',
    example: 'My Traveling',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  link: string;

  @ApiProperty({
    description: 'Video Title',
    example: 'Charravas',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Name of product',
    example: 'Iphone',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  product_title: string;

  @ApiProperty({
    description: 'Link to product on different service',
    example: 'https://www.amazon.com/',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  product_link: string;

  @ApiProperty({
    description: 'If admin select it as trands',
    example: true,
    required: true,
    type: Boolean,
  })
  @IsNotEmpty()
  isTranding: boolean;

  @ApiProperty({
    description: 'video hashtags',
    example: '#fishing',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  hashtag: string;
}
