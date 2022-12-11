import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICreateUserDTO, IReturnUser } from './users.types';
import { User } from '../entities/users.entity';
import { UserRepository } from './users.repository';
import { USER_NOT_FOUND_ERROR, USER_UPDATE_ERROR, USER_UPDATE_ERROR_TYPE } from './user.contstants';
import { S3FoldersEnum } from 'src/shared/enums/S3Folders.enum';
import { FilesService } from '../files/files.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private fileService: FilesService,
  ) {}

  async checkUser(email: string) {
    return await this.checkUser(email);
  }

  async createUser(dto: ICreateUserDTO): Promise<IReturnUser> {
    return await this.userRepository.createUser(dto);
  }

  async updateUser(userId: number, options) {
    const user = await this.userRepository.findOne({ id: userId });
    user.plan_end_date = new Date(options.plan_end_date);
    user.is_blocked = options.is_blocked;
    user.plan = options.plan;
    try {
      return await this.userRepository.save(user);
    } catch (e) {
      throw new InternalServerErrorException(USER_UPDATE_ERROR, USER_UPDATE_ERROR_TYPE);
    }
  }

  async updateUserUsername(userId: number, username: string): Promise<User> {
    await this.userRepository.update(userId, { username });
    return await this.userRepository.findOneById(userId);
  }

  async getUserProfile(id: number): Promise<User> {
    return await this.userRepository.getUserProfile(id);
  }

  async findOneForEmail(email: string) {
    return await this.userRepository.findOneForEmail(email);
  }

  async findOneForPhone(phone: string) {
    return await this.userRepository.findOneForPhone(phone);
  }

  async updateUserProfile(
    userId: number,
    dto,
    avatar: Express.Multer.File,
    background_image: Express.Multer.File,
  ): Promise<{
    message: string;
  }> {
    const user = await this.userRepository.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }

    if (avatar) {
      const image = await this.fileService.uploadFile(avatar.buffer, avatar.originalname, avatar.mimetype, S3FoldersEnum.AVATARS);

      dto.avatar = image.Location;
    }
    if (background_image) {
      const image = await this.fileService.uploadFile(background_image.buffer, background_image.originalname, background_image.mimetype, S3FoldersEnum.BACKGROUND_IMAGES);

      dto.background_image = image.Location;
    }

    try {
      await this.userRepository.update(userId, { ...dto });
      return { message: 'Updated user is success' };
    } catch (err) {
      throw new InternalServerErrorException(USER_UPDATE_ERROR, USER_UPDATE_ERROR_TYPE);
    }
  }

  async getRecommendedUsers(): Promise<User[]> {
    return this.userRepository.getRecommendedUsers();
  }

  async getRecommendedAuthUsers(userId: number): Promise<User[]> {
    return this.userRepository.getRecommendedAuthUsers(userId);
  }

  async findOneForEmailAndUId(email: string, user_id: string): Promise<User> {
    return this.userRepository.findOneForEmailAndUId(email, user_id);
  }

  async findUserById(id: number): Promise<User> {
    return this.userRepository.findOneById(id);
  }
}
