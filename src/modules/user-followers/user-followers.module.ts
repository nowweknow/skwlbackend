import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User_Followers } from 'src/modules/entities/user_followers.entity';
import { UserFollowersController } from './user-followers.controller';
import { UserFollowersService } from './user-followers.service';
import { NotificationModule } from '../notification/notification.module';
import { Notification } from '../entities/notifications.entity';
@Module({
  controllers: [UserFollowersController],
  providers: [UserFollowersService],
  exports: [UserFollowersService],
  imports: [NotificationModule, TypeOrmModule.forFeature([User_Followers, Notification])],
})
export class UserFollowersModule {}
