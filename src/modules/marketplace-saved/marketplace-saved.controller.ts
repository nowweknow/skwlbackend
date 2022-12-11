import { Body, Controller, Delete, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.quard';
import { JwtPayload } from '../auth/jwt/jwt-auth.strategy';
import { Marketplace_Saved } from '../entities/marketplace_saved.entity';
import { DELETE_SAVED_PRODUCT_SUCCESS, GET_SAVED_PRODUCTS_SUCCESS, UPDATE_PRODUCT_SUCCESS } from './marketplace-saved.constants';
import { MarketDto, MarketplaceDto } from './marketplace-saved.dto';
import { MarketplaceSavedService } from './marketplace-saved.service';
import { IMarketplace } from './marketplace-saved.types';

@ApiTags('marketplace-saved')
@Controller('marketplace-saved')
export class MarketplaceSavedController {
  constructor(private readonly marketSavedService: MarketplaceSavedService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: GET_SAVED_PRODUCTS_SUCCESS,
    type: [Marketplace_Saved],
  })
  @Get('products')
  getSavedProductList(@GetUser() user: JwtPayload): Promise<Marketplace_Saved[]> {
    return this.marketSavedService.getSavedProductsList(user.id);
  }

  @ApiResponse({
    status: 200,
    description: DELETE_SAVED_PRODUCT_SUCCESS,
    type: String,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('delete')
  async deleteSavedProduct(@GetUser() user: JwtPayload, @Body() dto: IMarketplace): Promise<void> {
    return this.marketSavedService.deleteSavedProducts(user.id, dto.marketplaceId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: UPDATE_PRODUCT_SUCCESS,
    type: MarketplaceDto,
  })
  @Patch('update')
  async toggleSavedProduct(@GetUser() user: JwtPayload, @Body() dto: MarketDto): Promise<MarketplaceDto> {
    return this.marketSavedService.toggleSavedProduct(user.id, dto.marketplaceId);
  }
}
