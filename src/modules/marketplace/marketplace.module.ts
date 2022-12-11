import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketPlace } from 'src/modules/entities/marketplace.entity';
import { FilesService } from '../files/files.service';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';

@Module({
  controllers: [MarketplaceController],
  providers: [MarketplaceService, FilesService],
  exports: [MarketplaceService],
  imports: [TypeOrmModule.forFeature([MarketPlace])],
})
export class MarketplaceModule {}
