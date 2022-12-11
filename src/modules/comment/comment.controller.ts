import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/index';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.quard';
import { GetUser } from '../../shared/decorators/get-user.decorator';
import { JwtPayload } from '../auth/jwt/jwt-auth.strategy';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { Comment } from '../entities/comment.entity';

@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiResponse({
    status: 200,
    description: 'Create comment.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@GetUser() user: JwtPayload, @Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Find all comments for video.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/:postId/:postType')
  findAll(@GetUser() user: JwtPayload, @Param('postId') postId: number, @Param('postType') postType: string): Promise<Comment[]> {
    return this.commentService.findAll(postId, postType);
  }

  @ApiResponse({
    status: 200,
    description: 'Update comment.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto): Promise<Comment> {
    return this.commentService.update(+id, updateCommentDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Delete comment.',
  })
  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.commentService.remove(+id);
  }
}
