import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Marketplace_Saved } from '../entities/marketplace_saved.entity';
import { MarketplaceSavedController } from './marketplace-saved.controller';
import { MarketplaceSavedService } from './marketplace-saved.service';

@Module({
  controllers: [MarketplaceSavedController],
  providers: [MarketplaceSavedService],
  exports: [MarketplaceSavedService],
  imports: [TypeOrmModule.forFeature([Marketplace_Saved])],
})
export class MarketplaceSavedModule {}
