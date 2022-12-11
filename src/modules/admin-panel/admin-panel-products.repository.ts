import {InternalServerErrorException, Logger} from '@nestjs/common';
import { EntityRepository, Repository, UpdateResult} from 'typeorm';
import {Video} from '../entities/videos.entity';
import {SHOW_ADMIN_PANEL_ERROR_TYPE} from './admin-panel.constants';

@EntityRepository(Video)
export class AdminPanelProductsRepository extends Repository<Video> {
    private logger = new Logger(AdminPanelProductsRepository.name);

    async getProducts(): Promise<Video[]> {
        try {
            return await this.createQueryBuilder('video').orderBy('video.id', 'DESC').getMany();
        } catch (err) {
            this.logger.error(err.message);
            throw new InternalServerErrorException(err.message, SHOW_ADMIN_PANEL_ERROR_TYPE);
        }
    }

    async changeIsAdvertised(idDto: { id: number }): Promise<UpdateResult> {
        try {
            const {id} = idDto;
            const res = await this.createQueryBuilder('video').where('video.id = :id', {id: id}).getOne();
            const mutateUser = {
                ...res,
                isTranding: !res.isTranding
            };
            return this.update(id, {...mutateUser});
        } catch (err) {
            this.logger.error(err.message);
            throw new InternalServerErrorException(err.message, SHOW_ADMIN_PANEL_ERROR_TYPE);
        }
    }
}
