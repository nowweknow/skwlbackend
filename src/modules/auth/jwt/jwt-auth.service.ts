import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-auth.strategy';
import { InternalServerErrorException } from '@nestjs/common';

interface IUser {
  email: string;
  id: number;
}

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  createAccessToken(user) {
    const payload: JwtPayload = {
      id: user.id,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async verifyUser(accessToken: string): Promise<IUser> {
    try {
      const result = this.jwtService.verify(accessToken);
      return result;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
