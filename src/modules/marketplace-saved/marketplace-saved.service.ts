import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Marketplace_Saved } from '../entities/marketplace_saved.entity';
import { MarketplaceDto } from './marketplace-saved.dto';
import { GET_SAVED_PRODUCTS_ERROR_TYPE, SAVED_PRODUCT_WITH_USER_NOT_FOUND_ERROR } from './marketplace-saved.constants';

@Injectable()
export class MarketplaceSavedService {
  private readonly logger = new Logger(MarketplaceSavedService.name);

  constructor(
    @InjectRepository(Marketplace_Saved)
    private marketSavedRepository: Repository<Marketplace_Saved>,
  ) {}

  async getSavedProductsList(userId: number): Promise<Marketplace_Saved[]> {
    try {
      return await this.getSavedProducts(userId);
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(e.message, GET_SAVED_PRODUCTS_ERROR_TYPE);
    }
  }

  async getSavedProducts(userId: number): Promise<Marketplace_Saved[]> {
    try {
      return await this.marketSavedRepository
        .createQueryBuilder('marketplace_saved')
        .leftJoinAndSelect('marketplace_saved.marketplace', 'marketplace')
        .leftJoinAndSelect('marketplace.user', 'user')
        .where('marketplace_saved.userId =:userId', { userId })
        .andWhere('marketplace.status =:status', { status: 'published' })
        .orderBy('marketplace.created_at', 'DESC')
        .getMany();
    } catch (e) {
      this.logger.error(e.message);
      throw new InternalServerErrorException(e.message, GET_SAVED_PRODUCTS_ERROR_TYPE);
    }
  }
  async findByIdUser(userId: number): Promise<void> {
    try {
      await this.marketSavedRepository.createQueryBuilder('marketplace_saved').where('marketplace_saved.userId =:userId', { userId }).getOneOrFail();
    } catch (e) {
      this.logger.error(e.message);
      throw new NotFoundException(e.message, SAVED_PRODUCT_WITH_USER_NOT_FOUND_ERROR);
    }
  }
  async toggleSavedProduct(userId: number, marketplaceId: number): Promise<MarketplaceDto> {
    try {
      const check = await this.findSavedProduct(userId, marketplaceId);

      if (!check) {
        await this.createSavedProducts(userId, marketplaceId);

        return await this.findSavedProduct(userId, marketplaceId);
      }

      await this.deleteSavedProducts(userId, marketplaceId);
      check.id = null;
      return check;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
  async deleteSavedProducts(userId: number, marketplaceId: number): Promise<void> {
    try {
      await this.marketSavedRepository
        .createQueryBuilder('marketplace_saved')
        .where('marketplace_saved.userId =:userId', { userId })
        .andWhere('marketplace_saved.marketplaceId =:marketplaceId', { marketplaceId })
        .delete()
        .execute();
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException(e.message, HttpStatus.CONFLICT);
    }
  }

  async createSavedProducts(userId, marketplaceId): Promise<void> {
    try {
      const newProduct = await this.marketSavedRepository.create({
        user: userId,
        marketplace: marketplaceId,
      });

      await this.marketSavedRepository.save(newProduct);
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message);
    }
  }
  async findSavedProduct(userId: number, marketplaceId: number): Promise<MarketplaceDto> {
    try {
      return await this.marketSavedRepository
        .createQueryBuilder('marketplace_saved')
        .where('marketplace_saved.userId=:userId', { userId })
        .andWhere('marketplace_saved.marketplaceId=:marketplaceId', { marketplaceId })
        .select(['marketplace_saved.userId as userId', 'marketplace_saved.marketplaceId as marketplaceId', 'marketplace_saved.id as id'])
        .getRawOne();
    } catch (err) {
      this.logger.error(err.message);
      throw new NotFoundException(err.message, SAVED_PRODUCT_WITH_USER_NOT_FOUND_ERROR);
    }
  }
}
