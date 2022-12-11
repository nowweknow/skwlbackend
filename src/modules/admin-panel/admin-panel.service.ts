import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { Video } from '../entities/videos.entity';
import { AdminPanelUsersRepository } from './admin-panel-users.repository';
import { AdminPanelProductsRepository } from './admin-panel-products.repository';
import { AdminPanelRepository } from './admin-panel.repository';
import { JwtAuthAdminService } from '../auth/jwt/jwt-auth-admin.service';
import { UpdateResult } from 'typeorm';

@Injectable()
export class AdminPanelService {
  constructor(
    @InjectRepository(AdminPanelUsersRepository)
    private readonly adminPanelUsersRepository: AdminPanelUsersRepository,
    private readonly adminPanelProductsRepository: AdminPanelProductsRepository,
    private readonly adminPanelRepository: AdminPanelRepository,
    private readonly jwtAdminService: JwtAuthAdminService,
  ) {}

  async getUsers(): Promise<User[]> {
    return await this.adminPanelUsersRepository.getUsers();
  }

  async changeIsBlockedUser(idDto): Promise<UpdateResult> {
    return await this.adminPanelUsersRepository.changeIsBlockedUser(idDto);
  }

  async getProducts(): Promise<Video[]> {
    return await this.adminPanelProductsRepository.getProducts();
  }

  async changeIsAdvertised(idDto): Promise<UpdateResult> {
    return await this.adminPanelProductsRepository.changeIsAdvertised(idDto);
  }

  async signInAdmin(signInDto): Promise<string> {
    const admin = await this.adminPanelRepository.signInAdmin(signInDto);
    const payload: { login: string; id: number } = {
      login: admin.login,
      id: admin.id,
    };
    const { accessToken } = this.jwtAdminService.login(payload);
    return accessToken;
  }
}
