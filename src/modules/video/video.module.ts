import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from 'src/modules/entities/videos.entity';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { VideoRepository } from './video.repository';
import { FilesService } from '../files/files.service';

@Module({
  controllers: [VideoController],
  providers: [VideoService, FilesService],
  exports: [VideoService],
  imports: [TypeOrmModule.forFeature([Video,  VideoRepository])],
})
export class VideoModule {}
