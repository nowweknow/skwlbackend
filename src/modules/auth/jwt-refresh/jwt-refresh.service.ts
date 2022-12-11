/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-refresh.strategy';
import { ConfigService } from '@nestjs/config';
import { JwtAuthService } from '../jwt/jwt-auth.service';

interface IUser {
	email: string;
	id: number;
}

@Injectable()
export class JwtRefreshService {
	constructor(private jwtService: JwtService, private configService: ConfigService, private jwtAuthService: JwtAuthService) {}

	createRefreshToken(user: IUser) {
		const payload: JwtPayload = {
			email: user.email,
			id: user.id,
		};

		return {
			refreshToken: this.jwtService.sign(payload),
		};
	}

	verifyToken(refreshToken: string) {
		const user = this.jwtService.verify(refreshToken, this.configService.get('JWT_REFRESH_SECRET'));

		return this.jwtAuthService.createAccessToken(user);
	}
}
