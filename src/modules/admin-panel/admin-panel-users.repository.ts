import {InternalServerErrorException, Logger} from '@nestjs/common';
import {EntityRepository, Repository, UpdateResult} from 'typeorm';
import {User} from '../entities/users.entity';
import {SHOW_ADMIN_PANEL_ERROR_TYPE} from './admin-panel.constants';

@EntityRepository(User)
export class AdminPanelUsersRepository extends Repository<User> {
    private logger = new Logger(AdminPanelUsersRepository.name);

    async getUsers(): Promise<User[]> {
        try {
            return await this.createQueryBuilder('user').orderBy('user.id', 'DESC').getMany();
        } catch (err) {
            this.logger.error(err.message);
            throw new InternalServerErrorException(err.message, SHOW_ADMIN_PANEL_ERROR_TYPE);
        }
    }

    async changeIsBlockedUser(idDto: { id: number} ): Promise<UpdateResult> {
        try {
            const {id} = idDto;
            const res = await this.createQueryBuilder('user').where("user.id = :id", { id: id }).getOne();
            const mutateUser = {
                ...res,
                is_blocked: !res.is_blocked
            };
            return this.update(id, {...mutateUser});
        } catch (err) {
            this.logger.error(err.message);
            throw new InternalServerErrorException(err.message, SHOW_ADMIN_PANEL_ERROR_TYPE);
        }
    }
}
