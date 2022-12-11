import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MarketPlace } from 'src/modules/entities/marketplace.entity';
import { S3FoldersEnum } from 'src/shared/enums/S3Folders.enum';
import { DeleteResult, Repository } from 'typeorm';
import { FilesService } from '../files/files.service';
import {
  CREATED_PRODUCT_ERROR_TYPE,
  DELETED_PRODUCT_ERROR_TYPE,
  DELETED_PRODUCT_SUCCESS,
  FIND_PRODUCT_ERROR_TYPE,
  SAVE_IMAGE_ERROR_TYPE,
  SEARCH_PRODUCT_BY_TITLE_ERROR_TYPE,
} from './marketplace.constants';
import { CreateProductDto } from './marketplace.types';

@Injectable()
export class MarketplaceService {
  private readonly logger = new Logger(MarketplaceService.name);

  constructor(
    @InjectRepository(MarketPlace)
    private marketRepository: Repository<MarketPlace>,
    private fileService: FilesService,
  ) {}

  async getMarketList(): Promise<MarketPlace[]> {
    try {
      const marketList = await this.marketRepository.createQueryBuilder('market_place').leftJoinAndSelect('market_place.user', 'user').addOrderBy('market_place.created_at', 'DESC').getMany();

      return marketList;
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message);
    }
  }
  async getMarketListAuth(userId: number): Promise<MarketPlace[]> {
    try {
      const marketList = await this.marketRepository
        .createQueryBuilder('market_place')
        .leftJoinAndSelect('market_place.user', 'user')
        .leftJoinAndSelect('market_place.marketplace_saved', 'marketplace_saved', 'marketplace_saved.userId = :userId', { userId })
        .addOrderBy('market_place.created_at', 'DESC')
        .getMany();

      return marketList;
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message);
    }
  }

  async sreachProductByTitle(title: string): Promise<MarketPlace[]> {
    try {
      return await this.marketRepository
        .createQueryBuilder('market_place')
        .leftJoinAndSelect('market_place.user', 'user')
        .where('market_place.title like :name', { name: `%${title}%` })
        .addOrderBy('market_place.created_at', 'DESC')
        .getMany();
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message, SEARCH_PRODUCT_BY_TITLE_ERROR_TYPE);
    }
  }

  async searchProductByTitleAuth(userId: number, title: string): Promise<MarketPlace[]> {
    try {
      return await this.marketRepository
        .createQueryBuilder('market_place')
        .leftJoinAndSelect('market_place.user', 'user')
        .where('market_place.title like :name', { name: `%${title}%` })
        .leftJoinAndSelect('market_place.marketplace_saved', 'marketplace_saved', 'marketplace_saved.userId = :userId', { userId })
        .addOrderBy('market_place.created_at', 'DESC')
        .getMany();
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message, SEARCH_PRODUCT_BY_TITLE_ERROR_TYPE);
    }
  }

  async createdProduct(
    userId: number,
    dto: CreateProductDto,
    file: Express.Multer.File,
  ): Promise<{
    message: string;
  }> {
    const image = await this.fileService.uploadFile(file.buffer, file.originalname, file.mimetype, S3FoldersEnum.MARKET_PLACE);
    try {
      return await this.createProduct(userId, image.Location, dto);
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message, CREATED_PRODUCT_ERROR_TYPE);
    }
  }

  async created(
    userId: number,
    dto: CreateProductDto,
    file: Express.Multer.File,
  ): Promise<{
    message: string;
  }> {
    try {
      return await this.createProduct(userId, file.filename, dto);
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message, CREATED_PRODUCT_ERROR_TYPE);
    }
  }

  async createProduct(
    userId: number,
    image_link: string,
    options: CreateProductDto,
  ): Promise<{
    message: string;
  }> {
    try {
      const newProduct = this.marketRepository.create({ ...options, image_link, userId });
      await this.marketRepository.save(newProduct);
      return { message: 'Prosuct created success' };
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(e.message, CREATED_PRODUCT_ERROR_TYPE);
    }
  }
  async getOneVideo(userId: number, marketplaceId: number): Promise<MarketPlace> {
    try {
      return await this.marketRepository
        .createQueryBuilder('market_place')
        .leftJoinAndSelect('market_place.user', 'user')
        .leftJoinAndSelect('market_place.marketplace_saved', 'marketplace_saved', 'marketplace_saved.userId = :userId', { userId })
        .leftJoinAndSelect('user.followers', 'followers', 'followers.followerId = :followerId', { followerId: userId })
        .where('market_place.id=:id', { id: marketplaceId })
        .getOneOrFail();
    } catch (e) {
      this.logger.error(e.message);
      throw new NotFoundException(e.message, FIND_PRODUCT_ERROR_TYPE);
    }
  }

  async findOneVideo(marketplaceId: number): Promise<MarketPlace> {
    try {
      return await this.marketRepository.createQueryBuilder('market_place').leftJoinAndSelect('market_place.user', 'user').where('market_place.id=:id', { id: marketplaceId }).getOneOrFail();
    } catch (e) {
      this.logger.error(e.message);
      throw new NotFoundException(e.message, FIND_PRODUCT_ERROR_TYPE);
    }
  }

  async sendImage(file: string, res): Promise<string> {
    try {
      return res.sendFile(file, { root: './public/marketplace' });
    } catch (e) {
      this.logger.error(e.message);
      throw new NotFoundException(e.message, SAVE_IMAGE_ERROR_TYPE);
    }
  }

  async deleteProductById(
    userId: number,
    marketplaceId: number,
  ): Promise<{
    message: string;
  }> {
    await this.findProductById(userId, marketplaceId);
    try {
      await this.deleteProduct(userId, marketplaceId);
      return { message: DELETED_PRODUCT_SUCCESS };
    } catch (err) {
      this.logger.error(err.message);
      throw new BadRequestException(err.message, DELETED_PRODUCT_ERROR_TYPE);
    }
  }

  async findProductById(userId: number, marketplaceId: number): Promise<MarketPlace> {
    try {
      return await this.marketRepository.createQueryBuilder('market_place').where('market_place.id=:id', { id: marketplaceId }).andWhere('market_place.userId=:userId', { userId }).getOneOrFail();
    } catch (err) {
      this.logger.error(err.message);
      throw new NotFoundException(err.message, FIND_PRODUCT_ERROR_TYPE);
    }
  }

  async findProductByMarketPlaceId(marketplaceId: number): Promise<MarketPlace> {
    try {
      return await this.marketRepository.createQueryBuilder('market_place').where('market_place.id=:id', { id: marketplaceId }).getOneOrFail();
    } catch (err) {
      this.logger.error(err.message);
      throw new NotFoundException(err.message, FIND_PRODUCT_ERROR_TYPE);
    }
  }

  async deleteProduct(userId: number, marketplaceId: number): Promise<DeleteResult> {
    try {
      return await this.marketRepository
        .createQueryBuilder('market_place')
        .where('market_place.id =:id', { id: marketplaceId })
        .andWhere('market_place.userId =:userId', { userId: userId })
        .delete()
        .execute();
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException(e.message, HttpStatus.CONFLICT);
    }
  }
}
