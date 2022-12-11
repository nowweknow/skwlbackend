import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthAdminService {
  constructor(private jwtService: JwtService) {}

  public login(payload: any) {
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
