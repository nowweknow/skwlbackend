import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../entities/comment.entity';
import { NotificationModule } from '../notification/notification.module';
import { Notification } from '../entities/notifications.entity';
import { Video } from '../entities/videos.entity';
import { MarketPlace } from '../entities/marketplace.entity';
import { VideoModule } from '../video/video.module';
import { MarketplaceModule } from '../marketplace/marketplace.module';
@Module({
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
  imports: [
    NotificationModule,
    CommentModule,
    VideoModule,
    MarketplaceModule,
    TypeOrmModule.forFeature([Comment, Notification, Video, MarketPlace]),
  ]
})
export class CommentModule { }
