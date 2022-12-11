import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-twitter';
import { authRedirectConstants, authStrategyConstants } from '../auth.constans';
import { IreturnTwitUser } from '../auth.types';

@Injectable()
export class TwitterGuard extends PassportStrategy(
  Strategy,
  authStrategyConstants.TWITTER,
) {
  constructor() {
    super({
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: process.env.BASIC_URL + authRedirectConstants.TWITTER,
      passReqToCallback: true,
      includeEmail: true,
      skipExtendedUserProfile: false,
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: string | Error | null, user?: IreturnTwitUser) => void,
  ) {
    const user = {
      id: profile.id,
      nick: profile.username,
      name: profile.displayName,
      accessToken,
    };

    done(null, user);
  }
}
