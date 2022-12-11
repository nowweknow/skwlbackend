import { Strategy } from 'passport-apple';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('APPLE_BUNDEL_ID'),
      teamID: configService.get<string>('APPLE_TEAM_ID'),
      callbackURL: 'https://api-stage.nowuknow.link/auth/apple',
      keyID: configService.get<string>('APPLE_KEY_IDENTIFIER'),
    });
  }

  async validate(accessToken: string, refreshToken: string, profile, done) {
    const user = {
      accessToken,
      refreshToken,
      ...profile,
    };
    return done(null, user);
  }
}
