import { Module } from '@nestjs/common';
import { UsersModule } from 'src/modules/users/users.module';
import { UserRepository } from '../users/users.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FacebookStrategy } from './facebook/facebook.strategy';
import { GoogleStrategy } from './google/google.strategy';
import { JwtAuthModule } from './jwt/jwt-auth.module';
import { TwitterGuard } from './twitter/twitter.strategy';
import { JwtRefreshModule } from './jwt-refresh/jwt-refresh.module';
import { AppleService } from './apple/apple.service';

@Module({
  imports: [UsersModule, JwtAuthModule, UserRepository, JwtRefreshModule],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, FacebookStrategy, TwitterGuard, AppleService],
})
export class AuthModule {}
