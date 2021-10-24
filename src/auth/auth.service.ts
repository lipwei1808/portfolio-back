import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UpdatedUserDto } from 'src/auth/dto/updated-user.dto';

import { UserDocument } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { CreateUserDto } from './dto/create-user.dto';

// TODO: shift password hashing to user serivice or auth srrvice? (i think auth)

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<UserDocument> {
    const password = createUserDto.password;

    try {
      const hash = await this.hashPassword(password);
      return this.userService.addUser({ ...createUserDto, password: hash });
    } catch (e) {
      throw new Error(e);
    }
  }

  // creates token for login: used in AppController
  login(user): { access_token: string; refresh_token: string } {
    const refreshTokenPayload = {
      id: user._id,
    };
    return {
      access_token: this.generateAccessToken(user),
      refresh_token: this.jwtService.sign(refreshTokenPayload, {
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION'),
      }),
    };
  }

  // for subsequent requests: used in LocalStrategy
  validateUser(email: string) {
    return this.userService.findUser(email);
  }

  async refreshToken(id: string) {
    const user = await this.userService.findUserById(id);
    return {
      access_token: this.generateAccessToken(user),
      user: user,
    };
  }

  async updateUser(id: string, updatedUserDto: UpdatedUserDto) {
    let hash: string;
    if (updatedUserDto['password']) {
      const password = updatedUserDto['password'];
      try {
        hash = await this.hashPassword(password);
      } catch (e) {
        throw new Error(e);
      }
    }

    updatedUserDto['password'] = hash;
    return this.userService.updateUser(id, updatedUserDto);
  }

  generateAccessToken(user) {
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME'),
    });
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  }
}
