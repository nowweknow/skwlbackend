import { Module } from '@nestjs/common';
import { UserPhoneService } from './user-phone.service';
import { UserPhoneController } from './user-phone.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { UsersModule } from '../users/users.module';
import { UserPhone } from '../entities/unverified_users.entity';
import { TwilioModule } from 'nestjs-twilio';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { JwtAuthModule } from '../auth/jwt/jwt-auth.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [UserPhoneController],
  providers: [UserPhoneService],
  imports: [
    UsersModule,
    JwtAuthModule,
    AuthModule,
    TypeOrmModule.forFeature([User, UserPhone]),
    TwilioModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (cfg: ConfigService) => ({
        accountSid: cfg.get('TWILIO_ACCOUNT_SID'),
        authToken: cfg.get('TWILIO_AUTH_TOKEN'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class UserPhoneModule {}
