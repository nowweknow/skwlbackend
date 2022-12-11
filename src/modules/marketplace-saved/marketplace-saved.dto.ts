import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class MarketplaceDto {
  @IsNotEmpty()
  id: number | null;

  @IsNotEmpty()
  readonly userId: number;

  @IsNotEmpty()
  readonly marketplaceId: number;
}
export class MarketDto {
  @ApiProperty({
    description: 'marketplaceId',
    example: 2,
    required: true,
    type: Number,
  })
  @IsNotEmpty()
  readonly marketplaceId: number;
}
