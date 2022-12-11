import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminPanelController } from './admin-panel.controller';
import {AdminPanelService} from './admin-panel.service';
import {User} from '../entities/users.entity';
import {AdminPanelUsersRepository} from './admin-panel-users.repository';
import {AdminPanelProductsRepository} from './admin-panel-products.repository';
import {AdminPanelRepository} from './admin-panel.repository';
import {JwtAuthModule} from '../auth/jwt/jwt-auth.module';

@Module({
    controllers: [AdminPanelController],
    providers: [AdminPanelService],
    exports: [AdminPanelService],
    imports: [TypeOrmModule.forFeature([User,  AdminPanelUsersRepository,  AdminPanelProductsRepository , AdminPanelRepository]),JwtAuthModule],
})
export class AdminPanelModule {}
