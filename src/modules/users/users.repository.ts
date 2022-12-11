import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from '../entities/users.entity';
import { ICreateUserDTO, IReturnUser } from './users.types';
import { GET_RECOMMENDED_USERS_ERROR_TYPE, GET_USER_PROFILE_ERROR_TYPE, GET_USER_PROFILE_ERROR, USER_CREATE_ERROR, USER_CREATE_ERROR_TYPE } from './user.contstants';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private logger = new Logger(User.name);

  async getUserProfile(id: number): Promise<User> {
    try {
      return await this.createQueryBuilder('user')
        .where('user.id = :id', { id })
        .leftJoinAndSelect('user.videos', 'videos')
        .leftJoinAndSelect('user.marketplaces', 'marketplace')
        .leftJoinAndSelect('user.followers', 'followers')
        .leftJoinAndSelect('user.following', 'following')
        .loadRelationCountAndMap('user.marketplaceCount', 'user.marketplaces')
        .loadRelationCountAndMap('user.videosCount', 'user.videos')
        .loadRelationCountAndMap('user.followersCount', 'user.followers')
        .loadRelationCountAndMap('user.followingCount', 'user.following')
        .orderBy('videos.created_at', 'DESC')
        .addOrderBy('marketplace.created_at', 'DESC')
        .getOne();
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message, GET_USER_PROFILE_ERROR_TYPE);
    }
  }

  async createUser(dto: ICreateUserDTO): Promise<IReturnUser> {
    try {
      const newUser = this.create(dto);
      const saveUser = await this.save(newUser);
      return saveUser;
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(USER_CREATE_ERROR, USER_CREATE_ERROR_TYPE);
    }
  }

  async findOneForEmail(email: string) {
    try {
      return await this.createQueryBuilder('user').where('user.email=:email', { email }).getOne();
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(USER_CREATE_ERROR, USER_CREATE_ERROR_TYPE);
    }
  }

  async findOneForPhone(phone: string) {
    try {
      return await this.createQueryBuilder('user').where('user.phone=:phone', { phone }).getOne();
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(USER_CREATE_ERROR, USER_CREATE_ERROR_TYPE);
    }
  }

  async checkUser(email: string): Promise<void | User> {
    try {
      return await this.createQueryBuilder('user').where('user.email=:email', { email }).getOne();
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(USER_CREATE_ERROR, USER_CREATE_ERROR_TYPE);
    }
  }

  async getRecommendedUsers(): Promise<User[]> {
    try {
      return await this.createQueryBuilder('user').addOrderBy('user.plan_end_date', 'DESC').getMany();
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message, GET_RECOMMENDED_USERS_ERROR_TYPE);
    }
  }

  async getRecommendedAuthUsers(userId: number): Promise<User[]> {
    try {
      return await this.createQueryBuilder('user')
        .leftJoinAndSelect('user.followers', 'followers', 'followers.followerId =:followerId', { followerId: userId })
        .where('followers.followerId IS Null')
        .addOrderBy('user.plan_end_date', 'DESC')
        .getMany();
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message, GET_RECOMMENDED_USERS_ERROR_TYPE);
    }
  }

  async findOneForEmailAndUId(email, user_id): Promise<User> {
    try {
      return await this.createQueryBuilder('user').where('user.email=:email', { email }).andWhere('user.user_id=:user_id', { user_id }).getOne();
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(USER_CREATE_ERROR, USER_CREATE_ERROR_TYPE);
    }
  }

  async findOneById(id: number): Promise<User> {
    try {
      return await this.createQueryBuilder('user').where('user.id=:id', { id }).getOne();
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(`user by id ${id} doesn't exist!`, GET_USER_PROFILE_ERROR_TYPE);
    }
  }
}
