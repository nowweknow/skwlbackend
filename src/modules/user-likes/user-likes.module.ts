import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Videos_Likes } from 'src/modules/entities/videos_likes.entity';
import { VideoModule } from 'src/modules/video/video.module';
import { NotificationModule } from '../notification/notification.module';
import { UserLikesController } from './user-likes.controller';
import { UserLikesService } from './user-likes.service';
import { Notification } from '../entities/notifications.entity';

@Module({
  controllers: [UserLikesController],
  providers: [UserLikesService],
  exports: [UserLikesService],
  imports: [TypeOrmModule.forFeature([Videos_Likes, Notification]), VideoModule, NotificationModule],
})
export class UserLikesModule {}
