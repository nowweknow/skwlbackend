import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { SHOW_ADMIN_PANEL_ERROR_TYPE } from './admin-panel.constants';
import { Admin } from '../entities/admin.entity';

@EntityRepository(Admin)
export class AdminPanelRepository extends Repository<Admin> {
  private logger = new Logger(AdminPanelRepository.name);

  async signInAdmin(signInDto): Promise<{ id: number; login: string }> {
    try {
      const { login, password } = signInDto;
      const admin = await this.createQueryBuilder('admin').where('admin.login=:login', { login }).andWhere('admin.password=:password', { password }).getOne();
      if (admin) {
        return admin;
      }
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message, SHOW_ADMIN_PANEL_ERROR_TYPE);
    }
  }
}
