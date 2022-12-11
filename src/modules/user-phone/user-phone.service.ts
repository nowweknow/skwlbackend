import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { InjectTwilio, TwilioClient } from 'nestjs-twilio';
import { UserPhone } from '../entities/unverified_users.entity';
import { UsersService } from '../users/users.service';
import { JwtAuthService } from '../auth/jwt/jwt-auth.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserByPhoneDto } from './create-user-by-phone.dto';
import { ERROR_VARIFICATIONS_PHONE_NUMBERS } from './constants';

@Injectable()
export class UserPhoneService {
  constructor(
    @InjectRepository(UserPhone)
    private readonly userPhoneRepository: Repository<UserPhone>,
    private readonly usersService: UsersService,
    private configService: ConfigService,
    private jwtAuthService: JwtAuthService,
    private readonly authService: AuthService,
    @InjectTwilio() private readonly client: TwilioClient,
  ) {}

  async create(createUserPhoneDto: CreateUserByPhoneDto): Promise<UserPhone> {
    try {
      const { username, phone } = createUserPhoneDto;
      if (!phone) {
        throw new InternalServerErrorException('Enter phone number');
      }
      if (!username) {
        throw new InternalServerErrorException('Enter username');
      }
      const ifUserExists = await this.usersService.findOneForPhone(phone);
      if (ifUserExists) {
        throw new InternalServerErrorException('User already exists');
      }
      let foundPhone = await this.userPhoneRepository.findOne({ where: { phone } });

      const validation_code = Math.floor(1000 + Math.random() * 9000);
      if (foundPhone) {
        await this.userPhoneRepository.update(foundPhone.id, { username, validation_code });
        foundPhone = await this.userPhoneRepository.findOne({ where: { phone } });
      }

      const userData = { validation_code, username, phone };
      const text = `Here is your validation code ${validation_code}`;
      const recipients = phone;
      const sender = this.configService.get<string>('TWILIO_PHONE_NUMBER');

      if (!foundPhone) {
        const user = this.userPhoneRepository.create(userData);
        foundPhone = await this.userPhoneRepository.save(user);
      }

      this.client.messages.create({
        body: text,
        from: sender,
        to: recipients,
      });

      return foundPhone;
    } catch (err) {
      console.log('err: ', err);
      return err;
    }
  }

  async loginWithPhone(phone: string): Promise<any> {
    try {
      const user = await this.usersService.findOneForPhone(phone);
      if (!user) {
        throw new InternalServerErrorException('Wrong phone number');
      }
      const user_phone = await this.userPhoneRepository.findOne({
        where: { phone },
      });
      const generatedCode = Math.floor(1000 + Math.random() * 9000);
      if (!user_phone) {
        await this.userPhoneRepository.create({
          phone,
          validation_code: generatedCode,
          username: user.username,
        });
      } else {
        user_phone.validation_code = generatedCode;
      }
      await this.userPhoneRepository.save(user_phone);
      const text = `Here is your validation code ${generatedCode}`;
      const recipients = phone;
      const sender = this.configService.get<string>('TWILIO_PHONE_NUMBER');
      this.client.messages.create({
        body: text,
        from: sender,
        to: recipients,
      });
      return user_phone;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async verifyUserPhone(id: number, code: number) {
    try {
      const user = await this.userPhoneRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new InternalServerErrorException('Wrong user id');
      }

      if (user?.validation_code === code) {
        const userNew = await this.authService.phoneLogin({
          phone: user.phone,
          username: user.username,
          user_id: uuid(),
        });
        const { accessToken } = this.jwtAuthService.createAccessToken(userNew);

        return accessToken;
      } else if (user?.validation_code !== code) {
        throw new InternalServerErrorException(ERROR_VARIFICATIONS_PHONE_NUMBERS);
      }
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async updateByPhone(validationCode: number, phoneId: number): Promise<UpdateResult> {
    try {
      return await this.userPhoneRepository
        .createQueryBuilder('user_phone')
        .update()
        .set({
          validation_code: validationCode,
        })
        .where('id=:id', { id: phoneId })
        .execute();
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
