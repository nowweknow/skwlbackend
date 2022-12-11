import { MarketPlace } from 'src/modules/entities/marketplace.entity';
import { User } from 'src/modules/entities/users.entity';

export interface IMarketplace {
  marketplaceId: number;
}

export interface ICreatedProductDto {
  userId: MarketPlace;
  marketplaceId: User;
}
