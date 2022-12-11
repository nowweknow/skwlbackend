import {Injectable, NestMiddleware} from '@nestjs/common';
import {UsersService} from '../modules/users/users.service';
import {JwtService} from '@nestjs/jwt';
import {Request, Response} from "express";

@Injectable()
export class UserIsBlockedMiddleware implements NestMiddleware {
    constructor(private readonly usersService: UsersService, private jwtService: JwtService) {}
    async use(req: Request, res: Response, next: () => void): Promise<void> {
        const token = req.headers.authorization.split(" ")[1];
        const userFromToken = this.jwtService.verify(token);
        const {is_blocked} = await this.usersService.getUserProfile(userFromToken.id);
        if (is_blocked) {
            throw new Error("User is blocked by admin");
        } else {
            next();
        }
    }
}