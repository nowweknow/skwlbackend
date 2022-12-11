import { Module } from '@nestjs/common';
import SmtpService from './report.service';
import { SmtpController } from './report.controller';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        ignoreTLS: true,
        secure: true,
        auth: {
          user: process.env.APP_EMAIL,
          pass: process.env.APP_EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
        defaults: {
          from: '"No Reply" <noreply@example.com>',
        },
      },
    }),
  ],
  controllers: [SmtpController],
  providers: [SmtpService],
})
export class SmtpModule {}
