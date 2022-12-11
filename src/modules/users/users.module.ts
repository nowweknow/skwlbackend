import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/entities/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepository } from './users.repository';
import { FilesService } from '../files/files.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, FilesService],
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([User,  UserRepository])],
})
export class UsersModule {}
