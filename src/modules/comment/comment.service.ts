import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../entities/comment.entity';
import { Repository } from 'typeorm';
import { NotificationService } from '../notification/notification.service';
import { notifications_types } from '../entities/notifications.entity';
import { VideoService } from '../video/video.service';
import { MarketplaceService } from '../marketplace/marketplace.service';
import { DeleteResult } from 'typeorm';
import { VIDEO, PRODUCT } from './constants';
@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private readonly commentService: Repository<Comment>,
    private readonly notificationService: NotificationService,
    private readonly videoService: VideoService,
    private readonly marketplaceService: MarketplaceService,
  ) {}

  async createNotificationBody(body) {
    let post;
    if (body.postType == VIDEO) {
      post = await this.videoService.findById(body.postId);
    } else if (body.postType == PRODUCT) {
      post = await this.marketplaceService.findProductByMarketPlaceId(body.postId);
    }

    const notificationBody = {
      type: notifications_types.COMMENTS,
      userId: post.userId,
      message: body.content,
      eventId: body.id,
      parentId: null,
    };
    return notificationBody;
  }

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentService.create(createCommentDto);
    const result = await this.commentService.save(comment);

    const notificationBody = await this.createNotificationBody(result);
    await this.notificationService.createNotification(notificationBody);
    return result;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const updatedCommentBody = { ...updateCommentDto, id };
    const updatedComment = await this.commentService.save(updatedCommentBody);

    const notificationBody = await this.createNotificationBody(updatedComment);
    await this.notificationService.updateNotification(notificationBody);
    return updatedComment;
  }

  async findAll(postId: number, postType: string): Promise<Comment[]> {
    return this.commentService.find({ where: { postType, postId } });
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.commentService.delete(id);
  }
}
