import { Body, Controller, Delete, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MarketplaceService } from './marketplace.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.quard';
import { MarketPlace } from '../entities/marketplace.entity';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { JwtPayload } from '../auth/jwt/jwt-auth.strategy';
import { CreateProductDto, MarketDto, SearchDto } from './marketplace.dto';
import { CREATED_PRODUCT_SUCCESS, DELETED_PRODUCT_SUCCESS, FIND_PRODUCTS_BY_TITLE_SUCCESS, FIND_PRODUCT_SUCCESS } from './marketplace.constants';

@ApiTags('marketplace')
@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketService: MarketplaceService) {}

  @ApiResponse({
    status: 200,
    description: 'Get all products.',
    type: [MarketPlace],
  })
  @Get('list')
  getMarketList(): Promise<MarketPlace[]> {
    return this.marketService.getMarketList();
  }
  @ApiResponse({
    status: 200,
    description: 'Get all products.',
    type: [MarketPlace],
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('auth/list')
  getMarketListAuth(@GetUser() user: JwtPayload): Promise<MarketPlace[]> {
    return this.marketService.getMarketListAuth(user.id);
  }

  @ApiResponse({
    status: 201,
    description: FIND_PRODUCTS_BY_TITLE_SUCCESS,
    type: [MarketPlace],
  })
  @Post('search')
  sreachProductByTitle(@Body() dto: SearchDto): Promise<MarketPlace[]> {
    return this.marketService.sreachProductByTitle(dto.title);
  }

  @ApiResponse({
    status: 200,
    description: FIND_PRODUCTS_BY_TITLE_SUCCESS,
    type: [MarketPlace],
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('auth/search')
  searchProductByTitleAuth(@GetUser() user: JwtPayload, @Body() dto: SearchDto): Promise<MarketPlace[]> {
    return this.marketService.searchProductByTitleAuth(user.id, dto.title);
  }

  @ApiResponse({
    status: 200,
    description: FIND_PRODUCT_SUCCESS,
    type: MarketPlace,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('auth/find')
  async getOneVideo(@GetUser() user: JwtPayload, @Body() dto: MarketDto): Promise<MarketPlace> {
    return this.marketService.getOneVideo(user.id, dto.marketplaceId);
  }
  @ApiResponse({
    status: 200,
    description: FIND_PRODUCT_SUCCESS,
    type: MarketPlace,
  })
  @Post('find')
  async findOneVideo(@Body() dto: MarketDto): Promise<MarketPlace> {
    return this.marketService.findOneVideo(dto.marketplaceId);
  }

  async uploadedFile(
    @GetUser() user: JwtPayload,
    @Body() dto,
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<{
    message: string;
  }> {
    return await this.marketService.created(user.id, dto, file);
  }

  @ApiResponse({
    status: 201,
    description: CREATED_PRODUCT_SUCCESS,
    type: String,
  })
  @Post('create')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image_link'))
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createProduct(@GetUser() user: JwtPayload, @Body() dto: CreateProductDto, @UploadedFile() file: Express.Multer.File) {
    return this.marketService.createdProduct(user.id, dto, file);
  }

  @ApiResponse({
    status: 200,
    description: DELETED_PRODUCT_SUCCESS,
    type: MarketPlace,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('delete')
  async deleteVideo(
    @GetUser() user: JwtPayload,
    @Body() dto: MarketDto,
  ): Promise<{
    message: string;
  }> {
    return this.marketService.deleteProductById(user.id, dto.marketplaceId);
  }
}
