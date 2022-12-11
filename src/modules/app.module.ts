import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { VideoModule } from './video/video.module';
import { UserFollowersModule } from './user-followers/user-followers.module';
import { UserLikesModule } from './user-likes/user-likes.module';
import { TypeOrmConfigService } from '../config/database.config';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { validate } from '../config/env.validation';
import { MarketplaceSavedModule } from './marketplace-saved/marketplace-saved.module';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './messages/messages.module';
import { AdminPanelModule } from './admin-panel/admin-panel.module';
import { SmtpModule } from './report/report.module';
import { PaymentModule } from './payment/payment.module';
import { UserIsBlockedMiddleware } from '../middlewares/userIsBlocked.middleware';
import { JwtAuthModule } from './auth/jwt/jwt-auth.module';
import { NotificationModule } from './notification/notification.module';
import { CommentModule } from './comment/comment.module';
import { UserDeviceModule } from './user-device/user-device.module';
import { NotificationSettingsModule } from './notification-settings/notification-settings.module';
import { ChatroomModule } from './chatroom/chatroom.module';
import { UserPhoneModule } from './user-phone/user-phone.module';
console.log('fix typeorm');
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    UsersModule,
    AuthModule,
    VideoModule,
    UserFollowersModule,
    UserLikesModule,
    MarketplaceModule,
    MarketplaceSavedModule,
    ChatsModule,
    MessagesModule,
    AdminPanelModule,
    SmtpModule,
    PaymentModule,
    JwtAuthModule,
    NotificationModule,
    CommentModule,
    UserDeviceModule,
    NotificationSettingsModule,
    ChatroomModule,
    UserPhoneModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserIsBlockedMiddleware)
      .forRoutes({ path: '/chats', method: RequestMethod.GET }, { path: '/video', method: RequestMethod.POST }, { path: '/marketplace/create', method: RequestMethod.POST });
  }
}
