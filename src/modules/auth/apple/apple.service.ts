import { Injectable, ForbiddenException } from '@nestjs/common';
import * as appleSignin from 'apple-signin';
import { UsersService } from '../../users/users.service';
import { JwtAuthService } from '../../auth/jwt/jwt-auth.service';
import { AppleAuthDto } from '../dto/apple.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AppleService {
  constructor(private readonly usersService: UsersService, private jwtAuthService: JwtAuthService) {}

  public async verifyUser(payload: AppleAuthDto): Promise<any> {
    try {
      // const data = await appleSignin.verifyIdToken(payload.id_token, 'com.skwl.mobile');
      const data: any = jwt.decode(payload.id_token);

      console.log('data', data);
      if (!data?.email) {
        throw new ForbiddenException("Can't login");
      }
      let user: any = await this.usersService.findOneForEmail(data.email);

      if (!user) {
        user = await this.usersService.createUser({
          email: data.email,
        });
      }
      const token = await this.jwtAuthService.createAccessToken(user);

      return token;
    } catch (error) {
      console.log(error);
      throw new ForbiddenException();
    }
  }
}
