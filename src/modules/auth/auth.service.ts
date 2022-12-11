import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { ILogin, ILoginBase, IReturnLogin, ILoginPhone } from './auth.types';
import { USER_IS_BLOCKED_ERROR, USER_IS_BLOCKED_TYPE, LOGIN_ERROR_TYPE, LOGIN_ERROR } from '../users/user.contstants';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async googleLogin(req: ILogin) {
    const user = await this.usersService.findOneForEmail(req.email);
    if (user) {
      return user;
    }

    const newUser = {
      first_name: req.firstName,
      second_name: req.lastName,
      email: req.email,
      user_id: req.providerId,
      avatar: req.picture,
    };
    return await this.usersService.createUser(newUser);
  }

  async login(body: ILoginBase): Promise<IReturnLogin | void> {
    console.log('body in service', body);
    const user = await this.usersService.findOneForEmail(body.email);
    console.log('user', user);
    if (user) {
      if (!user.is_blocked) {
        if (!user.user_id) {
          throw new InternalServerErrorException(LOGIN_ERROR, LOGIN_ERROR_TYPE);
        }
        return user;
      } else {
        throw new InternalServerErrorException(USER_IS_BLOCKED_ERROR, USER_IS_BLOCKED_TYPE);
      }
    }

    const newUser = {
      first_name: body.name,
      second_name: body.surname,
      email: body.email,
      user_id: body.user_id,
      avatar: body.avatar_url,
    };

    return await this.usersService.createUser(newUser);
  }

  async phoneLogin(body: ILoginPhone): Promise<IReturnLogin | void> {
    let user = await this.usersService.findOneForPhone(body.phone);

    if (user) {
      if (user.is_blocked) {
        throw new InternalServerErrorException(USER_IS_BLOCKED_ERROR, USER_IS_BLOCKED_TYPE);
      } else if (body.username !== user.username) {
        // update username if needed
        await this.usersService.updateUserUsername(user.id, body.username);
        user = await this.usersService.findOneForPhone(body.phone);
      }
      return user;
    }
    return await this.usersService.createUser({
      username: body.username,
      phone: body.phone,
      user_id: body.user_id,
    });
  }
}
