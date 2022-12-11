import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';
import { User } from 'src/modules/entities/users.entity';

export class MarketplaceDto {
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly link: string;

  @IsString()
  readonly price: string;

  @IsString()
  readonly image_link: string;

  @IsString()
  readonly status: string;

  @IsNotEmpty()
  userId: User;
}

export class MarketDto {
  @ApiProperty({
    description: 'marketplaceId',
    example: 2,
    required: true,
    type: Number,
  })
  @IsNumber()
  marketplaceId: number;
}

export class SearchDto {
  @ApiProperty({
    description: 'title',
    example: 'keyboard',
    required: true,
    type: String,
  })
  @IsString()
  title: string;
}

export class CreateProductDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image_link: any;

  @ApiProperty({
    description: 'Product link',
    example: '',
    required: true,
    type: String,
  })
  @IsString()
  link?: string;

  @ApiProperty({
    description: 'Product Title',
    example: 'Keyboard',
    required: true,
    type: String,
  })
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Price of product',
    example: '22.40',
    required: true,
    type: String,
  })
  @IsString()
  price?: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'published or draft',
    example: 'published',
    required: true,
    type: String,
  })
  status?: string;
}
