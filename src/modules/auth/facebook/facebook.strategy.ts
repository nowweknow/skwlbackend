import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { authRedirectConstants, authStrategyConstants } from '../auth.constans';
import { IreturnUser } from '../auth.types';

@Injectable()
export class FacebookStrategy extends PassportStrategy(
  Strategy,
  authStrategyConstants.FACEBOOK,
) {
  constructor() {
    super({
      clientID: process.env.APP_ID,
      clientSecret: process.env.APP_SECRET,
      callbackURL: process.env.BASIC_URL + authRedirectConstants.FACEBOOK,
      scope: 'email',
      profileFields: ['emails', 'name'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (
      err: string | Error | null,
      user: IreturnUser,
      info?: string,
    ) => void,
  ): Promise<any> {
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
    };
    const payload = {
      user,
      accessToken,
    };

    done(null, payload);
  }
}
