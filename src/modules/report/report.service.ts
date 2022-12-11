import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export default class SmtpService {
  constructor(private readonly mailerService: MailerService) {}

  public sendtoClient(text: string): void {
    this.mailerService
      .sendMail({
        to: process.env.CLIENT_EMAIL,
        from: process.env.APP_EMAIL,
        subject: 'User report',
        text,
      })
      .then(() => {
        Logger.log('Mail sent');
      })
      .catch((err) => {
        Logger.error(err);
      });
  }
}
